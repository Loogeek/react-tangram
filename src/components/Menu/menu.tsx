import React, { FC, FunctionComponentElement, useState, createContext } from 'react';
import classNames from 'classnames';
import { IMenuItemProps } from './menuItem';

type SelectCallback = (selectedIndex: string) => void;
type MenuMode = 'horizontal' | 'vertical';

export interface IMenuProps {
  className?: string;
  /**默认 active 的菜单项的索引值 */
  defaultIndex?: string;
  /**菜单类型 横向或者纵向 */
  mode?: MenuMode;
  style?: React.CSSProperties;
  defaultOpenSubMenus?: string[];
  /**点击菜单项触发的回掉函数 */
  onSelect?: SelectCallback;
}

export interface IMenuContext {
  index: string;
  onSelect?: SelectCallback;
  defaultOpenSubMenus?: string[];
  mode?: MenuMode;
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });

export const Menu: FC<IMenuProps> = (props) => {
  const { className, style, children, defaultIndex, onSelect, mode, defaultOpenSubMenus } = props;
  const [currentIndex, setIndex] = useState(defaultIndex);
  const classes = classNames('react-tangram-menu', className, {
    'menu-horizontal': mode === 'horizontal',
    'menu-vertical': mode === 'vertical',
  });

  const handleSelect = (index: string) => {
    setIndex(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuContext = {
    mode,
    defaultOpenSubMenus,
    index: currentIndex ? currentIndex : '0',
    onSelect: handleSelect,
  };

  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {React.Children.map(children, (child, index) => {
          const childElement = child as FunctionComponentElement<IMenuItemProps>;

          if (
            childElement.type?.displayName === 'MenuItem' ||
            childElement.type?.displayName === 'SubMenu'
          ) {
            return React.cloneElement(childElement, {
              index: index.toString(),
            });
          } else {
            console.warn('Warning: Menu has a child which is not MenuItem component');
          }
        })}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: '0',
  defaultOpenSubMenus: [],
  mode: 'horizontal',
};

export default Menu;
