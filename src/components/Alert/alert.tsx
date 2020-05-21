import React, { useState, FC } from 'react';
import classNames from 'classnames';
import Transition from '../Transition/transition';
import Icon from '../Icon/icon';

type AlertType = 'success' | 'default' | 'danger' | 'warning';

export interface IAlertProps {
  /**标题 */
  title: string;
  /**描述 */
  description?: string;
  /**类型 四种可选 针对四种不同的场景 */
  type?: AlertType;
  /**关闭alert时触发的事件 */
  onClose?: () => void;
  /**是否显示关闭图标*/
  closable?: boolean;
  className?: string;
  visible?: boolean;
}

const Alert: FC<IAlertProps> = (props) => {
  const { title, description, onClose, closable, type, className, visible } = props;
  const classes = classNames('react-tangram-alert', className, {
    [`react-tangram-alert-${type}`]: type,
  });
  const [isHideAlert, setHideAlert] = useState(visible);

  const handleClick = (e: React.MouseEvent) => {
    setHideAlert(!isHideAlert);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Transition timeout={300} in={isHideAlert} animation="zoom-in-top">
      <div className={classes}>
        <p className="bold-title">{title}</p>
        {closable && (
          <div className="react-tangram-alert-close" onClick={handleClick}>
            <Icon icon="times" />
          </div>
        )}
        {description && <p className="react-tangram-alert-desc">{description}</p>}
      </div>
    </Transition>
  );
};

Alert.defaultProps = {
  type: 'default',
  closable: true,
  visible: true,
};

export default Alert;
