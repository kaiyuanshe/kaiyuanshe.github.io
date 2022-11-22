import { observer } from 'mobx-react';
import { FC } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ScrollList, ScrollListProps } from '../ScrollList';
import { ActivityCard } from './Card';
import activityStore from '../../models/Activity';
import type { Activity } from '../../pages/api/activity';

export type ActivityListProps = ScrollListProps<Activity>;

export const ActivityListLayout: FC<{ data: Activity[] }> = ({ data }) => (
  <Row as="section" xs={1} sm={2} xl={3} xxl={4} className="g-3 my-4">
    {data.map(item => (
      <Col key={item.id + ''}>
        <ActivityCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);

@observer
export class ActivityList extends ScrollList<ActivityListProps> {
  store = activityStore;

  renderList() {
    return <ActivityListLayout data={this.store.allItems} />;
  }
}
