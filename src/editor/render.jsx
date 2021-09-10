import React, { useEffect, useState } from 'react';
import { Popup, List } from 'semantic-ui-react';
import { useEditorContext } from 'volto-slate/hooks';
import { getAllBlocksAndSlateFields } from '@eeacms/volto-slate-footnote/editor/utils';
import { makeFootnoteListOfUniqueItems } from './utils';

const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

const toggleAccordionReference = (footnoteId) => {
  if (typeof window !== 'undefined') {
    const footnote = document.querySelector(footnoteId);
    if (footnote !== null && footnote.closest('.accordion') !== null) {
      const comp = footnote.closest('.accordion').querySelector('.title');
      if (!comp.className.includes('active')) {
        comp.click();
      }
    }
  }

  return true;
};

export const FootnoteElement = (props) => {
  const { attributes, children, element, mode, extras } = props;
  const { data = {} } = element;
  const { uid, zoteroId } = data;
  const editor = useEditorContext();
  const [citationIndice, setCitationIndice] = useState(null);
  const [citationRefId, setCitationRefId] = useState(null);

  useEffect(() => {
    const blockProps = editor?.getBlockProps ? editor.getBlockProps() : null;
    const metadata = blockProps
      ? blockProps.metadata || blockProps.properties
      : extras?.metadata || {};
    const blocks = getAllBlocksAndSlateFields(metadata);
    const notesObjResult = makeFootnoteListOfUniqueItems(blocks);

    const indice = zoteroId
      ? data.extra
        ? [
            `[${Object.keys(notesObjResult).indexOf(zoteroId) + 1}]`,
            ...data.extra.map(
              (zoteroObj, index) =>
                `[${
                  Object.keys(notesObjResult).indexOf(zoteroObj.zoteroId) + 1
                }]`,
            ),
          ].join('')
        : `[${Object.keys(notesObjResult).indexOf(zoteroId) + 1}]`
      : notesObjResult[data.uid]
      ? `[${Object.keys(notesObjResult).indexOf(data.uid) + 1}]`
      : `[${
          Object.keys(notesObjResult).indexOf(
            Object.keys(notesObjResult).find(
              (noteKey) =>
                notesObjResult[noteKey].refs &&
                notesObjResult[noteKey].refs[data.uid],
            ),
          ) + 1
        }]`;

    const findReferenceId =
      // search within parent citations first, otherwise the uid might be inside a refs obj that comes before
      Object.keys(notesObjResult).find(
        (noteKey) => notesObjResult[noteKey].uid === uid,
      ) ||
      // if not found in parent, search in refs, it might be a footnote references multiple times
      Object.keys(notesObjResult).find(
        (noteKey) =>
          notesObjResult[noteKey].uid === uid ||
          (notesObjResult[noteKey].refs && notesObjResult[noteKey].refs[uid]),
      );

    setCitationIndice(indice);
    setCitationRefId(findReferenceId);
  }, [editor, element, children]); // eslint-disable-line

  return (
    <>
      {mode === 'view' ? (
        <span id={`ref-${uid}`} aria-describedby="footnote-label">
          <Popup
            position="bottom left"
            trigger={
              <span
                id={`cite_ref-${uid}`}
                {...attributes}
                className="citation-item"
                data-footnote-indice={citationIndice}
              >
                {children}
              </span>
            }
            hoverable
          >
            <Popup.Content>
              <List divided relaxed selection>
                <List.Item
                  as="a"
                  href={`#footnote-${citationRefId}`}
                  onClick={() =>
                    toggleAccordionReference(`#footnote-${citationRefId}`)
                  }
                  key={`#footnote-${citationRefId}`}
                >
                  <List.Content>
                    <List.Description>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: makeFootnote(data.footnote),
                        }}
                      />{' '}
                    </List.Description>
                  </List.Content>
                </List.Item>
                {data.extra &&
                  data.extra.map((item) => (
                    <List.Item
                      as="a"
                      href={`#footnote-${item.zoteroId}`}
                      onClick={() =>
                        toggleAccordionReference(`#footnote-${item.zoteroId}`)
                      }
                      key={`#footnote-${item.zoteroId}`}
                    >
                      <List.Content>
                        <List.Description>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: makeFootnote(item.footnote),
                            }}
                          />{' '}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
              </List>
            </Popup.Content>
          </Popup>
        </span>
      ) : (
        <Popup
          position="bottom left"
          trigger={
            <span
              id={`cite_ref-${uid}`}
              {...attributes}
              className="footnote-edit-node"
              data-footnote-indice={citationIndice}
            >
              {children}
            </span>
          }
          hoverable
        >
          <Popup.Content>
            <List divided relaxed selection>
              <List.Item
                as="a"
                href={`#footnote-${citationRefId}`}
                onClick={() =>
                  toggleAccordionReference(`#footnote-${citationRefId}`)
                }
                key={`#footnote-${citationRefId}`}
              >
                <List.Content>
                  <List.Description>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: makeFootnote(data.footnote),
                      }}
                    />{' '}
                  </List.Description>
                </List.Content>
              </List.Item>
              {data.extra &&
                data.extra.map((item) => (
                  <List.Item
                    as="a"
                    href={`#footnote-${item.zoteroId}`}
                    onClick={() =>
                      toggleAccordionReference(`#footnote-${item.zoteroId}`)
                    }
                    key={`#footnote-${item.zoteroId}`}
                  >
                    <List.Content>
                      <List.Description>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: makeFootnote(item.footnote),
                          }}
                        />{' '}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
            </List>
          </Popup.Content>
        </Popup>
      )}
    </>
  );
};
