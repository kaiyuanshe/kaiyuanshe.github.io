import type { PropsWithoutRef } from 'react';
import { Badge } from 'react-bootstrap';

export type MembersTitleProps = PropsWithoutRef<{
  title?: string;
  count?: number;
}>;

export default function MembersTitle({
  title = '未分组',
  count = 0,
}: MembersTitleProps) {
  return (
    <h2 className="position-relative border-bottom border-2 border-info lh-lg mb-4 ">
      {title}&nbsp;
      <Badge
        className="position-absolute translate-middle top-0 mt-2 fw-normal fs-6 rounded-pill"
        bg="info"
      >
        {count}
      </Badge>
    </h2>
  );
}
