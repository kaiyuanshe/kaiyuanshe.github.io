import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Person } from '../../models/Personnel/Person';
import { CommunityMemberCard } from './MemberCard';

export const CommunityMemberList: FC<{ defaultData: Person[] }> = ({
  defaultData,
}) => (
  <Row as="section" xs={1} sm={2} xl={5} className="g-3 my-4">
    {defaultData.map(item => (
      <Col key={item.name + ''}>
        <CommunityMemberCard {...item} />
      </Col>
    ))}
    {defaultData.map(item => (
      <Col key={item.name + ''}>
        <CommunityMemberCard {...item} />
      </Col>
    ))}
    {defaultData.map(item => (
      <Col key={item.name + ''}>
        <CommunityMemberCard {...item} />
      </Col>
    ))}
  </Row>
);
