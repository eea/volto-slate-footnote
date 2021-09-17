import { isEqual } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { setPluginOptions } from 'volto-slate/actions';
import { Icon as VoltoIcon, InlineForm } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Node } from 'slate';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getAllBlocksAndSlateFields } from '@eeacms/volto-slate-footnote/editor/utils';

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
  const initialFormData = useSelector((state) => state?.content?.data || {});

  if (!active) {
    /* eslint no-console: 0 */
    console.error('Active element not found, this will crash');
  }
  const [elementNode] = active;
  const isElement = isActiveElement(editor);

  const blockProps = editor?.getBlockProps ? editor.getBlockProps() : {};
  const metadata = blockProps.metadata || blockProps.properties || {};
  const blocks = getAllBlocksAndSlateFields(metadata);
  const storeBlocks = getAllBlocksAndSlateFields(initialFormData);
  const filteredBlocks = [];

  const resultBlocks = isEmpty(metadata) ? storeBlocks : blocks;
  // make a list of filtered footnotes that have unique title
  // to be used as choices for the multi search widget
  // add label and value for the multi search widget
  // flatten blocks to add all extra in the list
  resultBlocks
    .filter((b) => b['@type'] === 'slate')
    .forEach(({ value }) => {
      if (!value) return;

      Array.from(Node.elements(value[0])).forEach(([block]) => {
        block.children.forEach((node) => {
          if (node.data && node.type === 'footnote' && node.data.extra) {
            if (
              !filteredBlocks.find((item) => item.title === node.data.footnote)
            ) {
              filteredBlocks.push({
                ...node.data,
                title: node.data.footnote || node.data.value,
                label: node.data.footnote || node.data.value,
                value: node.data.footnote || node.data.value,
              });
            }
            node.data.extra.forEach((ftitem) => {
              if (
                !filteredBlocks.find((item) => item.title === ftitem.footnote)
              ) {
                filteredBlocks.push({
                  ...ftitem,
                  title: ftitem.footnote || ftitem.value,
                  label: ftitem.footnote || ftitem.value,
                  value: ftitem.footnote || ftitem.value,
                });
              }
            });
          } else if (
            node.data &&
            node.type === 'footnote' &&
            !filteredBlocks.find((item) => item.title === node.data.footnote)
          ) {
            filteredBlocks.push({
              ...node.data,
              title: node.data.footnote,
              label: node.data.footnote,
              value: node.data.footnote,
            });
          }
        });
      });
    });

  // Update the form data based on the current element
  const elRef = React.useRef(null);

  // add label and value for the multi search widget to be able to show/filter current data
  if (isElement && !isEqual(elementNode, elRef.current)) {
    elRef.current = elementNode;
    setFormData({
      footnote: {
        ...elementNode.data,
        label: elementNode.data.footnote,
        value: elementNode.data.footnote,
      },
    });
  } else if (!isElement) {
    elRef.current = null;
  }

  useEffect(() => {
    if (isElement) {
      elRef.current = elementNode;
      setFormData({
        footnote: {
          ...elementNode.data,
          label: elementNode.data.footnote,
          value: elementNode.data.footnote,
        },
      });
    } else if (!isElement) {
      elRef.current = null;
    }
  }, [isElement, elRef, elementNode]); // eslint-disable-line

  const saveDataToEditor = React.useCallback(
    (formData) => {
      if (hasValue(formData.footnote)) {
        insertElement(editor, formData.footnote);
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
      {(schema) => {
        const schemaWithUpdatedChoices = {
          ...schema,
          properties: {
            ...schema.properties,
            footnote: {
              ...schema.properties.footnote,
              choices: filteredBlocks,
            },
          },
        };

        return (
          <InlineForm
            schema={schemaWithUpdatedChoices}
            title={schema.title}
            icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
            onChangeField={(value) => {
              if (!onChangeValues) {
                return setFormData(value);
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
                      setPluginOptions(pluginId, {
                        show_sidebar_editor: false,
                      }),
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
                      setPluginOptions(pluginId, {
                        show_sidebar_editor: false,
                      }),
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
        );
      }}
    </SchemaProvider>
  );
};

export default FootnoteEditor;
