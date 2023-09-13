import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { CommunityMember } from '../../models/Community/CommunityMember';
import { CommunityMemberCard } from './MemberCard';

export const CommunityMemberList: FC<{ defaultData: CommunityMember[] }> = ({
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
