import { FC } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ActivityCard } from './Card';
import { Activity } from '../../models/Activity';

export const ActivityListLayout: FC<{ defaultData: Activity[] }> = ({
  defaultData,
}) => (
  <Row as="section" xs={1} sm={2} xl={3} className="g-3 my-4">
    {defaultData.map(item => (
      <Col key={item.id + ''}>
        <ActivityCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);
