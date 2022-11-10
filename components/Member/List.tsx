import { FC } from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';

import { Member } from '../../models/Member';
import { LazyImage } from '../LazyImage';
import styles from '../../styles/Members.module.less';

export interface MemberListProps {
  list?: Member[];
}

export const MemberList: FC<MemberListProps> = ({ list = [] }) => {
  //Judgment exceeds 3 lines
  const isMore = list?.length > 3 * Math.floor(window.innerWidth / 120);

  return (
    <Row
      className={classNames(
        'd-flex g-auto text-center mb-2 pt-2 overflow-auto',
        isMore && styles.isMore,
        styles.memberRow,
      )}
    >
      {list.map(({ GitHubID, name, nickname }, idx) => (
        <Col
          key={idx}
          className={`d-inline-block position-relative w-auto ${styles.member}`}
          title={'' + (nickname || name || GitHubID || '成员X')}
        >
          <LazyImage
            className={`d-inlink-block overflow-hidden rounded-circle position-relative ${styles.avatar}`}
            src={`https://github.com/${GitHubID}.png`}
            alt={'' + GitHubID}
          />
          <h3 className="h4 my-3">
            <a
              className="fs-6 stretched-link"
              {...(GitHubID
                ? {
                    rel: 'noreferrer',
                    target: '_blank',
                    href: `https://github.com/${GitHubID}`,
                  }
                : {})}
            >
              <span
                className={`d-inline-block position-relative text-truncate ${styles.btn_tamaya}`}
                data-text={nickname || name || '成员X'}
              >
                <i className="d-inline-block fst-normal overflow-hidden">
                  {name || nickname || '未公开'}
                </i>
              </span>
            </a>
          </h3>
        </Col>
      ))}
    </Row>
  );
};
