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
import { Container, Table} from 'react-bootstrap';

import PageHead from '../../../components/PageHead';
import { i18n } from '../../../models//Base/Translation';
import { ActivityModel } from '../../../models/Activity';
import { Staff, StaffModel } from '../../../models/Activity/Staff';

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
    this.list = this.activityStore.currentStaff?.getList({});
    console.log('this.personStroe', this.staffStore);
  }

  render() {
    const { activityStore, list } = this;
    console.log('personStore', list);
    const loading = activityStore?.downloading || list?.downloading || 0;
    const { name = '' } = activityStore?.currentOne || {};

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead title={'志愿者' + '-' + name} />
        <h1 className="mt-4 mb-4">{name + ' ' + '志愿者'}</h1>
        {loading > 0 && <Loading />}

        {list && (
          <Table striped bordered hover>
             <thead>
             <tr>
                <th></th>
                <th>姓名</th>
                <th>志愿者类型</th>
              </tr>
              </thead>  
              <tbody>
                {

                }
              </tbody>

          </Table>
        )}
      </Container>
    );
  }
}
