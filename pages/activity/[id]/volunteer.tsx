import { Loading } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import { MemberCard } from '../../../components/Member/Card';
import { MemberTitle } from '../../../components/Member/Title';
import PageHead from '../../../components/PageHead';
import { i18n } from '../../../models//Base/Translation';
import { ActivityModel } from '../../../models/Activity';
import { Staff, StaffModel } from '../../../models/Activity/Staff';
import { fileURLOf } from '../../api/lark/file/[id]';

type VolunteerDetailPageProps = RouteProps<{ id: string }>;

export const getServerSideProps = compose<
  { id: string },
  VolunteerDetailPageProps
>(router, errorLogger, translator(i18n));

const { t } = i18n;

@observer
export default class VolunteerPage extends PureComponent<VolunteerDetailPageProps> {
  constructor(props: VolunteerDetailPageProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  activityStore?: ActivityModel = undefined;

  @observable
  staffStore?: StaffModel = undefined;

  async componentDidMount() {
    const { id } = this.props.route.params!;
    this.activityStore = new ActivityModel();
    await this.activityStore.getOne(id);
    this.activityStore.currentStaff?.getAll();
  }
  renderVolunteers = ({ id, name }: Staff) => (
    <li
      key={id as string}
      className="d-flex flex-column align-items-center gap-2 position-relative"
    >
      <MemberCard name={name + ''} nickname={''} avatar={fileURLOf('')} />
    </li>
  );

  render() {
    const { activityStore } = this;
    const list = activityStore?.currentStaff?.allItems.filter(
      item => item.role?.includes('志愿者'),
    );
    const loading = activityStore?.downloading || 0;
    const { name = '' } = activityStore?.currentOne || {};

    return (
      <Container className="py-5">
        <PageHead title={'志愿者' + '-' + name} />
        <h1 className="text-center">{name + ' ' + '志愿者'}</h1>
        {loading > 0 && <Loading />}

        <section>
          <MemberTitle className="my-5" title="志愿者" count={list?.length} />
          <ul className="list-unstyled d-flex flex-wrap grap-3">
            {list?.map(this.renderVolunteers)}
          </ul>
        </section>
      </Container>
    );
  }
}
