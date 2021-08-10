import React, { useEffect, useState } from 'react';
import { getAllBlocks } from 'volto-slate/utils';
import './less/public.less';
import {
  makeFootnoteListOfUniqueItems,
  makeFootnote,
} from '../../editor/utils';

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
  const metadata = props.metadata || properties;
  const [notesObj, setNodesObjs] = useState(null);

  useEffect(() => {
    if (properties) {
      const blocks = getAllBlocks(global ? metadata : properties, []);
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
            const { uid, footnote, zoteroId } = note;
            const { refs } = note;
            const refsList = refs ? Object.keys(refs) : null;

            return (
              <li key={uid} id={`footnote-${zoteroId || uid}`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: makeFootnote(footnote),
                  }}
                />
                {refsList ? (
                  refsList.map((ref, index) => (
                    <sup id={`cite_ref-${ref}`}>
                      <a href={`#ref-${ref}`} aria-label="Back to content">
                        {alphabet[index]}
                      </a>{' '}
                    </sup>
                  ))
                ) : (
                  <sup id={`cite_ref-${uid}`}>
                    <a href={`#ref-${uid}`} aria-label="Back to content">
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
