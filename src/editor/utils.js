import config from '@plone/volto/registry';
import { Node } from 'slate';
import { getAllBlocks } from 'volto-slate/utils';

/**
 * remove <?xml version="1.0"?> from the string
 * @param {*} footnote - xml format
 * @returns string
 */
export const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

/**
 * Will change the notesObjResultTemp to add new property if the zoteroId is new or add to the existing ones refs
 * @param {Object} notesObjResultTemp - the object that will configure the zotero items
 * @param {Object} zoteroObj - the footnote object
 * @param {string} zoteroObj.zoteroId - id of the zotero citation
 * @param {string} zoteroObj.uid - id of the slate item
 * @param {string} zoteroObj.footnote - xml citation from zotero
 * @param {string} parentUid - will be needed because html element (the word) that references multiple citations
 * will have the id as the main uid, the ids from the extra will not matter in this case
 */
const iterateZoteroObj = (notesObjResultTemp, zoteroObj, parentUid) => {
  const uid = parentUid || zoteroObj.uid;
  // add new zoteroId
  if (!notesObjResultTemp[zoteroObj.zoteroId]) {
    notesObjResultTemp[zoteroObj.zoteroId] = {
      ...zoteroObj,
      uid,
    };
    // if zoteroId and refs exist then add the uid to the refs
  } else if (notesObjResultTemp[zoteroObj.zoteroId].refs) {
    notesObjResultTemp[zoteroObj.zoteroId].refs[uid] = true;
  } else {
    // if zoteroId exists but not refs, add its own uid also in refs for easier parsing in html
    notesObjResultTemp[zoteroObj.zoteroId].refs = {
      [notesObjResultTemp[zoteroObj.zoteroId].uid]: true,
      [uid]: true,
    };
  }
};

/**
 * Extends volto-slate getAllBlocks functionality also to SlateJSONFields
 * inserted within blocks are via Metadata section block
 * @param {Object} properties A prop received by the View component
 * @param {Array} blocks An array where to recursively store the output
 * @returns {Array} Returns a flat array of blocks and slate fields
 */
export const getAllBlocksAndSlateFields = (properties) => {
  const blocks = getAllBlocks(properties, []);
  const new_blocks = [];
  for (const b_idx in blocks) {
    const block = blocks[b_idx];
    if (block['@type'] === 'metadataSection') {
      const fields = block.fields;
      for (const f_idx in fields) {
        const field = fields[f_idx];
        if (field?.field?.widget === 'slate') {
          const field_id = field.field.id;
          new_blocks.push({
            '@type': 'slate',
            id: field_id,
            value: properties[field_id] || [],
          });
        }
      }
    } else {
      new_blocks.push(block);
    }
  }
  return new_blocks;
};

/**
 * Will make an object with keys for every zoteroId and some uid that are unique
 * or referenced multiple times
 * - objects will have a refs object if more footnotes reference the same one
 * - for citations, same zoteroId
 * - for footnotes, identical text
 * @param {Object} blocks
 * @returns {Object} notesObjResult
 */
export const makeFootnoteListOfUniqueItems = (blocks) => {
  const { footnotes } = config.settings;
  let notesObjResult = {};

  blocks
    .filter((b) => b['@type'] === 'slate')
    .forEach(({ value }) => {
      if (!value) return;
      // Node.elements(value[0]) returns an iterable generator of nodes
      Array.from(Node.elements(value[0])).forEach(([node]) => {
        if (footnotes.includes(node.type) && node.data) {
          // for citations (Zotero items) create refs for same zoteroId
          if (node.data.zoteroId) {
            iterateZoteroObj(notesObjResult, node.data);
            // itereate the extra obj for multiple citations
            if (node.data.extra) {
              node.data.extra.forEach((zoteroObjItem) =>
                // send the uid of the parent
                // of the word the will have the reference indice
                iterateZoteroObj(notesObjResult, zoteroObjItem, node.data.uid),
              );
            }
            // for footnotes - create refs, on identical text
          } else {
            const found = Object.keys(notesObjResult).find(
              (noteId) =>
                notesObjResult[noteId].footnote === node.data.footnote,
            );

            if (!found) {
              notesObjResult[node.data.uid] = { ...node.data };
            } else if (notesObjResult[found].refs) {
              notesObjResult[found].refs[node.data.uid] = true;
            } else {
              // add its own uid in refs for easier parsing in html
              notesObjResult[found].refs = {
                [notesObjResult[found].uid]: true,
                [node.data.uid]: true,
              };
            }
          }
        }
      });
    });

  return notesObjResult;
};
