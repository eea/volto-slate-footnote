import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
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

    const indice = data.zoteroId
      ? Object.keys(notesObjResult).indexOf(data.zoteroId) + 1
      : notesObjResult[data.uid]
      ? Object.keys(notesObjResult).indexOf(data.uid) + 1
      : Object.keys(notesObjResult).indexOf(
          Object.keys(notesObjResult).find(
            (noteKey) =>
              notesObjResult[noteKey].refs &&
              notesObjResult[noteKey].refs[data.uid],
          ),
        ) + 1;

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
        <a
          href={`#footnote-${citationRefId}`}
          id={`ref-${uid}`}
          aria-describedby="footnote-label"
        >
          <Popup
            position="bottom left"
            trigger={
              <span {...attributes}>
                {children}
                <sup id={`cite_ref-${uid}`}>
                  <span className="footnote-indice">[{citationIndice}]</span>
                </sup>
              </span>
            }
          >
            <Popup.Content>
              <div
                dangerouslySetInnerHTML={{
                  __html: makeFootnote(data.footnote),
                }}
              />{' '}
            </Popup.Content>
          </Popup>
        </a>
      ) : (
        <Popup
          position="bottom left"
          trigger={
            <span
              {...attributes}
              className="footnote-edit-node zotero-edit-node"
            >
              {children}
              <sup id={`cite_ref-${uid}`}>
                <span className="footnote-indice">[{citationIndice}]</span>{' '}
              </sup>
            </span>
          }
        >
          <Popup.Content>
            <div
              dangerouslySetInnerHTML={{
                __html: makeFootnote(data.footnote),
              }}
            />{' '}
          </Popup.Content>
        </Popup>
      )}
    </>
  );
};
