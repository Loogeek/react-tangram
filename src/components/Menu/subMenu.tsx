import React, { FC, useState, useContext } from 'react';
import classNames from 'classnames';
import { IMenuItemProps } from './menuItem';
import { MenuContext } from './menu';
import Icon from '../Icon/icon';
import Transition from '../Transition/transition';

export interface ISubMenuProps {
  title: string;
  index?: string;
  className?: string;
}

const SubMenu: FC<ISubMenuProps> = props => {
  const { title, index, className, children } = props;
  const context = useContext(MenuContext);
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
  const isOpend = index && context.mode === 'vertical' ? openedSubMenus.includes(index) : false;
  const [menuOpen, setMenuOpen] = useState(isOpend);
  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
    'is-opened': menuOpen,
    'is-vertical': context.mode === 'vertical',
  });
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
        <Icon icon="angle-down" className="arrow-icon" />
      </div>
      <Transition in={menuOpen} animation="zoom-in-top" timeout={300}>
        <ul
          className={classNames('armor-submenu', {
            'menu-opened': menuOpen,
          })}
        >
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
      </Transition>
    </li>
  );
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
