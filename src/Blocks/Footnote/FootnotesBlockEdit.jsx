import React from 'react';
import FootnotesBlockView from './FootnotesBlockView';
import { InlineForm, SidebarPortal } from '@plone/volto/components';
import { FootnoteBlockSchema as schema } from './schema';
import { Segment } from 'semantic-ui-react';

/**
 * @summary The React component that allows the footnotes block view to be
 * edited using a form in a sidebar portal.
 * @param {object} props Contains the props received by any Edit component of a
 * registered Volto block: `selected`, `block`, `data`, `onChangeBlock` etc.
 */
const FootnotesBlockEdit = (props) => {
  const { selected, block, data, onChangeBlock, properties } = props;
  // Get editing instructions from block settings or props
  let instructions = data?.instructions?.data || data?.instructions;
  if (!instructions || instructions === '<p><br/></p>') {
    instructions = props.formDescription;
  }

  const blockSchema = schema(props.intl);

  return (
    <>
      <FootnotesBlockView {...props} properties={properties} />
      <SidebarPortal selected={selected}>
        {instructions && (
          <Segment attached>
            <div dangerouslySetInnerHTML={{ __html: instructions }} />
          </Segment>
        )}
        {!data?.readOnlySettings && (
          <InlineForm
            schema={blockSchema}
            title={blockSchema.title}
            onChangeField={(id, value) => {
              onChangeBlock(block, {
                ...data,
                [id]: value,
              });
            }}
            formData={data}
          />
        )}
      </SidebarPortal>
    </>
  );
};

export default FootnotesBlockEdit;
