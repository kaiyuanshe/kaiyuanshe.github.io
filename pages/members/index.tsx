import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { Loading } from 'idea-react';
import { observable } from 'mobx';
import { isFunction } from 'lodash';

import PageHead from '../../components/PageHead';
import membersStore, { Member } from '../../models/Members';
import { LazyLoad } from '../../utils/layzload';
import { MembersTitle } from '../../components/Members/MembersTitle';
import { MembersList } from '../../components/Members/MembersList';
import {
  MembersTabs,
  MembersTabsProps,
} from '../../components/Members/MembersTabs';

type MembersGroup = Record<
  string,
  {
    [groupName: string]: MembersTabsProps;
  }
>;

const groupMemberFn = (
  groupMap: MembersGroup,
  groupKeys: string[],
  groupItem: Member,
  insertFn?: Function,
) => {
  if (!groupKeys?.length) return;
  isFunction(insertFn) && insertFn();
  groupKeys.forEach((key: string) =>
    ((groupMap[key] = groupMap[key] || { list: [] }).list as Member[]).push(
      groupItem,
    ),
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
    let membersGroup: any = {
      理事会: { list: [] },
      顾问委员会: { list: [] },
      法律咨询委员会: { list: [] },
      执行委员会: { list: [] },
      项目委员会: { list: [], tabs: {} },
    };

    list.forEach((member: Member) => {
      //Classify the organization of kaiyuanshe | 一级部门分组 👇
      groupMemberFn(membersGroup, member.organization as string[], member);

      //Classify the department of kaiyuanshe | 工作组分组 👇
      groupMemberFn(membersGroup, member.department as string[], member);

      //Classify the projectKey of kaiyuanshe | 项目分组(特殊处理追加到项目委员会)👇
      groupMemberFn(
        membersGroup[projectKey].tabs,
        member.project as string[],
        member,
        () => {
          membersGroup[projectKey].list.push(member);
        },
      );

      //Classify the OtherMember of kaiyuanshe | 其他未分组用户 👇
      !member.organization &&
        !member.department &&
        !member.project &&
        otherMembersList.push(member);
    });
    //Duplicate removal of projectKey | 项目委员会去重👇
    membersGroup[projectKey].list = [...new Set(membersGroup[projectKey].list)];

    // Updata
    this.membersGroup = membersGroup;
    this.otherMembersList = otherMembersList;

    //Image lazy loading | 懒加载函数👇
    LazyLoad();
  }
  render() {
    const { downloading } = membersStore;
    const { membersGroup, otherMembersList } = this;

    return (
      <Container className="my-4">
        {downloading > 0 && <Loading />}
        <PageHead title="组织成员" />

        <h1 className="w-100 my-5 text-center">组织成员</h1>
        {membersGroup &&
          Object.keys(membersGroup).map((groupName: string) => (
            <div key={groupName}>
              <MembersTitle
                title={groupName}
                count={(membersGroup[groupName].list as Member[])?.length}
              />
              {membersGroup[groupName].tabs ? (
                <MembersTabs {...membersGroup[groupName]}></MembersTabs>
              ) : (
                <MembersList
                  list={membersGroup[groupName]?.list as Member[]}
                ></MembersList>
              )}
            </div>
          ))}
        {otherMembersList.length > 0 && (
          <>
            <MembersTitle count={otherMembersList?.length} />
            <MembersList list={otherMembersList} />
          </>
        )}
      </Container>
    );
  }
}
