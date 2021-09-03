import React, { useEffect, useState } from 'react';
import { Popup, List } from 'semantic-ui-react';
import { useEditorContext } from 'volto-slate/hooks';
import { getAllBlocks } from 'volto-slate/utils';
import { makeFootnoteListOfUniqueItems } from './utils';

const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

export const FootnoteElement = (props) => {
  const { attributes, children, element, mode, extras } = props;
  const { data = {} } = element;
  const { uid, zoteroId } = data;
  const editor = useEditorContext();
  const [citationIndice, setCitationIndice] = useState(null);
  const [citationRefId, setCitationRefId] = useState(null);

  useEffect(() => {
    const blockProps = editor ? editor.getBlockProps() : null;
    const metadata = blockProps
      ? blockProps.metadata || blockProps.properties
      : extras.metadata;
    const blocks = getAllBlocks(metadata, []);
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
          ].join()
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

    const findReferenceId = Object.keys(notesObjResult).find(
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
              <List divided relaxed>
                <List.Item as="a" href={`#footnote-${citationRefId}`}>
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
                    <List.Item as="a" href={`#footnote-${item.zoteroId}`}>
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
            <List divided relaxed>
              <List.Item as="a" href={`#footnote-${citationRefId}`}>
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
                  <List.Item as="a" href={`#footnote-${item.zoteroId}`}>
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
