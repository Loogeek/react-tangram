import React, { FC, useState, useEffect, ReactElement, ChangeEvent } from 'react';
import classNames from 'classnames';
import Input, { IInputProps } from '../Input/input';

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
  const { fetchSuggestions, onSelect, renderOption, ...restProps } = props;
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);

  useEffect(() => {
    const respSuggestions = fetchSuggestions(inputValue);
    if (respSuggestions instanceof Promise) {
      respSuggestions
        .then((resp) => {
          setSuggestions(resp);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      setSuggestions(respSuggestions);
    }
  }, [inputValue, fetchSuggestions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <Input
        value={inputValue}
        onChange={(e) => handleChange(e)}
        {...restProps}
        defaultValue="111"
      />
      <ul>
        {suggestions.length > 0 ? (
          suggestions.map((s, index) => (
            <li key={index}>{renderOption ? renderOption(s) : s.value}</li>
          ))
        ) : (
          <li>暂无数据</li>
        )}
      </ul>
    </div>
  );
};

export default AutoComplete;
