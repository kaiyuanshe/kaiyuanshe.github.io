import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { Member } from '../../models/Member';
import { MemberCard } from './Card';
import styles from './List.module.less';

export interface MemberListProps {
  list?: Member[];
}

export const MemberList: FC<MemberListProps> = ({ list = [] }) => {
  const [isMore, setIsMore] = useState(false);

  useEffect(() => {
    //Judgment exceeds 3 lines
    if (list?.length > 3 * Math.floor(globalThis.innerWidth / 120))
      setIsMore(true);
  }, [list?.length, setIsMore]);

  return (
    <Row
      className={classNames(
        'd-flex g-auto text-center mb-2 pt-2 overflow-auto',
        isMore && styles.isMore,
        styles.memberRow,
      )}
    >
      {list.map(member => (
        <Col key={member.id as string}>
          <MemberCard {...member} />
        </Col>
      ))}
    </Row>
  );
};
