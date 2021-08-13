import React, { useState } from 'react';
import { Search, Card, Segment } from 'semantic-ui-react';
import { escapeRegExp, filter } from 'lodash';

const SearchWidget = (props) => {
  const [results, setResults] = useState([]);
  const { onChange, choices, value } = props;

  /**
   * evaluate on Regex to filter results
   * @param {Object} e - event
   * @param {Object} data
   */
  const handleSearchChange = (e, data) => {
    const re = new RegExp(escapeRegExp(data.value), 'i');
    const isMatch = (result) => re.test(result.footnote);
    const resultsFiltered = filter(choices, isMatch);

    setResults(resultsFiltered);
    onChange({ footnote: data.value });
  };

  /**
   * callback onChange for selection from results
   * @param {Object} e - event
   * @param {Object} data
   */
  const handleSelected = (e, data) => {
    const { footnote } = data.result;

    onChange({ footnote });
  };

  return (
    <div id={`blockform-fieldset-default`}>
      <Segment className="attached" fluid>
        <Card fluid>
          <Card.Content fluid>
            <Card.Header>Citation</Card.Header>
            <Card.Description fluid>
              <Search
                id="field-footnote"
                input={{ icon: 'search', iconPosition: 'right', fluid: true }}
                fluid
                onFocus={handleSearchChange}
                onResultSelect={handleSelected}
                onSearchChange={handleSearchChange}
                results={results}
                value={value}
              />
            </Card.Description>
          </Card.Content>
        </Card>
      </Segment>
    </div>
  );
};

export default SearchWidget;
