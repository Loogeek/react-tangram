import React, { useState, useContext, FC } from 'react';
import classNames from 'classnames';
import { IMenuItem } from './menuItem';
import { MenuContext } from './menu';

export interface ISubMenu {
  title: string;
  index?: string;
  className?: string;
}

const SubMenu: FC<ISubMenu> = props => {
  const { title, index, className, children } = props;
  const classes = classNames('menu-item submenu-item', className);
  const context = useContext(MenuContext);
  const isOpen =
    index && context.mode === 'vertical' ? context.defaultOpenSubMenus?.includes(index) : false;
  const [menuOpen, setMenuOpen] = useState(isOpen);

  return (
    <li className={classes}>
      <div className="submenu-title">{title}</div>
      <ul className={classNames('armor-submenu', { 'menu-open': menuOpen })}>
        {React.Children.map(children, (child, i) => {
          const childElement = child as React.FunctionComponentElement<IMenuItem>;
          const { displayName } = childElement.type;

          if (displayName === 'MenuItem') {
            return React.cloneElement(childElement, {
              index: `${index}-${i}`,
            });
          } else {
            console.warn('Warning: Menu has a child which is not menuItem component');
          }
        })}
      </ul>
    </li>
  );
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
