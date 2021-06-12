import React from 'react';
import { Node } from 'slate';
import config from '@plone/volto/registry';
import { getAllBlocks } from 'volto-slate/utils';
import './less/public.less';

const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

/**
 * @summary The React component that displays the list of footnotes inserted
 * before in the current page.
 * @param {object} props Contains the properties `data` and `properties` as
 * received from the Volto form.
 */
const FootnotesBlockView = (props) => {
  const { data, properties } = props;
  const { title, global, placeholder = 'Footnotes' } = data;
  const { footnotes } = config.settings;
  const metadata = props.metadata || properties;

  // console.log(properties);
  const blocks = [];
  if (global) {
    getAllBlocks(metadata, blocks);
  } else {
    getAllBlocks(properties, blocks);
  }
  const notes = [];
  // TODO: slice the blocks according to existing footnote listing blocks. A
  // footnote listing block should reset the counter of the footnotes above it
  // If so, then it should only include the footnotes between the last footnotes
  // listing block and this block
  blocks
    .filter((b) => b['@type'] === 'slate')
    .forEach(({ value }) => {
      if (!value) return;

      Array.from(Node.elements(value[0])).forEach(([node]) => {
        if (
          footnotes.includes(node.type) &&
          // do not add duplicates coming from copy/paste of notes
          notes.filter((note) => {
            return node.data && note.data.uid === node.data.uid;
          }).length === 0
        ) {
          notes.push(node);
        }
      });
    });

  return (
    <div className="footnotes-listing-block">
      <h3 title={placeholder}>{title}</h3>
      {notes && (
        <ol>
          {notes.map(({ data }) => {
            const { uid, footnote } = data;
            return (
              <li key={uid} id={`footnote-${uid}`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: makeFootnote(footnote),
                  }}
                />
                <a href={`#ref-${uid}`} aria-label="Back to content">
                  ↵
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default FootnotesBlockView;
