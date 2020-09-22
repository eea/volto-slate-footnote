import React from 'react';
import FootnotesBlockView from './FootnotesBlockView';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import { FootnoteBlockSchema as schema } from './schema';
import { SidebarPortal } from '@plone/volto/components';

/**
 * @summary The React component that allows the footnotes block view to be
 * edited using a form in a sidebar portal.
 * @param {object} props Contains the props received by any Edit component of a
 * registered Volto block: `selected`, `block`, `data`, `onChangeBlock` etc.
 */
const FootnotesBlockEdit = (props) => {
  const { selected, block, data, onChangeBlock, properties } = props;
  return (
    <>
      <FootnotesBlockView {...props} properties={properties} />
      <SidebarPortal selected={selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default FootnotesBlockEdit;
