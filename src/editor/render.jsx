import React from 'react';
import { Popup, List } from 'semantic-ui-react';
import { useEditorContext } from '@plone/volto-slate/hooks';
import { getAllBlocksAndSlateFields } from '@eeacms/volto-slate-footnote/editor/utils';
import {
  makeFootnoteListOfUniqueItems,
  openAccordionOrTabIfContainsFootnoteReference,
} from './utils';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { UniversalLink } from '@plone/volto/components';

/**
 * Removes '<?xml version="1.0"?>' from footnote
 * @param {string} footnote
 * @returns {string} formatted footnote
 */

const urlRegex = /https?:\/\/[^\s]+/g;

export const FootnoteElement = (props) => {
  const { attributes, children, element, mode, extras } = props;
  const { data = {} } = element;
  const { uid, zoteroId } = data;
  const editor = useEditorContext();
  const ref = React.useRef();

  const initialFormData = useSelector((state) => state?.content?.data || {});
  const blockProps = editor?.getBlockProps ? editor.getBlockProps() : null;
  const metadata = blockProps
    ? blockProps.metadata || blockProps.properties
    : extras?.metadata || {};
  const blocks = getAllBlocksAndSlateFields(metadata);
  const storeBlocks = getAllBlocksAndSlateFields(initialFormData);

  const notesObjResult = isEmpty(metadata)
    ? makeFootnoteListOfUniqueItems(storeBlocks)
    : makeFootnoteListOfUniqueItems(blocks);
  // will consider zotero citations and footnote
  // notesObjResult contains all zotero/footnote as unique, and contain refs for other zotero/footnote
  const indiceIfZoteroId = data.extra
    ? [
        `[${Object.keys(notesObjResult).indexOf(zoteroId) + 1}]`, // parent footnote
        ...data.extra.map(
          // citations from extra
          (zoteroObj, _index) =>
            // all zotero citation are indexed by zoteroId in notesObjResult
            `[${Object.keys(notesObjResult).indexOf(zoteroObj.zoteroId) + 1}]`,
        ),
      ].join('')
    : // no extra citations (no multiples)
      `[${Object.keys(notesObjResult).indexOf(zoteroId) + 1}]`;

  const renderTextWithLinks = (text) => {
    if (!text) return null;
    const parts = text.split(urlRegex);
    const links = text.match(urlRegex);
    let result = [];

    parts.forEach((part, index) => {
      result.push(
        <div
          dangerouslySetInnerHTML={{
            __html: part,
          }}
        />,
      );

      if (links && links[index]) {
        result.push(
          <UniversalLink
            key={`link-${index}`}
            href={links[index]}
            openLinkInNewTab={false}
          >
            {links[index]}
          </UniversalLink>,
        );
      }
    });
    return result;
  };
  const citationIndice = zoteroId // ZOTERO
    ? indiceIfZoteroId
    : // FOOTNOTES
      // parent footnote
      [data, ...(data.extra || [])]
        .map((footnoteObj, _index) => {
          const indexInNotesObjResult = Object.keys(notesObjResult).indexOf(
            Object.keys(notesObjResult).find(
              (key) => notesObjResult[key].footnote === footnoteObj.footnote,
            ),
          );
          return `[${
            indexInNotesObjResult === -1
              ? Object.keys(notesObjResult).length + 1
              : indexInNotesObjResult + 1
          }]`;
        })
        .join('');

  const citationRefId =
    // search within parent citations first, otherwise the uid might be inside a refs obj that comes before
    Object.keys(notesObjResult).find(
      (noteKey) => notesObjResult[noteKey].uid === uid,
    ) ||
    // if not found in parent, search in refs, it might be a footnote referenced multiple times
    Object.keys(notesObjResult).find(
      (noteKey) =>
        notesObjResult[noteKey].uid === uid ||
        (notesObjResult[noteKey].refs && notesObjResult[noteKey].refs[uid]),
    );

  const footnoteText = !data.footnote
    ? ''
    : data.footnote.replace('<?xml version="1.0"?>', '');

  return (
    <>
      {mode === 'view' ? (
        <span id={`ref-${uid}`} aria-describedby="footnote-label" ref={ref}>
          <Popup
            position="bottom left"
            pinned={true}
            mountNode={ref.current}
            on={['click', 'hover', 'focus']}
            trigger={
              <span
                id={`cite_ref-${uid}`}
                {...attributes}
                className="citation-item"
                data-footnote-indice={citationIndice}
                tabIndex={0}
                role={'presentation'}
              >
                {children}
              </span>
            }
            hoverable
          >
            <Popup.Content>
              <List divided relaxed selection>
                <List.Item
                  href={`#footnote-${citationRefId}`}
                  onClick={() =>
                    openAccordionOrTabIfContainsFootnoteReference(
                      `#footnote-${citationRefId}`,
                    )
                  }
                  key={`#footnote-${citationRefId}`}
                >
                  <List.Content>
                    <List.Description>
                      {renderTextWithLinks(footnoteText)}
                    </List.Description>
                  </List.Content>
                </List.Item>
                {data.extra &&
                  data.extra.map((item) => {
                    const footnoteText = !item.footnote
                      ? ''
                      : item.footnote.replace('<?xml version="1.0"?>', '');

                    return (
                      <List.Item
                        href={`#footnote-${item.zoteroId || item.uid}`}
                        onClick={() =>
                          openAccordionOrTabIfContainsFootnoteReference(
                            `#footnote-${item.zoteroId || item.uid}`,
                          )
                        }
                        key={`#footnote-${item.zoteroId || item.uid}`}
                      >
                        <List.Content>
                          <List.Description>
                            {renderTextWithLinks(footnoteText)}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    );
                  })}
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
                href={`#footnote-${citationRefId}`}
                onClick={() =>
                  openAccordionOrTabIfContainsFootnoteReference(
                    `#footnote-${citationRefId}`,
                  )
                }
                key={`#footnote-${citationRefId}`}
              >
                <List.Content>
                  <List.Description>
                    {renderTextWithLinks(footnoteText)}
                  </List.Description>
                </List.Content>
              </List.Item>
              {data.extra &&
                data.extra.map((item) => (
                  <List.Item
                    href={`#footnote-${item.zoteroId || item.uid}`}
                    onClick={() =>
                      openAccordionOrTabIfContainsFootnoteReference(
                        `#footnote-${item.zoteroId || item.uid}`,
                      )
                    }
                    key={`#footnote-${item.zoteroId || item.uid}`}
                  >
                    <List.Content>
                      <List.Description>
                        {renderTextWithLinks(item.footnote)}
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
