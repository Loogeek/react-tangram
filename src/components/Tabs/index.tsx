import { FC } from 'react';
import Tabs, { ITabsProps } from './tabs';
import TabItem, { ITabItemProps } from './tabItem';

export type ITabsComponent = FC<ITabsProps> & {
  Item: FC<ITabItemProps>;
};
const TransTabs = Tabs as ITabsComponent;
TransTabs.Item = TabItem;

export default TransTabs;
