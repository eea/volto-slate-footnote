import { makeInlineElementPlugin } from 'volto-slate/components/ElementEditor';
import { FootnoteEditorSchema } from './schema';
import { withFootnote } from './extensions';
import { FOOTNOTE } from '../constants';
import { _insertElement } from 'volto-slate/components/ElementEditor/utils';
import { FootnoteElement } from './render';
import { defineMessages } from 'react-intl'; // , defineMessages
import { v4 as uuid } from 'uuid';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

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
    pluginId: FOOTNOTE,
    elementType: FOOTNOTE,
    element: FootnoteElement,
    isInlineElement: true,
    editSchema: FootnoteEditorSchema,
    extensions: [withFootnote],
    hasValue: (formData) => !!formData.footnote,
    insertElement: (editor, data) => {
      // the default behavior is _insertElement,
      // it returns whether an element was possibly inserted
      if (!_insertElement(FOOTNOTE)(editor, data)) {
        return;
      }

      const fd = editor.formContext.contextData.formData;

      // the usual functions used to work with the form state data
      const bfn = getBlocksFieldname(fd);
      const blfn = getBlocksLayoutFieldname(fd);
      const blocks = fd[bfn];
      const blocks_layout = fd[blfn];

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
        editor.formContext.setContextData({ formData });
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
