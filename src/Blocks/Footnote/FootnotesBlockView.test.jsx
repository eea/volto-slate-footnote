import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FootnotesBlockView from './FootnotesBlockView';

jest.mock('@plone/volto/components', () => ({
  UniversalLink: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock('@eeacms/volto-slate-footnote/editor/utils', () => ({
  openAccordionOrTabIfContainsFootnoteReference: jest.fn(),
  getAllBlocksAndSlateFields: jest.fn(() => [
    { id: 'block1', footnote: 'Example footnote 1' },
    { id: 'block2', footnote: 'Example footnote 2 with http://example.com' },
  ]),
  makeFootnoteListOfUniqueItems: jest.fn((blocks) => {
    return {
      note1: {
        uid: '1',
        footnote: 'Example footnote 1',
        refs: { ref1: 'ref1' },
      },
      note2: {
        uid: '2',
        footnote: 'Example footnote 2 with http://example.com',
        refs: { ref2: 'ref2' },
      },
    };
  }),
}));

describe('FootnotesBlockView', () => {
  const props = {
    data: {
      title: 'Test Footnotes',
      placeholder: 'Footnotes Placeholder',
      global: true,
    },
    properties: {},
  };

  test('renders the component with title and placeholder', () => {
    render(<FootnotesBlockView {...props} />);
    expect(screen.getByText('Test Footnotes')).toBeInTheDocument();
    expect(screen.getByTitle('Footnotes Placeholder')).toBeInTheDocument();
  });

  test('renders a list of footnotes', () => {
    render(<FootnotesBlockView {...props} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2); // Two footnotes from mocked data
    expect(screen.getByText('Example footnote 1')).toBeInTheDocument();
    expect(
      screen.getByText('Example footnote 2 with http://example.com'),
    ).toBeInTheDocument();
  });

  test('renders footnotes with links correctly', () => {
    render(<FootnotesBlockView {...props} />);
    const link = screen.getByText('http://example.com');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://example.com');
  });

  test('handles empty footnotes gracefully', () => {
    const modifiedProps = {
      ...props,
      data: {
        ...props.data,
        global: false,
      },
    };
    render(<FootnotesBlockView {...modifiedProps} />);
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0); // No footnotes in mocked data for local content
  });

  test('renders superscript references correctly', () => {
    render(<FootnotesBlockView {...props} />);
    const superscripts = screen.getAllByRole('link', {
      name: /Back to content/i,
    });
    expect(superscripts).toHaveLength(2); // Two superscript references
  });

  test('renders dangerous HTML when valid', () => {
    const modifiedProps = {
      ...props,
      data: {
        ...props.data,
        global: false,
      },
      properties: {
        ...props.properties,
        metadata: '<p>Valid HTML content</p>',
      },
    };
    render(<FootnotesBlockView {...modifiedProps} />);
    expect(screen.getByText('Valid HTML content')).toBeInTheDocument();
  });
});
