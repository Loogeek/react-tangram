import React, { FC, useState, useEffect, ReactElement, ChangeEvent } from 'react';
import classNames from 'classnames';
import Input, { IInputProps } from '../Input/input';
import Icon from '../Icon';
import useDebounce from '../../hooks/useDebounce';

interface DataSourceObject {
  value: string;
}

export type DataSourceType<T = {}> = T & DataSourceObject;

export interface IAutoCompleteProps extends Omit<IInputProps, 'onSelect'> {
  fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
  onSelect?: (item: string) => void;
  renderOption?: (item: DataSourceType) => ReactElement;
}

export const AutoComplete: FC<IAutoCompleteProps> = (props) => {
  const { fetchSuggestions, onSelect, value = '', renderOption, ...restProps } = props;
  const [inputValue, setInputValue] = useState(value as string);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
  const debounceVal = useDebounce(inputValue);
  useEffect(() => {
    console.log(debounceVal);
    const respSuggestions = fetchSuggestions(inputValue);
    if (respSuggestions instanceof Promise) {
      setLoading(true);
      respSuggestions
        .then((resp) => {
          setLoading(false);
          setSuggestions(resp);
          setShowSuggestions(true);
        })
        .catch((e) => {
          setLoading(false);
          console.error(e);
        });
    } else {
      setSuggestions(respSuggestions);
      setShowSuggestions(true);
    }
  }, [debounceVal, fetchSuggestions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <Input value={inputValue} onChange={(e) => handleChange(e)} {...restProps} />
      {showSuggestions && (
        <ul>
          {loading ? (
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, index) => (
              <li key={index}>{renderOption ? renderOption(s) : s.value}</li>
            ))
          ) : (
            <li>暂无数据</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
