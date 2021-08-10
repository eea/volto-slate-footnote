import { isEqual } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { setPluginOptions } from 'volto-slate/actions';
import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import InlineForm from './InlineForm';
import { Node } from 'slate';
import { getAllBlocks } from 'volto-slate/utils';

const FootnoteEditor = (props) => {
  const {
    editor,
    schemaProvider,
    pluginId,
    getActiveElement,
    isActiveElement,
    insertElement,
    unwrapElement,
    hasValue,
    onChangeValues,
  } = props;

  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({});

  const active = getActiveElement(editor);

  if (!active) {
    /* eslint no-console: 0 */
    console.error('Active element not found, this will crash');
  }
  const [elementNode] = active;
  const isElement = isActiveElement(editor);

  const blocks = [];
  const filteredBlocks = [];

  const blockProps = editor.getBlockProps();
  const metadata = blockProps.metadata || blockProps.properties;
  getAllBlocks(metadata, blocks);

  // make a list of filtered footnotes that have unique title
  blocks
    .filter((b) => b['@type'] === 'slate')
    .forEach(({ value }) => {
      if (!value) return;

      Array.from(Node.elements(value[0])).forEach(([block]) => {
        block.children.forEach((node) => {
          if (
            node.data &&
            node.type === 'footnote' &&
            !filteredBlocks.find((item) => item.title === node.data.footnote)
          ) {
            filteredBlocks.push({
              ...node.data,
              title: node.data.footnote,
            });
          }
        });
      });
    });

  // Update the form data based on the current element
  const elRef = React.useRef(null);

  if (isElement && !isEqual(elementNode, elRef.current)) {
    elRef.current = elementNode;
    setFormData(elementNode.data || {});
  } else if (!isElement) {
    elRef.current = null;
  }

  const saveDataToEditor = React.useCallback(
    (formData) => {
      if (hasValue(formData)) {
        insertElement(editor, formData);
      } else {
        unwrapElement(editor);
      }
    },
    [editor, insertElement, unwrapElement, hasValue],
  );

  const checkForCancel = () => {
    if (!hasValue(elementNode.data)) {
      unwrapElement(editor);
    }
  };

  const SchemaProvider = schemaProvider;

  return (
    <SchemaProvider {...props} data={formData}>
      {(schema) => (
        <InlineForm
          schema={schema}
          title={schema.title}
          icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
          onChangeField={(value) => {
            if (!onChangeValues) {
              return setFormData({
                ...formData,
                ...value,
              });
            }
            return onChangeValues('footnote', value, formData, setFormData);
          }}
          formData={formData}
          source={filteredBlocks}
          headerActions={
            <>
              <button
                onClick={() => {
                  saveDataToEditor(formData);
                  dispatch(
                    setPluginOptions(pluginId, { show_sidebar_editor: false }),
                  );
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={checkSVG} />
              </button>
              <button
                onClick={() => {
                  checkForCancel();
                  dispatch(
                    setPluginOptions(pluginId, { show_sidebar_editor: false }),
                  );
                  setFormData({});
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={clearSVG} />
              </button>
            </>
          }
        />
      )}
    </SchemaProvider>
  );
};

export default FootnoteEditor;
