import { FC } from 'react';
import { Row, Col, Image } from 'react-bootstrap';

import { Member } from '../../models/Members';
import styles from '../../styles/Members.module.less';

export interface MembersListProps {
  list?: Member[];
}

export const MembersList: FC<MembersListProps> = ({ list = [] }) => {
  //Judgment exceeds 3 lines
  const isMore = list?.length > 3 * Math.floor(window.innerWidth / 120);
  return (
    <Row
      className={`d-flex g-auto text-center mb-2 pt-2 overflow-auto ${
        isMore ? styles.isMore : ''
      } ${styles.memberRow}`}
    >
      {list.map(({ GitHubID, name, nickname }, idx) => (
        <Col
          key={idx}
          className={`d-inline-block position-relative w-auto ${styles.member}`}
          title={'' + (nickname || name || GitHubID || '成员X')}
        >
          <Image
            className={`d-inlink-block overflow-hidden rounded-circle position-relative ${styles.avatar}`}
            src="/kaiyuanshe.png"
            data-src={
              GitHubID
                ? new URL('' + GitHubID, 'https://github.com') + '.png'
                : '/kaiyuanshe.png'
            }
            alt={'' + GitHubID}
            onError={({ currentTarget }) =>
              (currentTarget.src = '/kaiyuanshe.png')
            }
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
