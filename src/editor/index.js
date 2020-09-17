import { makeInlineElementPlugin } from 'volto-slate/components/ElementEditor';
import { FootnoteEditorSchema } from './schema';
import { withFootnote } from './extensions';
import { FOOTNOTE } from '../constants';
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
    afterElementIsInserted: (editor, formContext, data) => {
      console.log('afterElementIsInserted data is', data);
      const fd = formContext.contextData.formData;
      const bfn = getBlocksFieldname(fd);
      const blfn = getBlocksLayoutFieldname(fd);

      const blocks = fd[bfn];
      const blocks_layout = fd[blfn];

      // console.log('log', { blocks, blocks_layout });
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
        formContext.setContextData(obj);
        // console.log('AFTER formContext:', formContext);
      }

      console.log(
        'JUST LOGGING AROUND',
        formContext /*editor.getBlockProps() */,
      );
      // function createSlateBlock(value, { index, onChangeBlock, onAddBlock }) {
      //   return new Promise((resolve) => {
      //     onAddBlock('slate', index + 1).then((id) => {
      //       const options = {
      //         '@type': 'slate',
      //         value: JSON.parse(JSON.stringify(value)),
      //         plaintext: serializeNodesToText(value),
      //       };
      //       onChangeBlock(id, options).then(() => resolve(id));
      //     });
      //   });
      // }
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
