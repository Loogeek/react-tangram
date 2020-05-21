import React, {
  FC,
  useState,
  useEffect,
  useRef,
  ReactElement,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import classNames from 'classnames';
import Input, { IInputProps } from '../Input/input';
import Transition from '../Transition/transition';
import Icon from '../Icon';
import useDebounce from '../../hooks/useDebounce';
import useClickOutside from '../../hooks/useClickOutside';

interface DataSourceObject {
  value: string;
}

export type DataSourceType<T = {}> = T & DataSourceObject;

export interface IAutoCompleteProps extends Omit<IInputProps, 'onSelect'> {
  /**
   * 返回输入建议的方法，可以拿到当前的输入，然后返回同步的数组或者是异步的 Promise
   * type DataSourceType<T = {}> = T & DataSourceObject
   */
  fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
  /** 点击选中建议项时触发的回调*/
  onSelect?: (item: DataSourceType) => void;
  /**支持自定义渲染下拉项，返回 ReactElement */
  renderOption?: (item: DataSourceType) => ReactElement;
}

/**
 * 输入框自动完成功能。当输入值需要自动完成时使用，支持同步和异步两种方式
 * 支持 Input 组件的所有属性 支持键盘事件选择
 * ### 引用方法
 *
 * ~~~js
 * import { AutoComplete } from 'react-tangram'
 * ~~~
 */
export const AutoComplete: FC<IAutoCompleteProps> = (props) => {
  const { fetchSuggestions, onSelect, value = '', renderOption, ...restProps } = props;
  const [inputValue, setInputValue] = useState(value as string);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
  const debounceVal = useDebounce(inputValue);
  const componentRef = useRef<HTMLDivElement>(null);
  const triggerSearch = useRef(false);

  useClickOutside(componentRef, () => {
    setShowSuggestions(false);
    setSuggestions([]);
  });

  useEffect(() => {
    if (debounceVal && triggerSearch.current) {
      const respSuggestions = fetchSuggestions(debounceVal);
      if (respSuggestions instanceof Promise) {
        setLoading(true);
        respSuggestions
          .then((resp) => {
            setLoading(false);
            setSuggestions(resp);
            if (resp.length > 0) {
              setShowSuggestions(true);
            }
          })
          .catch((e) => {
            setLoading(false);
            console.error(e);
          });
      } else {
        setSuggestions(respSuggestions);
        if (respSuggestions.length > 0) {
          setShowSuggestions(true);
        }
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveIndex(-1);
  }, [debounceVal, fetchSuggestions]);

  const countActiveIndex = (index: number) => {
    if (index < 0) index = 0;
    if (index >= suggestions.length) index = suggestions.length - 1;

    setActiveIndex(index);
  };

  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(item);
    }
    triggerSearch.current = false;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    triggerSearch.current = true;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case 13: // enter
        if (suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case 38: // up
        countActiveIndex(activeIndex - 1);
        break;
      case 40: // down
        countActiveIndex(activeIndex + 1);
        break;
      case 27: // esc
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  function renderSuggestions() {
    return (
      <Transition
        in={showSuggestions || loading}
        animation="zoom-in-top"
        timeout={300}
        onExited={() => {
          setShowSuggestions(false);
          setSuggestions([]);
        }}
      >
        <ul className="react-tangram-suggestion-list">
          {loading ? (
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, index) => {
              const cnames = classNames('suggestion-item', {
                'is-active': index === activeIndex,
              });
              return (
                <li key={index} className={cnames} onClick={() => handleSelect(s)}>
                  {renderOption ? renderOption(s) : s.value}
                </li>
              );
            })
          ) : (
            <li className="empty">暂无数据</li>
          )}
        </ul>
      </Transition>
    );
  }

  return (
    <div ref={componentRef} className="react-tangram-auto-complete">
      <Input value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} {...restProps} />
      {showSuggestions && renderSuggestions()}
    </div>
  );
};

export default AutoComplete;
