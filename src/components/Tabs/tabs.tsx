import React, { FC, useState, FunctionComponentElement } from 'react';
import classNames from 'classnames';
import { ITabItemProps } from './tabItem';

type SelectCallback = (selectedIndex: number, content?: any) => void;
type TabsType = 'line' | 'card';

export interface ITabsProps {
  /**当前激活 tab 面板的 index，默认为0 */
  defaultIndex?: number;
  /**可以扩展的 className */
  className?: string;
  /**点击 Tab 触发的回调函数 */
  onSelect?: SelectCallback;
  /**Tabs的样式，两种可选，默认为 line */
  type?: TabsType;
  style?: React.CSSProperties;
}

/**
 * 选项卡切换组件。
 * 提供平级的区域将大块内容进行收纳和展现，保持界面整洁。
 * ### 引用方法
 *
 * ~~~js
 * import { Tabs } from 'armor'
 * ~~~
 */
export const Tabs: FC<ITabsProps> = (props) => {
  const { defaultIndex, style, className, onSelect, type, children } = props;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const classes = classNames('armor-tabs-nav', className, {
    'nav-line': type === 'line',
    'nav-card': type === 'card',
  });

  const handleSelect = (e: React.MouseEvent, index: number, disabled: boolean) => {
    if (!disabled) {
      setActiveIndex(index);
      if (onSelect) {
        onSelect(index);
      }
    }
  };

  function renderTab() {
    return React.Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<ITabItemProps>;
      if (childElement.type?.displayName === 'TabItem') {
        const { label, disabled = false } = childElement.props;
        const classes = classNames('armor-tabs-nav-item', {
          disabled: disabled,
          'is-active': activeIndex === index,
        });

        return (
          <li
            className={classes}
            onClick={(e) => handleSelect(e, index, disabled)}
            key={`nav=item-${index}`}
          >
            {label}
          </li>
        );
      } else {
        console.warn('Warning: Tabs has a child which is not TabItem component');
      }
    });
  }

  function renderContent() {
    return React.Children.map(children, (child, index) => {
      if (index === activeIndex) {
        return child;
      }

      return null;
    });
  }

  return (
    <div className="armor-tabs">
      <ul className={classes} style={style}>
        {renderTab()}
      </ul>
      <div className="armor-tabs-content">{renderContent()}</div>
    </div>
  );
};

Tabs.defaultProps = {
  defaultIndex: 0,
  type: 'line',
};

export default Tabs;
