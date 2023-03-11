import { FC } from 'react';
import { ParsedUrlQuery } from 'querystring';

import { Member, MembersGroup } from '../../models/Member';
import { MemberTitle } from './Title';
import { MemberList } from './List';
import { MemberTabs, TabsData } from './Tabs';

export interface MemberStaticProps {
  membersGroup: MembersGroup;
  otherMembersList?: Member[];
  query?: ParsedUrlQuery;
}

export const MemberStatic: FC<MemberStaticProps> = ({
  membersGroup,
  otherMembersList = [],
  query,
}) => (
  <>
    {membersGroup &&
      Object.entries(membersGroup).map(([key, { list, tabs, count }]) => (
        <div key={key}>
          <MemberTitle
            title={key}
            count={(count as number) || (list as Member[])?.length}
          />
          {tabs ? (
            <MemberTabs
              tabs={tabs as TabsData}
              active={query!.name as string}
              list={list as Member[]}
            />
          ) : (
            <MemberList list={list as Member[]} />
          )}
        </div>
      ))}
    {otherMembersList?.length > 0 && (
      <>
        <MemberTitle count={otherMembersList?.length} />
        <MemberList list={otherMembersList} />
      </>
    )}
  </>
);
