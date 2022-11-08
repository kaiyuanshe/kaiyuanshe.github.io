import { FC, SetStateAction, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import { Member } from '../../models/Members';
import { MembersList } from './MembersList';

type TabData = Record<string, { list: Member[] }>;

type TabsData = Record<string, Record<string, TabData>>;

export interface MembersTabsProps {
  tabs?: TabsData;
  list?: Member[];
}

export const MembersTabs: FC<MembersTabsProps> = ({ tabs, list }) => {
  const [activeKey, setActiveKey] = useState('all');
  return (
    <Tabs
      activeKey={activeKey}
      onSelect={k => setActiveKey(k as SetStateAction<string>)}
      className="mb-3"
    >
      <Tab eventKey="all" title={`委员会(${list?.length})`}>
        <MembersList list={list} />
      </Tab>
      {tabs &&
        Object.entries(tabs).map(([key, { list }]) => (
          <Tab
            key={key}
            eventKey={key}
            tabClassName="p-2"
            title={`${key}(${list.length})`}
          >
            <MembersList list={list as unknown as Member[]} />
          </Tab>
        ))}
    </Tabs>
  );
};
