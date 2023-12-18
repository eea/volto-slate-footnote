import { isEqual, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactEditor } from 'slate-react';
import { setPluginOptions } from '@plone/volto-slate/actions';
import { Icon as VoltoIcon, InlineForm } from '@plone/volto/components';

import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Node, Editor } from 'slate';
import { getAllBlocksAndSlateFields } from '@eeacms/volto-slate-footnote/editor/utils';
import config from '@plone/volto/registry';

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
  const pid = `${editor.uid}-${pluginId}`;
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
  const metadataBlocks = getAllBlocksAndSlateFields(metadata);
  const storeBlocks = getAllBlocksAndSlateFields(initialFormData);
  const uniqueFootnoteBlocks = [];

  const flatAllBlocks = isEmpty(metadata) ? storeBlocks : metadataBlocks;
  /**
   * Will add only the items that are unique by text
   * @param {Object[]} uniqueFootnoteBlocks
   * @param {Object} itemToManage
   */
  const manageAddBlockToUniqueBlocks = (uniqueFootnoteBlocks, itemToManage) => {
    if (
      !uniqueFootnoteBlocks.find((item) => item.title === itemToManage.footnote)
    ) {
      uniqueFootnoteBlocks.push({
        ...itemToManage,
        title: itemToManage.footnote || itemToManage.value,
        label: itemToManage.footnote || itemToManage.value,
        value: itemToManage.footnote || itemToManage.value,
      });
    }
  };
  // make a list of filtered footnotes that have unique title
  // to be used as choices for the multi search widget
  // add label and value for the multi search widget
  // flatten blocks to add all extra in the list
  flatAllBlocks
    .filter((b) => b['@type'] in config.settings.blocksWithFootnotesSupport)
    .forEach((element) => {
      const mapping = config.settings.blocksWithFootnotesSupport[
        element['@type']
      ] || ['value'];

      mapping.forEach((key) => {
        const value = element[key];
        if (!value) return;

        value.forEach((item) => {
          Array.from(Node.elements(item)).forEach(([block]) => {
            block.children.forEach((node) => {
              if (node.data && node.type === 'footnote') {
                manageAddBlockToUniqueBlocks(uniqueFootnoteBlocks, node.data);
                (node.data.extra || []).forEach((ftitem) => {
                  manageAddBlockToUniqueBlocks(uniqueFootnoteBlocks, ftitem);
                });
              }
            });
          });
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
      console.log({ editor }, formData.footnote);
      console.log();
      if (
        hasValue(formData.footnote) &&
        editor?.selection?.anchor &&
        editor?.selection?.focus
      ) {
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
              choices: uniqueFootnoteBlocks,
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
            dataBoss={formData}
            source={uniqueFootnoteBlocks}
            headerActions={
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    saveDataToEditor(formData);
                    dispatch(
                      setPluginOptions(pid, {
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
                      setPluginOptions(pid, {
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
