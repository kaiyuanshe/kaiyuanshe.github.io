import { PropsWithoutRef, useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';

import { Member } from '../../models/Members';
import styles from '../../styles/Members.module.less';

export type MembersListProps = PropsWithoutRef<{
  list?: Member[];
}>;

export default function MembersList({ list = [] }: MembersListProps) {
  //Judgment exceeds 3 lines
  const isMore = list?.length > 3 * Math.floor(window.innerWidth / 120);
  return (
    <Row
      className={`d-flex g-auto text-center mb-4 overflow-auto ${styles.memberRow}`}
      data-is-more={isMore}
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
            onError={(e: any) => {
              e.target.src = '/kaiyuanshe.png';
              e.target.setAttribute('imgErr', true);
            }}
          />
          <h3 className="h4 my-3">
            <a
              className="fs-6 stretched-link"
              {...(GitHubID
                ? {
                    rel: 'noreferrer',
                    target: '_blank',
                    href: '' + new URL('' + GitHubID, 'https://github.com'),
                  }
                : {})}
            >
              <span
                className={`d-block position-relative  text-truncate ${styles.btn_ta}`}
                data-text={nickname || name || '成员X'}
              >
                <i className="d-block fst-normal overflow-hidden">
                  {name || nickname || '未公开'}
                </i>
              </span>
            </a>
          </h3>
        </Col>
      ))}
    </Row>
  );
}
