import { FC } from 'react';
import { Badge } from 'react-bootstrap';
import classNames from 'classnames';

import styles from '../../styles/Members.module.less';
import { i18n } from '../../models/Translation';

export interface MemberTitleProps {
  title?: string;
  count?: number;
}

export const MemberTitle: FC<MemberTitleProps> = ({
  title = i18n.t('unclassified'),
  count = 0,
}) => (
  <h2
    id={title}
    className={classNames(
      'position-relative border-bottom border-2 border-info lh-lg mb-4',
      styles.memberTitle,
    )}
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
