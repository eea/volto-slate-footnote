import React, { useEffect, useState } from 'react';
import { Popup, List } from 'semantic-ui-react';
import { useEditorContext } from 'volto-slate/hooks';
import { getAllBlocksAndSlateFields } from '@eeacms/volto-slate-footnote/editor/utils';
import { makeFootnoteListOfUniqueItems } from './utils';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

/**
 * Removes '<?xml version="1.0"?>' from footnote
 * @param {string} footnote
 * @returns {string} formatted footnote
 */
const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

/**
 * Will open accordion if contains footnote reference
 * @param {string} footnoteId
 */
const openAccordionIfContainsFootnoteReference = (footnoteId) => {
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
  const [citationIndice, setCitationIndice] = useState(null); // list of indices to reference
  const [citationRefId, setCitationRefId] = useState(null); // indice of element to be referenced
  const initialFormData = useSelector((state) => state?.content?.data || {});

  useEffect(() => {
    const blockProps = editor?.getBlockProps ? editor.getBlockProps() : null;
    const metadata = blockProps
      ? blockProps.metadata || blockProps.properties
      : extras?.metadata || {};
    const blocks = getAllBlocksAndSlateFields(metadata);
    const storeBlocks = getAllBlocksAndSlateFields(initialFormData);

    const notesObjResult = isEmpty(metadata)
      ? makeFootnoteListOfUniqueItems(storeBlocks)
      : makeFootnoteListOfUniqueItems(blocks);

    // will cosider zotero citations and footnote
    // notesObjResult contains all zotero/footnote as unique, and contain refs for other zotero/footnote
    const indice = zoteroId // ZOTERO
      ? data.extra
        ? [
            `[${Object.keys(notesObjResult).indexOf(zoteroId) + 1}]`, // parent footnote
            ...data.extra.map(
              // citations from extra
              (zoteroObj, index) =>
                // all zotero citation are indexed by zoteroId in notesObjResult
                `[${
                  Object.keys(notesObjResult).indexOf(zoteroObj.zoteroId) + 1
                }]`,
            ),
          ].join('')
        : // no extra citations (no multiples)
          `[${Object.keys(notesObjResult).indexOf(zoteroId) + 1}]`
      : // FOOTNOTES
      // not all footnotes will be found in notesObjResult because they might have different uid
      notesObjResult[data.uid]
      ? // footnotes from extra
        data.extra
        ? [
            // parent footnote
            `[${Object.keys(notesObjResult).indexOf(data.uid) + 1}]`,
            ...data.extra.map((footnoteObj, index) => {
              return notesObjResult[footnoteObj.uid]
                ? // take footnote if uid is found
                  `[${
                    Object.keys(notesObjResult).indexOf(footnoteObj.uid) + 1
                  }]`
                : // if uid is not found look for it in other footnotes refs
                  `[${
                    Object.keys(notesObjResult).indexOf(
                      Object.keys(notesObjResult).find(
                        (noteKey) =>
                          notesObjResult[noteKey].refs &&
                          notesObjResult[noteKey].refs[data.uid],
                      ),
                    ) + 1
                  }]`;
            }),
          ].join('')
        : // no extra footnotes (no multiples)
          `[${Object.keys(notesObjResult).indexOf(data.uid) + 1}]`
      : // footnotes not found in notesObjResult
      data.extra
      ? [
          // look for it in other footnotes refs - parent
          `[${
            Object.keys(notesObjResult).indexOf(
              Object.keys(notesObjResult).find(
                (noteKey) =>
                  notesObjResult[noteKey].refs &&
                  notesObjResult[noteKey].refs[data.uid],
              ),
            ) + 1
          }]`,
          ...data.extra.map((footnoteObj, index) => {
            return notesObjResult[footnoteObj.uid]
              ? // footnotes from extra might be found in notesObjResult
                `[${Object.keys(notesObjResult).indexOf(footnoteObj.uid) + 1}]`
              : // if uid is not found look for it in other footnotes refs
                `[${
                  Object.keys(notesObjResult).indexOf(
                    Object.keys(notesObjResult).find(
                      (noteKey) =>
                        notesObjResult[noteKey].refs &&
                        notesObjResult[noteKey].refs[data.uid],
                    ),
                  ) + 1
                }]`;
          }),
        ].join('')
      : // no extra footnotes
        `[${
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
                    openAccordionIfContainsFootnoteReference(
                      `#footnote-${citationRefId}`,
                    )
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
                      href={`#footnote-${item.zoteroId || item.uid}`}
                      onClick={() =>
                        openAccordionIfContainsFootnoteReference(
                          `#footnote-${item.zoteroId || item.uid}`,
                        )
                      }
                      key={`#footnote-${item.zoteroId || item.uid}`}
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
                  openAccordionIfContainsFootnoteReference(
                    `#footnote-${citationRefId}`,
                  )
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
                    href={`#footnote-${item.zoteroId || item.uid}`}
                    onClick={() =>
                      openAccordionIfContainsFootnoteReference(
                        `#footnote-${item.zoteroId || item.uid}`,
                      )
                    }
                    key={`#footnote-${item.zoteroId || item.uid}`}
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
