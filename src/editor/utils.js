import config from '@plone/volto/registry';
import { Node } from 'slate';

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
            if (!notesObjResult[node.data.zoteroId]) {
              notesObjResult[node.data.zoteroId] = {
                ...node.data,
              };
            } else if (notesObjResult[node.data.zoteroId].refs) {
              notesObjResult[node.data.zoteroId].refs[node.data.uid] = true;
            } else {
              // add its own uid in refs for easier parsing in html
              notesObjResult[node.data.zoteroId].refs = {
                [notesObjResult[node.data.zoteroId].uid]: true,
                [node.data.uid]: true,
              };
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
