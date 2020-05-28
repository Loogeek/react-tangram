import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';

export interface IMenuItemProps {
  index?: string;
  /**选项扩展的 className */
  className?: string;
  /**选项是否被禁用 */
  disabled?: boolean;
  /**选项的自定义 style */
  style?: React.CSSProperties;
}

export const MenuItem: FC<IMenuItemProps> = (props) => {
  const { children, disabled, className, index, style } = props;
  const context = useContext(MenuContext);
  const classes = classNames('menu-item', className, {
    'is-disabled': disabled,
    'is-active': index === context.index,
  });
  const { onSelect } = context;
  const handleClick = () => {
    if (onSelect && !disabled && typeof index === 'string') {
      onSelect(index);
    }
  };

  return (
    <li className={classes} onClick={handleClick} style={style}>
      {children}
    </li>
  );
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
