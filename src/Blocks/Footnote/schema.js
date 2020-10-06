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
    },
    global: {
      title: 'Entire document',
      description: 'Lookup citation references on the entire document',
      type: 'boolean',
    },
  },
  required: [],
};
