import { observer } from 'mobx-react';
import { FC } from 'react';

import { Member } from '../../models/Member';
import { i18n } from '../../models/Translation';
import { LazyImage } from '../LazyImage';
import styles from './Card.module.less';

const { t } = i18n;

export type MemberCard = Partial<
  Pick<Member, 'name' | 'nickname' | 'GitHubID'>
>;

export const MemberCard: FC<MemberCard> = observer(
  ({ name, nickname, GitHubID }) => (
    <div
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
          target="_blank"
          href={`/person/${name}`} rel="noreferrer"
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
    </div>
  ),
);
