/**
 * ArrayWidget component.
 * @module components/manage/Widgets/ArrayWidget
 */

import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { escapeRegExp, filter } from 'lodash';
import { nanoid } from 'volto-slate/utils';

import { FormFieldWrapper } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

const messages = defineMessages({
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  no_options: {
    id: 'No options',
    defaultMessage: 'No options',
  },
});

const MultiSelectSearchWidget = injectLazyLibs('reactSelectAsyncCreateable')(
  (props) => {
    const parentFootnote = props.value;
    const extraValues = props.value.extra ? props.value.extra : [];
    const [selectedOption, setSelectedOption] = useState(
      parentFootnote.value ? [...[parentFootnote], ...extraValues] : [],
    );

    /**
     * evaluate on Regex to filter results
     * @param {Object} e - event
     * @param {Object} data
     */
    const loadOptions = (search) => {
      const re = new RegExp(escapeRegExp(search), 'i');
      const isMatch = (result) => re.test(result.value);
      const resultsFiltered = filter(props.choices, isMatch);

      return new Promise((resolve, reject) => {
        resolve(resultsFiltered);
      });
    };

    const isParetFootnoteRemoved = (selectedOption) =>
      !selectedOption[0] || selectedOption[0].value !== parentFootnote.value;

    const setParentFootnoteFromExtra = (selectedOption) => {
      const { footnote, label, value } = selectedOption[0] || [];

      return {
        ...parentFootnote,
        footnote: footnote || selectedOption[0]?.value,
        label,
        value,
        extra: selectedOption.slice(1),
      };
    };

    const setFootnoteFromSelection = (selectedOption) => {
      const extra = selectedOption.slice(1).map((item) => {
        const obj = {
          uid: nanoid(5),
          ...item,
          footnote: item.value,
        };

        const { __isNew__: remove, ...rest } = obj;
        return rest;
      });

      return { ...parentFootnote, extra };
    };

    /**
     * Handle the field change, store it in the local state and back to simple
     * array of tokens for correct serialization
     * @method handleChange
     * @param {array} selectedOption The selected options (already aggregated).
     * @returns {undefined}
     */
    const handleChange = (selectedOption) => {
      setSelectedOption(selectedOption);

      const resultSlected = isParetFootnoteRemoved(selectedOption)
        ? setParentFootnoteFromExtra(selectedOption)
        : setFootnoteFromSelection(selectedOption);

      props.onChange({
        footnote: resultSlected,
      });
    };

    const defaultOptions = (props.choices || []).filter(
      (item) =>
        !selectedOption.find(({ label }) => label === item.label) && item.value,
    );
    const AsyncCreatableSelect = props.reactSelectAsyncCreateable.default;

    return (
      <FormFieldWrapper {...props}>
        <AsyncCreatableSelect
          isDisabled={props.isDisabled}
          className="react-select-container"
          classNamePrefix="react-select"
          defaultOptions={defaultOptions}
          styles={customSelectStyles}
          theme={selectTheme}
          components={{ DropdownIndicator, Option }}
          isMulti
          options={defaultOptions}
          value={selectedOption || []}
          loadOptions={loadOptions}
          onChange={handleChange}
          placeholder={props.intl.formatMessage(messages.select)}
          noOptionsMessage={() => props.intl.formatMessage(messages.no_options)}
        />
      </FormFieldWrapper>
    );
  },
);

export default MultiSelectSearchWidget;
