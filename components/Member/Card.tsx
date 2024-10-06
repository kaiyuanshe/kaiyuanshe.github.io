import { observer } from 'mobx-react';
import { FC } from 'react';

import { t } from '../../models/Base/Translation';
import { LarkImage } from '../Base/LarkImage';
import styles from './Card.module.less';

export type MemberCard = Partial<
  Record<'name' | 'nickname' | 'avatar', string>
>;

export const MemberCard: FC<MemberCard> = observer(
  ({ name, nickname, avatar }) => (
    <div
      className={`d-inline-block position-relative w-auto text-center ${styles.member}`}
      title={'' + (name || nickname || t('member_x'))}
    >
      <LarkImage
        className={`d-inlink-block overflow-hidden rounded-circle position-relative ${styles.avatar}`}
        src={avatar!}
      />
      <h3 className="h4 my-3">
        <a
          className="fs-6 stretched-link"
          href={`/member/${name}`}
          rel="noreferrer"
        >
          <span
            className={`d-inline-block position-relative text-truncate ${styles.btn_tamaya}`}
            data-text={name || nickname || t('member_x')}
          >
            <i className="d-inline-block fst-normal overflow-hidden">
              {nickname || name || t('unpublished')}
            </i>
          </span>
        </a>
      </h3>
    </div>
  ),
);
