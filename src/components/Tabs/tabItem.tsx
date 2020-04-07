import React, { FC } from 'react';

export interface ITabItemProps {
  label: string | React.ReactElement;
  disabled?: boolean;
}

export const TabItem: FC<ITabItemProps> = ({ children }) => {
  return <div className="armor-tab-panel">{children}</div>;
};

TabItem.displayName = 'TabItem';

export default TabItem;