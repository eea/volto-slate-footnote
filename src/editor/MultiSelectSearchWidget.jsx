/**
 * ArrayWidget component.
 * @module components/manage/Widgets/ArrayWidget
 */

import React, { useState, useEffect } from 'react';
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
    const [selectedOption, setSelectedOption] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [parentFootnote, setParentFootnote] = useState(props.value);

    useEffect(() => {
      if (props.value) {
        const parentFootnoteCurrent = props.value;

        const extraValues =
          parentFootnoteCurrent && props.value.extra ? props.value.extra : [];
        const selectedOptionCurrent = parentFootnoteCurrent.value
          ? [...[parentFootnoteCurrent], ...extraValues]
          : [];
        setSelectedOption(selectedOptionCurrent);

        // from choices (list of all footnotes available including current in value) get all not
        // found in current in value
        // consider that new footnotes have value and footnote undefined
        const defaultOptions = (props.choices || []).filter(
          (item) =>
            !selectedOption.find(({ label }) => label === item.label) &&
            item.value,
        );
        setDefaultOptions(defaultOptions);
        setParentFootnote(props.value);
      }
    }, [props]); // eslint-disable-line

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

    /**
     * If the list is empty or the first is not parent, return true
     * @param {Object[]} optionsList list of objects - footnotes
     * @returns {boolean}
     */
    const isParetFootnoteRemoved = (optionsList) =>
      !optionsList[0] || optionsList[0].value !== parentFootnote.value;

    /**
     * replace all parentFootnote data except uid, with the first from the list
     * @param {Object[]} optionsList list of objects - footnotes
     * @returns {Object}
     */
    const setParentFootnoteFromExtra = (optionsList) => {
      const { footnote, label, value } = optionsList[0] || [];

      return {
        ...parentFootnote,
        footnote: footnote || optionsList[0]?.value,
        label,
        value,
        extra: optionsList.slice(1),
      };
    };

    /**
     * Will make the footnotes object, that will be saved as first from optionsList
     * the rest will be added to extra
     * @param {Object[]} optionsList
     * @returns
     */
    const setFootnoteFromSelection = (optionsList) => {
      const extra = optionsList.slice(1).map((item) => {
        const obj = {
          ...item,
          footnote: item.value,
        };

        const { __isNew__: remove, extra, ...rest } = obj;
        return rest;
      });
      return { ...parentFootnote, extra };
    };

    /**
     * Handle the field change, will remake the result based on the new selected list
     * @method handleChange
     * @param {array} optionsList The selected options (already aggregated).
     * @returns {undefined}
     */
    const handleChange = (optionsList) => {
      const formattedSelectedOptions = optionsList.map((option) => ({
        footnoteId: nanoid(5), // to be overwritten if already exists (keep as a reference to same text)
        ...option,
        uid: nanoid(5), // overwrite existing, thus creating new record for the same text
        footnote: option.value,
      }));
      setSelectedOption(formattedSelectedOptions);

      // manage case if parent footnotes (first from the options) was removed
      const resultSelected = isParetFootnoteRemoved(formattedSelectedOptions)
        ? setParentFootnoteFromExtra(formattedSelectedOptions)
        : setFootnoteFromSelection(formattedSelectedOptions);

      props.onChange({
        footnote: resultSelected,
      });
    };

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
