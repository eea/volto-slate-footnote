import config from '@plone/volto/registry';
import { Node } from 'slate';
import { getAllBlocks } from '@plone/volto-slate/utils';

/**
 * remove <?xml version="1.0"?> from the string
 * @param {*} footnote - xml format
 * @returns string
 */
export const makeFootnote = (footnote) => {
  return footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';
};

/**
 * Will open accordion if contains footnote reference
 * @param {string} footnoteId
 */
export const openAccordionIfContainsFootnoteReference = (footnoteId) => {
  if (typeof window !== 'undefined') {
    const footnote = document.querySelector(footnoteId);
    if (footnote !== null && footnote.closest('.accordion') !== null) {
      const comp = footnote.closest('.accordion').querySelector('.title');
      if (!comp.className.includes('active')) {
        comp.click();
      }
    }
  }

  return true;
};

const blockTypesOperations = {
  metadataSection: (block, properties) => {
    const fields = block?.fields || [];
    return fields
      .filter((field) => field?.field?.widget === 'slate')
      .reduce((accumulator, currentField) => {
        const fieldId = currentField.field.id;
        const propertiesBlocks = (properties[fieldId] || []).map(
          (propertyBlockValue) => ({
            '@type': 'slate',
            id: fieldId,
            value: [propertyBlockValue],
          }),
        );
        return [...accumulator, ...propertiesBlocks];
      }, []);
  },
  metadata: (block, properties) => {
    const fId = block?.data?.id;
    return block?.data?.widget === 'slate'
      ? [
          {
            '@type': 'slate',
            id: fId,
            value: properties[fId]?.length ? properties[fId] : null,
          },
        ]
      : [];
  },
  slateTable: (block) => {
    return (block?.table?.rows || []).reduce((accumulator, currentRow) => {
      const cellsBlocks = (currentRow.cells || []).map((cell) => ({
        '@type': 'slate',
        ...cell,
      }));
      return [...accumulator, ...cellsBlocks];
    }, []);
  },
  defaultOperation: (block) => {
    return [block];
  },
};

/**
 * Extends volto-slate getAllBlocks functionality also to SlateJSONFields
 * inserted within blocks via Metadata / Metadata section block
 * @param {Object} properties metadata properties received by the View component
 * @returns {Array} Returns a flat array of blocks and slate fields
 */
export const getAllBlocksAndSlateFields = (properties) => {
  const blocks = getAllBlocks(properties, []);
  return blocks.reduce((accumulator, currentblock) => {
    return [
      ...accumulator,
      ...(blockTypesOperations[currentblock['@type']]
        ? blockTypesOperations[currentblock['@type']](currentblock, properties)
        : blockTypesOperations.defaultOperation(currentblock)),
    ];
  }, []);
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
    .filter((b) => b['@type'] in config.settings.blocksWithFootnotesSupport)
    .forEach((element) => {
      const mapping = config.settings.blocksWithFootnotesSupport[
        element['@type']
      ] || ['value'];

      mapping.forEach((key) => {
        const value = element[key];
        if (!value) return;

        value.forEach((item) => {
          // Node.elements(item) returns an iterable generator of nodes
          Array.from(Node.elements(item)).forEach(([node]) => {
            if (footnotes.includes(node.type) && node.data) {
              // for citations (Zotero items) create refs for same zoteroId
              if (node.data.zoteroId) {
                iterateZoteroObj(notesObjResult, node.data);
                // itereate the extra obj for multiple citations
                if (node.data.extra) {
                  node.data.extra.forEach((zoteroObjItem) =>
                    // send the uid of the parent
                    // of the word the will have the reference indice
                    iterateZoteroObj(
                      notesObjResult,
                      zoteroObjItem,
                      node.data.uid,
                    ),
                  );
                }
                // for footnotes - create refs, on identical text
              } else {
                iterateFootnoteObj(notesObjResult, node.data);
                if (node.data.extra) {
                  node.data.extra.forEach((footnoteObjItem) =>
                    // since is called in case of extra, the parent is needed
                    iterateFootnoteObj(
                      notesObjResult,
                      footnoteObjItem,
                      node.data.uid,
                    ),
                  );
                }
              }
            }
          });
        });
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

/**
 * Will change the notesObjResultTemp to add new property if the footnote uid is new or add to the refs of the existing ones
 * Some footnotes will always be in extra, so we need parentId to know where to find it in render
 * @param {Object} notesObjResultTemp - the object that will configure the zotero items
 * @param {Object} node - the footnote object
 * @param {string} node.zoteroId - id of the zotero citation
 * @param {string} node.parentUid - id of the parent footnote
 * @param {string} node.uid - id of the slate item
 * @param {string} node.footnote - xml citation from zotero
 * @param {string} parentUid - will be needed because html element (the word) that references multiple citations
 * will have the id as the main uid, the ids from the extra will not matter in this case
 */
const iterateFootnoteObj = (notesObjResultTemp, node, parentUid) => {
  const uid = parentUid || node.uid;
  const found = Object.keys(notesObjResultTemp).find((noteId) => {
    return notesObjResultTemp[noteId].footnote === node.footnote;
  });
  // has not yet been added
  if (!found) {
    // will use the parentUid instead of own uid for render to be able to reference to the correct element
    //(word containing the footnotes)
    notesObjResultTemp[node.uid] = parentUid
      ? { ...node, parentUid }
      : { ...node };
    // the element is found, just add it's own uid to the list of refs, the parent is already known
  } else if (notesObjResultTemp[found].refs) {
    notesObjResultTemp[found].refs[uid] = true;
  } else {
    // element found but doesn't have refs yet, this means that it is a parent, so add it's existing uid and the current one
    notesObjResultTemp[found].refs = {
      [found]: true,
      [uid]: true,
    };
  }
};
