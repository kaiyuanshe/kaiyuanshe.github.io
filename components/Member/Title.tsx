import { FC, HTMLAttributes } from 'react';
import { Badge } from 'react-bootstrap';

import { i18n } from '../../models/Translation';
import styles from './Title.module.less';

export interface MemberTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  count?: number;
}

export const MemberTitle: FC<MemberTitleProps> = ({
  className = '',
  title = i18n.t('unclassified'),
  count = 0,
  ...props
}) => (
  <h2
    id={title}
    className={`position-relative border-bottom border-2 border-info lh-lg mb-4 ${styles.memberTitle} ${className}`}
    {...props}
  >
    {title}
    <Badge
      className="position-absolute translate-middle top-4 mt-2 ms-2 fw-normal fs-6 rounded-pill"
      bg="info"
    >
      {count}
    </Badge>
  </h2>
);
