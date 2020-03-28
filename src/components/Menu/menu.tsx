import React, { FC, useState, createContext } from 'react';
import classNames from 'classnames';
import { IMenuItem } from './menuItem';

type SelectCallback = (selectedIndex: string) => void;
type Mode = 'horizontal' | 'vertical';

export interface IMenuProps {
  className?: string;
  defaultIndex?: string;
  mode?: Mode;
  style?: React.CSSProperties;
  defaultOpenSubMenus?: string[];
  onSelect?: SelectCallback;
}

export interface IMenuContext {
  index: string;
  onSelect?: SelectCallback;
  defaultOpenSubMenus?: string[];
  mode?: Mode;
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });

const Menu: FC<IMenuProps> = props => {
  const { className, children, defaultIndex, onSelect, mode, defaultOpenSubMenus } = props;
  const [currentIndex, setIndex] = useState(defaultIndex);
  const classes = classNames('armor-menu', className, {
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
    <ul className={classes}>
      <MenuContext.Provider value={passedContext}>
        {React.Children.map(children, (child, index) => {
          const childElement = child as React.FunctionComponentElement<IMenuItem>;
          const { displayName } = childElement.type;

          if (displayName === 'MenuItem' || displayName === 'SubMenu') {
            return React.cloneElement(childElement, {
              index: index.toString(),
            });
          } else {
            console.warn('Warning: Menu has a child which is not menuItem component');
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
