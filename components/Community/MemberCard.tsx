import type { FC } from 'react';
import { Card } from 'react-bootstrap';

import { CommunityMember } from '../../models/Community/CommunityMember';
import { LarkImage } from '../LarkImage';

export const CommunityMemberCard: FC<CommunityMember> = ({
  avatar,
  name,
  summary,
}) => (
  <Card className="border-0 align-items-center position-relative">
    <LarkImage
      className="card-img-top rounded-circle object-fit-cover"
      style={{ width: '10rem', height: '10rem' }}
      src={avatar}
      alt={name + ''}
    />
    <Card.Body>
      <Card.Title
        as="a"
        className="fs-6 text-decoration-none stretched-link"
        href={`/member/${name}`}
      >
        {name}
      </Card.Title>
      <Card.Text className="fw-light mt-2">{summary}</Card.Text>
    </Card.Body>
  </Card>
);
