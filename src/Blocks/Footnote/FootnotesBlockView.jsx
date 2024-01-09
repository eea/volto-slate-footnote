import React from 'react';
import {
  openAccordionIfContainsFootnoteReference,
  getAllBlocksAndSlateFields,
  makeFootnoteListOfUniqueItems,
  makeFootnote,
} from '@eeacms/volto-slate-footnote/editor/utils';
import './less/public.less';

import { UniversalLink } from '@plone/volto/components';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

/**
 * @summary The React component that displays the list of footnotes inserted
 * before in the current page.
 * Will show an indice for the footnote/citation but also numbers to indicate each
 * text that has same reference
 * @param {Object} props Contains the properties `data` and `properties` as
 * received from the Volto form.
 */
const FootnotesBlockView = (props) => {
  const { data, properties, tabData, content } = props;
  const { title, global, placeholder = 'Footnotes' } = data;

  const metadata = props.metadata ? props.metadata : properties;

  const localMetadata = content
    ? content
    : tabData
    ? tabData
    : global
    ? metadata
    : properties;
  const blocks = getAllBlocksAndSlateFields(localMetadata);
  const notesObj = makeFootnoteListOfUniqueItems(blocks);
  let startList = 1;
  if (Object.keys(notesObj).length > 0) {
    const noteId = Object.keys(notesObj)[0];
    const note = notesObj[noteId];
    const { zoteroId } = note;

    const notesGlobalResult = makeFootnoteListOfUniqueItems(
      getAllBlocksAndSlateFields(metadata),
    );

    const indiceIfZoteroId = note.extra
      ? [
          Object.keys(notesGlobalResult).indexOf(zoteroId) + 1, // parent footnote
          ...note.extra.map(
            // citations from extra
            (zoteroObj, _index) =>
              // all zotero citation are indexed by zoteroId in notesGlobalResult

              Object.keys(notesGlobalResult).indexOf(zoteroObj.zoteroId) + 1,
          ),
        ]
      : // no extra citations (no multiples)
        Object.keys(notesGlobalResult).indexOf(zoteroId) + 1;
    const citationIndice = zoteroId // ZOTERO
      ? indiceIfZoteroId
      : // FOOTNOTES
        // parent footnote
        [note, ...(note.extra || [])].map((footnoteObj, _index) => {
          return (
            Object.keys(notesGlobalResult).indexOf(
              Object.keys(notesGlobalResult).find(
                (key) =>
                  notesGlobalResult[key].footnote === footnoteObj.footnote,
              ),
            ) + 1
          );
        });
    startList = citationIndice;
  }

  return (
    <div className="footnotes-listing-block">
      <h3 title={placeholder}>{title}</h3>
      {notesObj && (
        <ol start={startList}>
          {Object.keys(notesObj).map((noteId) => {
            const note = notesObj[noteId];
            const { uid, footnote, zoteroId, parentUid } = note;
            const { refs } = note;
            const refsList = refs ? Object.keys(refs) : null;
            return (
              <li
                key={`footnote-${zoteroId || uid}`}
                id={`footnote-${zoteroId || uid}`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: makeFootnote(footnote),
                  }}
                />
                {refsList ? (
                  <>
                    {/** some footnotes are never parent so we need the parent to reference */}
                    {/** in this case the first from refs has reference to the parent*/}
                    <sup
                      id={`cite_ref-${refsList[0]}`}
                      key={`indice-${refsList[0]}`}
                    >
                      <UniversalLink
                        href={`#ref-${parentUid || uid}`}
                        aria-label="Back to content"
                        onClick={() =>
                          openAccordionIfContainsFootnoteReference(
                            `#ref-${parentUid || uid}`,
                          )
                        }
                      >
                        {alphabet[0]}
                      </UniversalLink>{' '}
                    </sup>
                    {/** following refs will have the uid of the one that references it*/}
                    {refsList.slice(1).map((ref, index) => (
                      <sup id={`cite_ref-${ref}`} key={`indice-${ref}`}>
                        <UniversalLink
                          href={`#ref-${ref}`}
                          aria-label="Back to content"
                          onClick={() =>
                            openAccordionIfContainsFootnoteReference(
                              `#ref-${ref}`,
                            )
                          }
                        >
                          {alphabet[index + 1]}
                        </UniversalLink>{' '}
                      </sup>
                    ))}
                  </>
                ) : (
                  <sup id={`cite_ref-${uid}`}>
                    {/** some footnotes are never parent so we need the parent to reference */}
                    <UniversalLink
                      href={`#ref-${parentUid || uid}`}
                      aria-label="Back to content"
                      onClick={() =>
                        openAccordionIfContainsFootnoteReference(
                          `#ref-${parentUid || uid}`,
                        )
                      }
                    >
                      ↵
                    </UniversalLink>{' '}
                  </sup>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default FootnotesBlockView;
