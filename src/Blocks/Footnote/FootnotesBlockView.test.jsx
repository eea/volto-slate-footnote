import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FootnotesBlockView from './FootnotesBlockView';

jest.mock('@plone/volto/components', () => ({
  UniversalLink: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock('@eeacms/volto-slate-footnote/editor/utils', () => ({
  openAccordionOrTabIfContainsFootnoteReference: jest.fn(),
  getAllBlocksAndSlateFields: jest.fn(() => [
    { id: 'block1', footnote: 'Footnote with no link' },
    { id: 'block2', footnote: 'Footnote with link http://example.com' },
    { id: 'block3', footnote: 'Footnote with <b>HTML</b>' },
  ]),
  makeFootnoteListOfUniqueItems: jest.fn((blocks) => ({
    note1: {
      uid: '1',
      footnote: 'First note with a reference',
      zoteroId: 'zotero1',
      refs: { ref1: 'ref1' },
    },
    note2: {
      uid: '2',
      footnote: 'Second note with multiple references',
      zoteroId: null,
      refs: { ref2: 'ref2', ref3: 'ref3' },
    },
    note3: {
      uid: '3',
      footnote: '<i>Note with HTML</i>',
      zoteroId: 'zotero3',
      refs: {},
    },
  })),
}));

describe('FootnotesBlockView', () => {
  const propsVariations = [
    {
      description: 'renders with global metadata',
      props: {
        data: { title: 'Global Metadata', global: true, placeholder: 'Global' },
        properties: { test: 'metadata' },
        tabData: null,
        content: null,
        metadata: { test: 'metadata' },
      },
    },
    {
      description: 'renders with tabData',
      props: {
        data: { title: 'Tab Data', global: false, placeholder: 'Tab' },
        properties: { test: 'tabProperties' },
        tabData: { test: 'tabData' },
        content: null,
      },
    },
    {
      description: 'renders with content',
      props: {
        data: { title: 'Content Data', global: false, placeholder: 'Content' },
        properties: { test: 'contentProperties' },
        tabData: null,
        content: { test: 'contentData' },
      },
    },
    {
      description: 'renders with no metadata',
      props: {
        data: { title: 'No Metadata', global: false, placeholder: 'Default' },
        properties: { test: 'defaultProperties' },
        tabData: null,
        content: null,
      },
    },
  ];

  test.each(propsVariations)('$description', ({ props }) => {
    render(<FootnotesBlockView {...props} />);
  });
});
