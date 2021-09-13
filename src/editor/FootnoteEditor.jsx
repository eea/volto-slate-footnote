import { isEqual } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { setPluginOptions } from 'volto-slate/actions';
import { Icon as VoltoIcon, InlineForm } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
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

  const blockProps = editor?.getBlockProps ? editor.getBlockProps() : {};
  const metadata = blockProps.metadata || blockProps.properties || {};
  const blocks = getAllBlocks(metadata, []);
  const filteredBlocks = [];

  // make a list of filtered footnotes that have unique title
  blocks
    .filter((b) => b['@type'] === 'slate')
    .forEach(({ value }) => {
      if (!value) return;

      Array.from(Node.elements(value[0])).forEach(([block]) => {
        block.children.forEach((node) => {
          // console.log({ node });
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
              // console.log({ ftitem });
              // console.log({ filteredBlocks });
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

  if (isElement && !isEqual(elementNode, elRef.current)) {
    elRef.current = elementNode;
    // console.log('Editor F elementNode.data', elementNode.data);
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

  const saveDataToEditor = React.useCallback(
    (formData) => {
      // console.log({ formData });
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
        // console.log('schemaWithUpdatedChoices', { formData });
        // console.log('SchemaProvider', { props });
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
        // console.log('EDitor SchemaProvider', { formData });

        return (
          <InlineForm
            schema={schemaWithUpdatedChoices}
            title={schema.title}
            icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
            onChangeField={(value) => {
              console.log('Inline onChangeField', { value });
              console.log('Inline onChangeField', { formData });

              // const extra = value.slice(1);
              // console.log('Inline extra', { extra });

              // const footnoteResult = { ...formData.footnote, extra };
              // const resultFormData = {
              //   footnote: footnoteResult,
              // };
              // console.log('Inline resultFormData', resultFormData);

              if (!onChangeValues) {
                return setFormData(value);
              }
              return onChangeValues('footnote', value, formData, setFormData);
            }}
            formData={formData}
            dataBoss={formData}
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
