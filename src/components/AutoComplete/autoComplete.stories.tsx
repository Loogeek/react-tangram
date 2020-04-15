import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AutoComplete, { DataSourceType } from './autoComplete';

const textComplete = `
  ~~~javascript
  const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins',
  'james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando']
  const handleFetch = (query: string) => {
    return lakers.filter(name => name.includes(query)).map(name => ({value: name}))
  }
  return (
    <AutoComplete 
      fetchSuggestions={handleFetch}
      onSelect={action('selected')}
      placeholder="输入湖人队球员英文名试试"
    />
  )
  ~~~
`;

const lakers = [
  'bradley',
  'pope',
  'caruso',
  'cook',
  'cousins',
  'james',
  'AD',
  'green',
  'howard',
  'kuzma',
  'McGee',
  'rando',
];

const handleFetchData = (query: string) => {
  return lakers.filter((item) => item.includes(query)).map((item) => ({ value: item }));
};

const defaultAutoComplete = () => (
  <AutoComplete placeholder="漂亮的 Input" fetchSuggestions={handleFetchData} />
);

const customComplete = () => {
  const lakersWithNumber = [
    { value: 'bradley', number: 11 },
    { value: 'pope', number: 1 },
    { value: 'caruso', number: 4 },
    { value: 'cook', number: 2 },
    { value: 'cousins', number: 15 },
    { value: 'james', number: 23 },
    { value: 'AD', number: 3 },
    { value: 'green', number: 14 },
    { value: 'howard', number: 39 },
    { value: 'kuzma', number: 0 },
  ];
  const handleFetch = (query: string) => {
    return lakersWithNumber.filter((player) => player.value.includes(query));
  };
  const renderOption = (item: DataSourceType) => {
    const itemWithNumber = item as DataSourceType<LakerPlayerProps>;
    return (
      <>
        <b>名字: {itemWithNumber.value}</b>
        <span>球衣号码: {itemWithNumber.number}</span>
      </>
    );
  };
  return (
    <AutoComplete
      fetchSuggestions={handleFetch}
      onSelect={action('selected')}
      placeholder="输入湖人队球员英文,自定义下拉模版"
      renderOption={renderOption}
    />
  );
};

const textCustom = `
### 示例代码
~~~javascript
const lakersWithNumber = [
  {value: 'bradley', number: 11},
  {value: 'pope', number: 1},
  {value: 'caruso', number: 4},
  {value: 'cook', number: 2},
  {value: 'cousins', number: 15},
  {value: 'james', number: 23},
  {value: 'AD', number: 3},
  {value: 'green', number: 14},
  {value: 'howard', number: 39},
  {value: 'kuzma', number: 0},
] 
const handleFetch = (query: string) => {
  return lakersWithNumber.filter(player => player.value.includes(query))
}
const renderOption = (item: DataSourceType) => {
  const itemWithNumber = item as DataSourceType<LakerPlayerProps>
  return (
    <>
      <b>名字: {itemWithNumber.value}</b>
      <span>球衣号码: {itemWithNumber.number}</span>
    </>
  )
}
return (
  <AutoComplete 
    fetchSuggestions={handleFetch}
    onSelect={action('selected')}
    placeholder="输入湖人队球员英文,自定义下拉模版"
    renderOption={renderOption}
  />
)
~~~
`;

storiesOf('第九章：AutoComplete', module)
  .add('AutoComplte', defaultAutoComplete, { info: { source: false, test: textComplete } })
  .add('自定义下拉选项', customComplete, { info: { source: false, text: textCustom } });
