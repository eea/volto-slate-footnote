import {
  openAccordionOrTabIfContainsFootnoteReference,
  getAllBlocksAndSlateFields,
  isValidHTML,
  retriveValuesOfSlateFromNestedPath,
} from './utils';
import { getAllBlocks } from '@plone/volto-slate/utils';

jest.mock('@plone/volto-slate/utils', () => ({
  getAllBlocks: jest.fn(),
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
      parseFromString(str, type) {
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
