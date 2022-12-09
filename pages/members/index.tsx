import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { Loading } from 'idea-react';
import { observable } from 'mobx';

import membersStore, { Member } from '../../models/Member';
import { i18n } from '../../models/Translation';

import PageHead from '../../components/PageHead';
import { MemberTitle } from '../../components/Member/Title';
import { MemberList } from '../../components/Member/List';
import {
  MemberTabs,
  MemberTabsProps,
  TabsData,
} from '../../components/Member/Tabs';

type MembersGroup = Record<string, Record<string, MemberTabsProps>>;

const groupMemberFn = (
  groupMap: MembersGroup,
  groupKeys: string[],
  groupItem: Member,
) => {
  for (const key of groupKeys || [])
    ((groupMap[key] = groupMap[key] || { list: [] }).list as Member[]).push(
      groupItem,
    );
};

@observer
export default class MembersPage extends PureComponent {
  @observable
  membersGroup = {} as MembersGroup;

  @observable
  otherMembersList: Member[] = [];

  async componentDidMount() {
    const list = await membersStore.getList({}, 1, 300);
    const otherMembersList: Member[] = [];
    const projectKey = '项目委员会';
    const departmentKey = '执行委员会';
    let membersGroup: any = {
      理事会: { list: [] },
      顾问委员会: { list: [] },
      法律咨询委员会: { list: [] },
      执行委员会: { list: [], tabs: {}, count: 0 },
      项目委员会: { list: [], tabs: {}, count: 0 },
    };

    for (const member of list) {
      //Classify the organization of kaiyuanshe | 一级部门分组 👇
      groupMemberFn(membersGroup, member.organization as string[], member);

      //Classify the department of kaiyuanshe | 工作组分组 👇
      groupMemberFn(
        membersGroup[departmentKey].tabs,
        member.department as string[],
        member,
      );
      member.department && membersGroup[departmentKey].count++;

      //Classify the projectKey of kaiyuanshe | 项目分组👇
      groupMemberFn(
        membersGroup[projectKey].tabs,
        member.project as string[],
        member,
      );
      if (member.project) membersGroup[projectKey].count++;

      //Classify the OtherMember of kaiyuanshe | 其他未分组用户 👇
      if (!member.organization && !member.department && !member.project)
        otherMembersList.push(member);
    }

    // Updata
    this.membersGroup = membersGroup;
    this.otherMembersList = otherMembersList;
  }
  render() {
    const { downloading } = membersStore;
    const { membersGroup, otherMembersList } = this;

    return (
      <Container className="my-4">
        {downloading > 0 && <Loading />}
        <PageHead title={i18n.t('organization_member')} />

        <h1 className="w-100 my-5 text-center">
          {i18n.t('organization_member')}
        </h1>
        {membersGroup &&
          Object.entries(membersGroup).map(([key, { list, tabs, count }]) => (
            <div key={key}>
              <MemberTitle
                title={key}
                count={(count as number) || (list as Member[])?.length}
              />
              {tabs ? (
                <MemberTabs tabs={tabs as TabsData} list={list as Member[]} />
              ) : (
                <MemberList list={list as Member[]} />
              )}
            </div>
          ))}
        {otherMembersList.length > 0 && (
          <>
            <MemberTitle count={otherMembersList?.length} />
            <MemberList list={otherMembersList} />
          </>
        )}
      </Container>
    );
  }
}
