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
      if (!_insertElement(FOOTNOTE)(editor, data)) {
        return;
      }

      const fd = editor.formContext.contextData.formData;
      const bfn = getBlocksFieldname(fd);
      const blfn = getBlocksLayoutFieldname(fd);

      const blocks = fd[bfn];
      const blocks_layout = fd[blfn];

      let footnotesBlockExists = false;
      for (const b in blocks) {
        const bb = blocks[b];
        if (bb['@type'] === 'slateFootnotes') {
          footnotesBlockExists = true;
          break;
        }
      }

      if (!footnotesBlockExists) {
        const nb = {
          '@type': 'slateFootnotes',
          title: 'Footnotes',
        };
        const nbWithId = {
          '@type': 'slateFootnotes',
          '@id': uuid(),
          title: 'Footnotes',
        };
        const obj = {
          formData: {
            blocks: { ...blocks, [nbWithId['@id']]: nb },
            blocks_layout: {
              items: [...blocks_layout.items, nbWithId['@id']],
            },
          },
        };
        editor.formContext.setContextData(obj);
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
