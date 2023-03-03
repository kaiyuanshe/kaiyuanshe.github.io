import { FC, SetStateAction, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useRouter } from 'next/router';

import { isServer } from '../../models/Base';
import { Member } from '../../models/Member';
import { MemberList } from './List';

type TabData = Record<string, { list: Member[] }>;

export type TabsData = Record<string, Record<string, TabData>>;

export interface MemberTabsProps {
  tabs?: TabsData;
  list?: Member[];
  showMore?: Boolean;
}

export const MemberTabs: FC<MemberTabsProps> = ({ tabs, list }) => {
  const { query } = useRouter();
  let activeTabName = query.name as string;
  const [activeKey, setActiveKey] = useState(
    (tabs as unknown as Record<string, string>)[activeTabName]
      ? activeTabName
      : 'all',
  );

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
