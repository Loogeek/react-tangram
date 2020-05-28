import React, { FC } from 'react';

export interface ITabItemProps {
  /** Tab选项上面的文字 */
  label: string | React.ReactElement;
  /** Tab选项是否被禁用 */
  disabled?: boolean;
}

export const TabItem: FC<ITabItemProps> = ({ children }) => {
  return <div className="react-tangram-tab-panel">{children}</div>;
};

TabItem.displayName = 'TabItem';

export default TabItem;
