import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Community } from '../../models/Community';
import { CommunityCard } from './CommunityCard';

export const CommunityListLayout: FC<{ list: Community[] }> = ({ list }) => (
  <Row as="section" xs={1} sm={2} xl={5} className="g-3 my-4">
    {list.map(item => (
      <Col key={item.name + ''}>
        <CommunityCard {...item} />
      </Col>
    ))}
  </Row>
);
