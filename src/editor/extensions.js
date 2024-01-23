import { FOOTNOTE } from '../constants';
import { nanoid } from '@plone/volto-slate/utils';
import { Transforms } from 'slate';

export const withFootnote = (editor) => {
  const { normalizeNode, isInline } = editor;

  editor.isInline = (element) => {
    return element && element.type === FOOTNOTE ? true : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (node.type === FOOTNOTE && !node.data?.uid && node?.data?.footnote) {
      Transforms.setNodes(
        editor,
        {
          data: {
            uid: nanoid(5),
            footnote: node.data?.footnote,
          },
        },
        {
          at: path,
        },
      );
    }
    return normalizeNode(entry);
  };

  return editor;
};
// will replace existing uid with a new one
// this will be usefull when copy/pase items have the same uid
export const withBeforeInsertFragment = (editor) => {
  const { beforeInsertFragment } = editor;
  editor.beforeInsertFragment = (parsed) => {
    if (parsed?.[0]?.children?.[0]?.data?.uid) {
      parsed[0].children[0].data.uid = nanoid(5);
    }
    return beforeInsertFragment ? beforeInsertFragment(parsed) : parsed;
  };

  return editor;
};
