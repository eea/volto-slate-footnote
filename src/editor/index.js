import { makeInlineElementPlugin } from 'volto-slate/components/ElementEditor';
import { FootnoteEditorSchema } from './schema';
import { withFootnote } from './extensions';
import { FOOTNOTE } from '../constants';
import { FootnoteElement } from './render';
import { defineMessages } from 'react-intl'; // , defineMessages

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
    elementType: FOOTNOTE,
    pluginId: FOOTNOTE,
    isInlineElement: true,
    editSchema: FootnoteEditorSchema,
    extensions: [withFootnote],
    hasValue: (formData) => !!formData.footnote,
    elements: {
      footnote: FootnoteElement,
    },
    messages,
  };
  const [installFootnoteEditor] = makeInlineElementPlugin(opts);
  config = installFootnoteEditor(config);

  return config;
}
