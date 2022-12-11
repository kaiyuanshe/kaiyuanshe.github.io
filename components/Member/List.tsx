import { observer } from 'mobx-react';
import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';

import { LazyImage } from '../LazyImage';
import styles from '../../styles/Members.module.less';
import { withTranslation } from '../../pages/api/base';
import { i18n } from '../../models/Translation';
import { Member } from '../../models/Member';

export const getServerSideProps = withTranslation();

export interface MemberListProps {
  list?: Member[];
}

export const MemberList: FC<MemberListProps> = observer(({ list = [] }) => {
  const { t } = i18n;
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
      {list.map(({ GitHubID, name, nickname }, idx) => (
        <Col
          key={idx}
          className={`d-inline-block position-relative w-auto ${styles.member}`}
          title={'' + (nickname || name || GitHubID || t('member_x'))}
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
                data-text={nickname || name || t('member_x')}
              >
                <i className="d-inline-block fst-normal overflow-hidden">
                  {name || nickname || t('unpublished')}
                </i>
              </span>
            </a>
          </h3>
        </Col>
      ))}
    </Row>
  );
});
