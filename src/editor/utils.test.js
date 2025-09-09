import React from 'react';
import {
  openAccordionOrTabIfContainsFootnoteReference,
  getAllBlocksAndSlateFields,
  isValidHTML,
  retriveValuesOfSlateFromNestedPath,
  renderTextWithLinks,
  makeFootnoteListOfUniqueItems,
} from './utils';
import { getAllBlocks } from '@plone/volto-slate/utils';
import { UniversalLink } from '@plone/volto/components';

jest.mock('@plone/volto-slate/utils', () => ({
  getAllBlocks: jest.fn(),
}));

jest.mock('@plone/volto/components', () => ({
  UniversalLink: jest.fn(({ href, children }) => <a href={href}>{children}</a>),
}));

jest.mock('@plone/volto/registry', () => ({
  __esModule: true,
  default: {
    settings: {
      footnotes: ['citation', 'footnote'],
      blocksWithFootnotesSupport: {
        slate: ['value'],
        slateTable: ['table'],
      },
    },
  },
}));

// Mock Slate's Node module
jest.mock('slate', () => ({
  Node: {
    elements: function* (node) {
      // Simple implementation for testing
      if (node && node.children) {
        for (const child of node.children) {
          if (child.type) {
            yield [child, []];
          }
        }
      }
    },
  },
}));

describe('retriveValuesOfSlateFromNestedPath', () => {
  test('should return values for a given string path in an object', () => {
    const obj = { key: ['value1', 'value2'] };
    expect(retriveValuesOfSlateFromNestedPath('key', obj)).toEqual([
      'value1',
      'value2',
    ]);
  });

  test('should return an empty array when the path is not found', () => {
    const obj = { key: [] };
    expect(retriveValuesOfSlateFromNestedPath('key', obj)).toEqual([]);
  });

  test('should return values from an array of objects', () => {
    const objArray = [{ key: ['value1'] }, { key: ['value2'] }];
    expect(retriveValuesOfSlateFromNestedPath('key', objArray)).toEqual([
      'value1',
      'value2',
    ]);
  });

  test('should handle nested object paths', () => {
    const obj = { level1: { level2: ['value'] } };
    expect(
      retriveValuesOfSlateFromNestedPath({ level1: 'level2' }, obj),
    ).toEqual(['value']);
  });

  test('should return an empty array for invalid inputs', () => {
    expect(retriveValuesOfSlateFromNestedPath('key', null)).toEqual([]);
    expect(retriveValuesOfSlateFromNestedPath('key', undefined)).toEqual([]);
    expect(retriveValuesOfSlateFromNestedPath({}, {})).toEqual([]);
  });

  test('should return empty array if given an empty path object', () => {
    expect(retriveValuesOfSlateFromNestedPath({}, { key: 'value' })).toEqual(
      [],
    );
  });
});
describe('openAccordionOrTabIfContainsFootnoteReference', () => {
  it('should open accordion if it contains footnote reference', () => {
    document.body.innerHTML = `
      <div class="accordion">
        <div class="title">Accordion</div>
        <div id="footnote">Footnote</div>
      </div>
    `;

    const title = document.querySelector('.title');
    title.click = jest.fn();

    openAccordionOrTabIfContainsFootnoteReference('#footnote');

    expect(title.click).toHaveBeenCalled();
  });

  it('should not do anything if accordion does not contain footnote reference', () => {
    document.body.innerHTML = `
      <div class="accordion">
        <div class="title">Accordion</div>
      </div>
    `;

    const title = document.querySelector('.title');
    title.click = jest.fn();

    openAccordionOrTabIfContainsFootnoteReference('#footnote');

    expect(title.click).not.toHaveBeenCalled();
  });
});

describe('getAllBlocksAndSlateFields', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles metadataSection correctly', () => {
    const properties = { 1: ['test'] };
    const blocks = [
      {
        '@type': 'metadataSection',
        fields: [
          { field: { widget: 'slate', id: '1' } },
          { field: { widget: 'other', id: '2' } },
        ],
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [{ '@type': 'slate', id: '1', value: ['test'] }];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles metadataSection correctly with no properties', () => {
    const properties = {};
    const blocks = [
      {
        '@type': 'metadataSection',
        fields: [
          { field: { widget: 'slate', id: '1' } },
          { field: { widget: 'other', id: '2' } },
        ],
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual([]);
  });

  it('handles metadata correctly', () => {
    const properties = { 1: ['metadata test'] };
    const blocks = [
      {
        '@type': 'metadata',
        data: { id: '1', widget: 'slate' },
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [{ '@type': 'slate', id: '1', value: ['metadata test'] }];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles metadata correctly with no properties', () => {
    const properties = {};
    const blocks = [
      {
        '@type': 'metadata',
        data: { id: '1', widget: 'slate' },
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [{ '@type': 'slate', id: '1', value: null }];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles metadata correctly with no slate widgets', () => {
    const properties = {};
    const blocks = [
      {
        '@type': 'metadata',
        data: { id: '1', widget: 'test' },
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles slateTable correctly', () => {
    const properties = {};
    const blocks = [
      {
        '@type': 'slateTable',
        table: {
          rows: [{ cells: [{ cell1: '1' }, { cell2: '2' }] }],
        },
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [
      { '@type': 'slate', cell1: '1' },
      { '@type': 'slate', cell2: '2' },
    ];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles slateTable correctly with no rows', () => {
    const properties = {};
    const blocks = [
      {
        '@type': 'slateTable',
        table: {},
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles slateTable correctly with no cells', () => {
    const properties = {};
    const blocks = [
      {
        '@type': 'slateTable',
        table: {
          rows: [{ cells: undefined }],
        },
      },
    ];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });

  it('handles defaultOperation correctly', () => {
    const properties = {};
    const blocks = [{ block: '1', '@type': 'testType' }];
    getAllBlocks.mockReturnValue(blocks);

    const expected = [blocks[0]];
    const result = getAllBlocksAndSlateFields(properties);

    expect(result).toEqual(expected);
  });
});

describe('isValidHTML', () => {
  beforeAll(() => {
    global.DOMParser = class {
      parseFromString(str) {
        const doc = {
          querySelectorAll: (selector) => {
            if (selector === 'parsererror' && str.includes('<error>')) {
              return [{}]; // Simulate an error
            }
            return [];
          },
        };
        return doc;
      }
    };
  });

  test('returns true for valid HTML', () => {
    expect(isValidHTML('<div>Hello</div>')).toBe(true);
  });

  test('returns false for invalid HTML', () => {
    expect(isValidHTML('<error>Invalid HTML</error>')).toBe(false);
  });
});

describe('renderTextWithLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null for empty text', () => {
    expect(renderTextWithLinks(null)).toBeNull();
    expect(renderTextWithLinks('')).toBeNull();
  });

  it('should return plain text when no links are found', () => {
    const text = 'This is plain text without links';
    expect(renderTextWithLinks(text)).toBe(text);
  });

  it('should detect and render simple HTTP URL', () => {
    const text = 'Visit http://example.com for info';
    const result = renderTextWithLinks(text);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
    expect(result.props.children).toBeDefined();
    expect(result.props.children.length).toBeGreaterThan(0);
  });

  it('should detect and render simple HTTPS URL', () => {
    const text = 'Visit https://example.com for info';
    const result = renderTextWithLinks(text);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
    expect(result.props.children).toBeDefined();
  });

  it('should handle URL with file extension', () => {
    const text = 'Download https://example.com/file.pdf';
    const result = renderTextWithLinks(text);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });

  it('should handle URL wrapped in parentheses', () => {
    const text = '(https://example.com/page) for details';
    const result = renderTextWithLinks(text);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });

  it('should handle multiple URLs', () => {
    const text = 'Visit https://example.com and http://test.org';
    const result = renderTextWithLinks(text);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
    expect(
      result.props.children.filter((c) => c && c.type === UniversalLink).length,
    ).toBe(2);
  });

  it('should render HTML when zoteroId is provided', () => {
    global.__CLIENT__ = true;
    global.DOMParser = class {
      parseFromString() {
        return { querySelectorAll: () => [] };
      }
    };
    const text = '<em>Test</em> content';
    const result = renderTextWithLinks(text, 'zotero123');
    expect(result).toBeDefined();
    expect(result.type).toBe('span');
  });

  it('should handle URL without protocol', () => {
    const text = 'Visit example.com';
    const result = renderTextWithLinks(text);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });
});

describe('makeFootnoteListOfUniqueItems', () => {
  it('should return empty object for empty blocks', () => {
    const result = makeFootnoteListOfUniqueItems([]);
    expect(result).toEqual({});
  });

  it('should handle blocks without footnote support', () => {
    const blocks = [{ '@type': 'unsupported', value: 'test' }];
    const result = makeFootnoteListOfUniqueItems(blocks);
    expect(result).toEqual({});
  });

  it('should process slate blocks with citations', () => {
    const blocks = [
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'citation',
                data: {
                  zoteroId: 'zot123',
                  uid: 'uid1',
                  footnote: 'Citation text',
                },
              },
            ],
          },
        ],
      },
    ];
    const result = makeFootnoteListOfUniqueItems(blocks);
    expect(result).toHaveProperty('zot123');
    expect(result.zot123.uid).toBe('uid1');
  });

  it('should handle multiple references to same zoteroId', () => {
    const blocks = [
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'citation',
                data: {
                  zoteroId: 'zot123',
                  uid: 'uid1',
                  footnote: 'Citation text',
                },
              },
            ],
          },
        ],
      },
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'citation',
                data: {
                  zoteroId: 'zot123',
                  uid: 'uid2',
                  footnote: 'Citation text',
                },
              },
            ],
          },
        ],
      },
    ];
    const result = makeFootnoteListOfUniqueItems(blocks);
    expect(result.zot123.refs).toBeDefined();
    expect(result.zot123.refs).toHaveProperty('uid1');
    expect(result.zot123.refs).toHaveProperty('uid2');
  });

  it('should handle footnotes with extra citations', () => {
    const blocks = [
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'citation',
                data: {
                  zoteroId: 'zot123',
                  uid: 'uid1',
                  footnote: 'Main citation',
                  extra: [
                    {
                      zoteroId: 'zot456',
                      uid: 'uid2',
                      footnote: 'Extra citation',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ];
    const result = makeFootnoteListOfUniqueItems(blocks);
    expect(result).toHaveProperty('zot123');
    expect(result).toHaveProperty('zot456');
    expect(result.zot456.uid).toBe('uid1');
  });

  it('should handle regular footnotes without zoteroId', () => {
    const blocks = [
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'footnote',
                data: {
                  uid: 'uid1',
                  footnote: 'Footnote text',
                },
              },
            ],
          },
        ],
      },
    ];
    const result = makeFootnoteListOfUniqueItems(blocks);
    expect(result).toHaveProperty('uid1');
    expect(result.uid1.footnote).toBe('Footnote text');
  });

  it('should handle identical footnote texts', () => {
    const blocks = [
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'footnote',
                data: {
                  uid: 'uid1',
                  footnote: 'Same text',
                },
              },
            ],
          },
        ],
      },
      {
        '@type': 'slate',
        value: [
          {
            children: [
              {
                type: 'footnote',
                data: {
                  uid: 'uid2',
                  footnote: 'Same text',
                },
              },
            ],
          },
        ],
      },
    ];
    const result = makeFootnoteListOfUniqueItems(blocks);
    const keys = Object.keys(result);
    expect(keys.length).toBe(1);
    expect(result[keys[0]].refs).toBeDefined();
  });
});

// Removed test for deprecated openAccordionIfContainsFootnoteReference alias
