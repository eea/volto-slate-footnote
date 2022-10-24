import React, { useEffect, useState } from 'react';
import {
  openAccordionIfContainsFootnoteReference,
  getAllBlocksAndSlateFields,
  makeFootnoteListOfUniqueItems,
  makeFootnote,
} from '@eeacms/volto-slate-footnote/editor/utils';
import './less/public.less';

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
  const { data, properties } = props;
  const { title, global, placeholder = 'Footnotes' } = data;
  const [notesObj, setNodesObjs] = useState(null);
  const metadata = props.metadata ? props.metadata : properties;

  useEffect(() => {
    if (properties) {
      const globalMetadata = global ? metadata : properties;
      const blocks = getAllBlocksAndSlateFields(globalMetadata);
      const notesObjResult = makeFootnoteListOfUniqueItems(blocks);

      setNodesObjs(notesObjResult);
    }
  }, [properties]); // eslint-disable-line

  return (
    <div className="footnotes-listing-block">
      <h3 title={placeholder}>{title}</h3>
      {notesObj && (
        <ol>
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
                      <a
                        href={`#ref-${parentUid || uid}`}
                        aria-label="Back to content"
                        onClick={() =>
                          openAccordionIfContainsFootnoteReference(
                            `#ref-${parentUid || uid}`,
                          )
                        }
                      >
                        {alphabet[0]}
                      </a>{' '}
                    </sup>
                    {/** following refs will have the uid of the one that references it*/}
                    {refsList.slice(1).map((ref, index) => (
                      <sup id={`cite_ref-${ref}`} key={`indice-${ref}`}>
                        <a
                          href={`#ref-${ref}`}
                          aria-label="Back to content"
                          onClick={() =>
                            openAccordionIfContainsFootnoteReference(
                              `#ref-${ref}`,
                            )
                          }
                        >
                          {alphabet[index + 1]}
                        </a>{' '}
                      </sup>
                    ))}
                  </>
                ) : (
                  <sup id={`cite_ref-${uid}`}>
                    {/** some footnotes are never parent so we need the parent to reference */}
                    <a
                      href={`#ref-${parentUid || uid}`}
                      aria-label="Back to content"
                      onClick={() =>
                        openAccordionIfContainsFootnoteReference(
                          `#ref-${parentUid || uid}`,
                        )
                      }
                    >
                      ↵
                    </a>{' '}
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
