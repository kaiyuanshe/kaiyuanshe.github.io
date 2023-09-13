import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Community } from '../../models/Community';
import { CommunityCard } from './Card';

export const CommunityListLayout: FC<{ defaultData: Community[] }> = ({
  defaultData,
}) => (
  <Row as="section" xs={1} sm={2} xl={5} className="g-3 my-4">
    {defaultData.map(item => (
      <Col key={item.name + ''}>
        <CommunityCard {...item} />
      </Col>
    ))}
  </Row>
);
