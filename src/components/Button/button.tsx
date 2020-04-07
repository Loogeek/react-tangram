import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link' | 'success';
export type ButtonSize = 'lg' | 'sm';

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  /**设置 Button 的类型 */
  btnType?: ButtonType;
  /**设置 Button 的尺寸 */
  size?: ButtonSize;
  /**设置 Button 的是否禁用 */
  disabled?: boolean;
  href?: string;
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;

export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

/**
 * 页面中最常用的的按钮元素，适合于完成特定的交互
 * ### 引用方法
 *
 * ~~~js
 * import { Button } from 'armor'
 * ~~~
 */
export const Button: FC<ButtonProps> = (props) => {
  const { href, className, btnType, size, disabled, children, ...restProps } = props;
  const classes = classNames('armor-btn', className, {
    [`armor-btn-${size}`]: size,
    [`armor-btn-${btnType}`]: btnType,
    disabled: btnType === 'link' && disabled,
  });

  if (btnType === 'link' && href) {
    return (
      <a href={href} className={classes} {...restProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  btnType: 'default',
  disabled: false,
};

export default Button;
