const Schema = {
  title: 'Footnotes block settings',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'title',
        'placeholder',
        'instructions',
        'required',
        'fixed',
        'disableNewBlocks',
        'readOnly',
        'readOnlySettings',
      ],
    },
  ],
  properties: {
    title: {
      title: 'Block title',
    },
    placeholder: {
      title: 'Helper text',
      description:
        'A short hint that describes the expected value within this block',
      type: 'string',
    },
    instructions: {
      title: 'Instructions',
      description: 'Detailed expected value within this block',
      type: 'string',
      widget: 'richtext',
    },
    required: {
      title: 'Required',
      description: "Don't allow deletion of this block",
      type: 'boolean',
    },
    fixed: {
      title: 'Fixed position',
      description: 'Disable drag & drop on this block',
      type: 'boolean',
    },
    disableNewBlocks: {
      title: 'Disable new blocks',
      description: 'Disable creation of new blocks after this block',
      type: 'boolean',
    },
    readOnly: {
      title: 'Read-only',
      description: 'Disable editing on this block',
      type: 'boolean',
    },
    readOnlySettings: {
      title: 'Read-only settings',
      description: 'Disable editing on section block settings',
      type: 'boolean',
    },
  },
  required: [],
};

export default Schema;
