import { defineMessages } from 'react-intl';

const messages = defineMessages({
  footnoteBlock: {
    id: 'footnoteBlock',
    defaultMessage: 'Footnote block',
  },
  default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  blockTitle: {
    id: 'blockTitle',
    defaultMessage: 'Block title',
  },
  blockTitleDescription: {
    id: 'blockTitleDescription',
    defaultMessage: 'Friendly name to be displayed as block title',
  },
  entireDocument: {
    id: 'entireDocument',
    defaultMessage: 'Entire document',
  },
  entireDocumentDescription: {
    id: 'entireDocumentDescription',
    defaultMessage: 'Lookup citation references on the entire document',
  },
});

export const FootnoteBlockSchema = (intl) => ({
  title: intl.formatMessage(messages.footnoteBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: ['title', 'global'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.blockTitle),
      description: intl.formatMessage(messages.blockTitleDescription),
      type: 'string',
    },
    global: {
      title: intl.formatMessage(messages.entireDocument),
      description: intl.formatMessage(messages.entireDocumentDescription),
      type: 'boolean',
    },
  },
  required: [],
});
