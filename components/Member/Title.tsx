import { FC } from 'react';
import { Badge } from 'react-bootstrap';

import { i18n } from '../../models/Translation';

export interface MemberTitleProps {
  title?: string;
  count?: number;
}

export const MemberTitle: FC<MemberTitleProps> = ({
  title = i18n.t('unclassified'),
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
