import React from 'react';
import { Node } from 'slate';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { settings } from '~/config';
import './less/public.less';

const makeFootnote = (footnote) => {
  const free = footnote ? footnote.replace('<?xml version="1.0"?>', '') : '';

  return free;
};

/**
 * @param {object} properties A prop received by the View component
 * `FootnotesBlockView` which is read by the `getBlocksFieldname` and
 * `getBlocksLayoutFieldname` Volto helpers to produce the return value.
 * @returns {Array} The blocks data taken from the Volto form.
 */
const getBlocks = (properties, blocks) => {
  const blocksFieldName = getBlocksFieldname(properties);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);

  for (const n of properties[blocksLayoutFieldname].items) {
    const block = properties[blocksFieldName][n];
    // TODO Make this configurable via block config getBlocks
    if (
      block?.data?.[blocksLayoutFieldname] &&
      block?.data?.[blocksFieldName]
    ) {
      getBlocks(block.data, blocks);
    } else if (block?.[blocksLayoutFieldname] && block?.[blocksFieldName]) {
      getBlocks(block, blocks);
    }
    blocks.push(block);
  }
  return blocks;
};

/**
 * @summary The React component that displays the list of footnotes inserted
 * before in the current page.
 * @param {object} props Contains the properties `data` and `properties` as
 * received from the Volto form.
 */
const FootnotesBlockView = (props) => {
  const { data, properties } = props;
  const { title, global } = data;
  const { footnotes } = settings;
  const metadata = props.metadata || properties;

  // console.log(properties);
  const blocks = [];
  if (global) {
    getBlocks(metadata, blocks);
  } else {
    getBlocks(properties, blocks);
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
        if (footnotes.includes(node.type)) {
          notes.push(node);
        }
      });
    });

  return (
    <div className="footnotes-listing-block">
      <h3>{title}</h3>
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
