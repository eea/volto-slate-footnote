import React from 'react';
import renderer from 'react-test-renderer';
import SearchWidget from './SearchWidget';
describe('Test SearchWidget', () => {
  it('check html content', () => {
    const component = renderer.create(<SearchWidget />);
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
