import React from 'react';
import { Popup } from 'semantic-ui-react';

const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

export const FootnoteElement = ({
  attributes,
  children,
  element,
  mode,
  ...rest
}) => {
  const { data = {} } = element;
  const { uid = 'undefined' } = data;

  return (
    <>
      {mode === 'view' ? (
        <a
          href={`#footnote-${uid}`}
          id={`ref-${uid}`}
          aria-describedby="footnote-label"
        >
          <Popup
            position="bottom left"
            trigger={
              <span {...attributes} className="citation-indice">
                {children}
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
