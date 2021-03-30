export const FootnoteBlockSchema = {
  title: 'Footnotes block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'global'],
    },
  ],
  properties: {
    title: {
      title: 'Block title',
      description: 'Friendly name to be displayed as block title',
      type: 'string',
    },
    global: {
      title: 'Entire document',
      description: 'Lookup citation references on the entire document',
      type: 'boolean',
    },
  },
  required: [],
};
