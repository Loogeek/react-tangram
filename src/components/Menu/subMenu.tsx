import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { IMenuItemProps } from './menuItem';
import { MenuContext } from './menu';

export interface ISubMenu {
  title: string;
  index?: string;
  className?: string;
}

const SubMenu: React.FC<ISubMenu> = props => {
  const { title, index, className, children } = props;
  const context = useContext(MenuContext);
  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
  });
  const isOpen =
    index && context.mode === 'vertical' ? context.defaultOpenSubMenus?.includes(index) : false;
  const [menuOpen, setMenuOpen] = useState(isOpen);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    e.stopPropagation();
    clearTimeout(timer);
    timer = setTimeout(() => {
      setMenuOpen(toggle);
    }, 300);
  };

  const clickEvent =
    context.mode === 'vertical'
      ? {
          onClick: handleClick,
        }
      : {};
  const hoverEvents =
    context.mode !== 'vertical'
      ? {
          onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
          onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false),
        }
      : {};

  return (
    <li className={classes} {...hoverEvents}>
      <div className="submenu-title" {...clickEvent}>
        {title}
      </div>
      <ul className={classNames('armor-submenu', { 'menu-opened': menuOpen })}>
        {React.Children.map(children, (child, i) => {
          const childElement = child as React.FunctionComponentElement<IMenuItemProps>;
          const { displayName } = childElement.type;

          if (displayName === 'MenuItem') {
            return React.cloneElement(childElement, {
              index: `${index}-${i}`,
            });
          } else {
            console.warn('Warning: SubMenu has a child which is not MenuItem component');
          }
        })}
      </ul>
    </li>
  );
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
