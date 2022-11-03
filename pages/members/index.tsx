import { observer } from 'mobx-react';
import { PropsWithoutRef, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { Loading } from 'idea-react';

import PageHead from '../../components/PageHead';
import membersStore, { Member } from '../../models/Members';
import { LazyLoad } from '../../utils/layzload';
import MembersTitle from '../../components/Members/MembersTitle';
import MembersList from '../../components/Members/MembersList';
import MembersTabs, {
  MembersTabsProps,
} from '../../components/Members/MembersTabs';

type MembersGroup = PropsWithoutRef<{
  [proppName: string]: MembersTabsProps;
}>;

@observer
export default class MembersPage extends PureComponent {
  state: Readonly<{ membersGroup: MembersGroup; otherMembersList: Member[] }> =
    {
      membersGroup: {},
      otherMembersList: [],
    };

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
      //Classify the organization of kaiyuanshe 👇
      member.organization &&
        (member.organization as Array<string>).forEach((org: string) => {
          membersGroup[org]
            ? membersGroup[org].list.push(member)
            : (membersGroup[org] = { list: [member] });
        });

      //Classify the department of kaiyuanshe 👇
      member.department &&
        (member.department as Array<string>).forEach((dep: string) => {
          membersGroup[dep]
            ? membersGroup[dep].list.push(member)
            : (membersGroup[dep] = { list: [member] });
        });

      //Classify the projectKey of kaiyuanshe 👇
      member.project &&
        (member.project as Array<string>).forEach((pro: string) => {
          membersGroup[projectKey]?.tabs[pro]
            ? membersGroup[projectKey].tabs[pro].list.push(member)
            : (membersGroup[projectKey].tabs[pro] = { list: [member] });
          //Update membersGroup[projectKey] list
          !membersGroup[projectKey].list.includes(member) &&
            membersGroup[projectKey].list.push(member);
        });

      //Classify the OtherMember of kaiyuanshe 👇
      !member.organization &&
        !member.department &&
        !member.project &&
        otherMembersList.push(member);
    });

    this.setState({
      membersGroup,
      otherMembersList,
    });

    //Image lazy loading 👇
    LazyLoad();
  }
  render() {
    const { downloading } = membersStore;
    const { membersGroup, otherMembersList } = this.state;

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
                count={membersGroup[groupName]?.list?.length}
              />
              {membersGroup[groupName].tabs ? (
                <MembersTabs {...membersGroup[groupName]}></MembersTabs>
              ) : (
                <MembersList list={membersGroup[groupName]?.list}></MembersList>
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
