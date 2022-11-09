import { FC } from 'react';
import { Badge } from 'react-bootstrap';

export interface MembersTitleProps {
  title?: string;
  count?: number;
}

export const MembersTitle: FC<MembersTitleProps> = ({
  title = '未分组',
  count = 0,
}) => (
  <h2 className="position-relative border-bottom border-2 border-info lh-lg mb-4">
    {title}
    <Badge
      className="position-absolute translate-middle top-0 mt-2 ms-2 fw-normal fs-6 rounded-pill"
      bg="info"
    >
      {count}
    </Badge>
  </h2>
);
