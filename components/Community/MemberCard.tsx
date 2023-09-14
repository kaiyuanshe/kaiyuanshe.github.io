import type { FC } from 'react';
import { Card } from 'react-bootstrap';

import { CommunityMember } from '../../models/Community/CommunityMember';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

export const CommunityMemberCard: FC<CommunityMember> = ({
  avatar,
  name,
  summary,
}) => (
  <Card className="border-0 align-items-center position-relative">
    <Card.Img
      className="rounded-circle object-fit-cover"
      style={{ width: '10rem', height: '10rem' }}
      variant="top"
      src={fileURLOf(avatar)}
      alt={name + ''}
    />
    <Card.Body>
      <Card.Title className="fs-6 stretched-link">{name}</Card.Title>
      <Card.Subtitle className="fw-light mt-2">{summary}</Card.Subtitle>
    </Card.Body>
  </Card>
);
