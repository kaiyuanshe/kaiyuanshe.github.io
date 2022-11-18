import { FC, SetStateAction, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import { Member } from '../../models/Member';
import { MemberList } from './List';

type TabData = Record<string, { list: Member[] }>;

export type TabsData = Record<string, Record<string, TabData>>;

export interface MemberTabsProps {
  tabs?: TabsData;
  list?: Member[];
}

export const MemberTabs: FC<MemberTabsProps> = ({ tabs, list }) => {
  const [activeKey, setActiveKey] = useState('all');

  return (
    <Tabs
      id="MemberTabs"
      activeKey={activeKey}
      onSelect={k => setActiveKey(k as SetStateAction<string>)}
      className="mb-3"
    >
      <Tab eventKey="all" title={`委员会(${list?.length})`}>
        <MemberList list={list} />
      </Tab>
      {tabs &&
        Object.entries(tabs).map(([key, { list }]) => (
          <Tab
            key={key}
            eventKey={key}
            tabClassName="p-2"
            title={`${key}(${list.length})`}
          >
            <MemberList list={list as unknown as Member[]} />
          </Tab>
        ))}
    </Tabs>
  );
};
