import ReactDOM from 'react-dom';
import { defineMessages } from 'react-intl'; // , defineMessages
import { v4 as uuid } from 'uuid';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { _insertElement } from '@plone/volto-slate/elementEditor/utils';
import { FootnoteEditorSchema } from './schema';
import { withFootnote, withBeforeInsertFragment } from './extensions';
import { FOOTNOTE } from '../constants';
import { FootnoteElement } from './render';
import FootnoteEditor from './FootnoteEditor';

import './styles.less';

const messages = defineMessages({
  edit: {
    id: 'Edit footnote',
    defaultMessage: 'Edit footnote',
  },
  delete: {
    id: 'Remove footnote',
    defaultMessage: 'Remove footnote',
  },
});

export default function install(config) {
  const opts = {
    title: 'Footnote',
    pluginId: FOOTNOTE,
    elementType: FOOTNOTE,
    pluginEditor: FootnoteEditor,
    element: FootnoteElement,
    isInlineElement: true,
    editSchema: FootnoteEditorSchema,
    extensions: [withFootnote, withBeforeInsertFragment],
    hasValue: (formData) => !!formData.footnote,
    insertElement: (editor, data) => {
      // the default behavior is _insertElement,
      // it returns whether an element was possibly inserted
      console.log(editor.selection.anchor, editor.selection.anchor);
      if (!_insertElement(FOOTNOTE)(editor, data)) {
        return;
      }

      if (!editor.getBlockProps) return;

      const { properties, onChangeField } = editor.getBlockProps();

      // the usual functions used to work with the form state data
      const blocksFieldname = getBlocksFieldname(properties);
      const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);

      const blocks = properties?.[blocksFieldname] || {};
      const blocks_layout = properties?.[blocksLayoutFieldname] || {};

      // Auto-add footnote block
      if (config?.blocks?.blocksConfig?.slateFootnotes?.autoAdd) {
        // whether the footnotes block exists already
        let footnotesBlockExists = false;
        for (const b in blocks) {
          const bb = blocks[b];
          if (bb['@type'] === 'slateFootnotes') {
            footnotesBlockExists = true;
            break;
          }
        }
        // if not, create it
        if (!footnotesBlockExists) {
          const id = uuid();
          const nb = {
            '@type': 'slateFootnotes',
            title: 'Footnotes',
          };
          const formData = {
            blocks: { ...blocks, [id]: nb },
            blocks_layout: {
              items: [...blocks_layout.items, id],
            },
          };

          ReactDOM.unstable_batchedUpdates(() => {
            onChangeField(blocksFieldname, formData[blocksFieldname]);
            onChangeField(
              blocksLayoutFieldname,
              formData[blocksLayoutFieldname],
            );
          });
        }
      }
    },
    messages,
  };
  const [installFootnoteEditor] = makeInlineElementPlugin(opts);
  config = installFootnoteEditor(config);

  const { slate } = config.settings;

  slate.toolbarButtons = [...(slate.toolbarButtons || []), 'footnote'];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    'footnote',
  ];

  return config;
}
