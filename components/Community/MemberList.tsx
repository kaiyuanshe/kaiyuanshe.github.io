import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { CommunityMember } from '../../models/Community/CommunityMember';
import { CommunityMemberCard } from './MemberCard';

export const CommunityMemberList: FC<{ list: CommunityMember[] }> = ({
  list,
}) => (
  <Row
    as="section"
    className="justify-content-center text-center"
    xs={1}
    sm={3}
    xl={5}
  >
    {list.map(item => (
      <Col key={item.name + ''} className="my-3">
        <CommunityMemberCard {...item} />
      </Col>
    ))}
  </Row>
);
