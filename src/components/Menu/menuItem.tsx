import React, { useContext, FC } from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';

export interface IMenuItem {
  index?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const MenuItem: FC<IMenuItem> = props => {
  const { children, disabled, className, index } = props;
  const context = useContext(MenuContext);
  const classes = classNames('menu-item', className, {
    'is-disabled': disabled,
    'is-active': index === context.index,
  });
  const { onSelect } = context;
  const handleClick = () => {
    if (onSelect && !disabled && typeof index === 'number') {
      onSelect(index);
    }
  };

  return (
    <li className={classes} onClick={handleClick}>
      {children}
    </li>
  );
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
