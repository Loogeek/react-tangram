import React, { FC, InputHTMLAttributes, ReactElement } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import Icon from '../Icon/icon';

type InputSize = 'lg' | 'sm';

interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  disabled?: boolean;
  size?: InputSize;
  icon?: IconProp;
  prepend?: string | ReactElement;
  append?: string | ReactElement;
}

export const Input: FC<IInputProps> = (props) => {
  const { disabled, size, icon, prepend, append, style, ...restProps } = props;
  const classes = classNames('armor-input-wrapper', {
    'is-disabled': disabled,
    [`input-size-${size}`]: size,
    'input-group': !!append || !!prepend,
    'input-group-append': !!append,
    'input-group-prepend': !!prepend,
  });

  return (
    <div className={classes} style={style}>
      {prepend && <div className="armor-input-group-prepend">{prepend}</div>}
      {icon && (
        <div className="icon-wrapper">
          <Icon icon={icon} />
        </div>
      )}
      <input className="armor-input-inner" disabled={disabled} {...restProps} />
      {append && <div className="armor-input-group-append">{append}</div>}
    </div>
  );
};

export default Input;
