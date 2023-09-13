import type { FC } from 'react';
import { Card } from 'react-bootstrap';

import { CommunityMember } from '../../models/Community/CommunityMember';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

export const CommunityMemberCard: FC<CommunityMember> = ({
  name,
  avatar,
}: CommunityMember) => (
  <Card className="border-0 align-items-center position-relative">
    <Card.Img
      style={{ width: '8rem' }}
      variant="top"
      src={fileURLOf(avatar)}
      alt={name + ''}
    />
    <Card.Body>
      <Card.Title as="a" className="fs-6 stretched-link" href={'/#'}>
        {name}
      </Card.Title>
    </Card.Body>
  </Card>
);
