import { PropsWithoutRef, SetStateAction, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import { Member } from '../../models/Members';
import MembersList from './MembersList';

type TabProps = PropsWithoutRef<{
  list: Member[];
}>;
type TabsProps = PropsWithoutRef<{
  [proppName: string]: TabProps;
}>;
export type MembersTabsProps = PropsWithoutRef<{
  tabs?: TabsProps;
  list?: Member[];
}>;

export default function MembersTabs({ tabs, list }: MembersTabsProps) {
  const [key, setKey] = useState('all');
  return (
    <Tabs
      activeKey={key}
      onSelect={k => setKey(k as SetStateAction<string>)}
      className="mb-3"
    >
      <Tab eventKey="all" title="全部成员">
        <MembersList list={list} />
      </Tab>
      {tabs &&
        Object.keys(tabs).map(tabKey => (
          <Tab
            key={tabKey}
            eventKey={tabKey}
            tabClassName="p-2"
            title={tabKey + '(' + tabs[tabKey]?.list?.length + ')'}
          >
            <MembersList list={tabs[tabKey]?.list} />
          </Tab>
        ))}
    </Tabs>
  );
}
