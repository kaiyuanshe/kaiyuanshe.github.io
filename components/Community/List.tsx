import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Community } from '../../models/Community';
import { CommunityCard } from './Card';

export const CommunityListLayout: FC<{ defaultData: Community[] }> = ({
  defaultData,
}) => (
  <Row as="section" xs={1} sm={2} xl={3} className="g-3 my-4">
    {console.log(defaultData)}
    {defaultData.map(item => (
      <Col key={item.name + ''}>
        <CommunityCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);
