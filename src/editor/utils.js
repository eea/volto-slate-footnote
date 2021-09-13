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
 * Extends volto-slate getAllBlocks functionality also to SlateJSONFields
 * inserted within blocks via Metadata / Metadata section block
 * @param {Object} properties metadata properties received by the View component
 * @returns {Array} Returns a flat array of blocks and slate fields
 */
export const getAllBlocksAndSlateFields = (properties) => {
  const blocks = getAllBlocks(properties, []);
  const flat_blocks = [];
  for (const b_idx in blocks) {
    const block = blocks[b_idx];
    if (block['@type'] === 'metadataSection') {
      const fields = block.fields;
      for (const f_idx in fields) {
        const field = fields[f_idx];
        if (field?.field?.widget === 'slate') {
          const field_id = field.field.id;
          flat_blocks.push({
            '@type': 'slate',
            id: field_id,
            value: properties[field_id]?.length ? properties[field_id] : null,
          });
        }
      }
    } else if (block['@type'] === 'metadata') {
      if (block?.data?.widget === 'slate') {
        const f_id = block.data.id;
        flat_blocks.push({
          '@type': 'slate',
          id: f_id,
          value: properties[f_id]?.length ? properties[f_id] : null,
        });
      }
    } else {
      flat_blocks.push(block);
    }
  }
  return flat_blocks;
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
          } else if (node.data.extra) {
            iterateFootnoteObj(notesObjResult, node.data);
            node.data.extra.forEach((footnoteObjItem) =>
              // send the uid of the parent
              // of the word the will have the reference indice
              iterateFootnoteObj(
                notesObjResult,
                footnoteObjItem,
                node.data.uid,
              ),
            );
          } else {
            iterateFootnoteObj(notesObjResult, node.data);
          }
        }
      });
    });

  return notesObjResult;
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

const iterateFootnoteObj = (notesObjResultTemp, node, parentUid) => {
  const uid = parentUid || node.uid;
  const found = Object.keys(notesObjResultTemp).find((noteId) => {
    return notesObjResultTemp[noteId].footnote === node.footnote;
  });

  if (!found) {
    notesObjResultTemp[node.uid] = parentUid
      ? { ...node, parentUid }
      : { ...node };
  } else if (notesObjResultTemp[found].refs) {
    notesObjResultTemp[found].refs[node.uid] = true;
  } else {
    // add its own uid in refs for easier parsing in html
    notesObjResultTemp[found].refs = {
      [notesObjResultTemp[found].uid]: true,
      [uid]: true,
    };
  }
};
