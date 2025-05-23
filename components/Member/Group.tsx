import 'array-unique-proposal';

import { observer } from 'mobx-react';
import { FC, useContext } from 'react';
import { TimeData } from 'web-utility';

import { I18nContext } from '../../models/Base/Translation';
import { Personnel } from '../../models/Personnel';
import { MemberCard } from './Card';
import { MemberTitle } from './Title';

export interface MemberGroupProps {
  name: string;
  list: Personnel[];
}

export const MemberGroup: FC<MemberGroupProps> = observer(({ name, list }) => {
  const { t } = useContext(I18nContext);

  list = list.uniqueBy(({ recipient }) => recipient + '');

  return (
    <section id={name}>
      <MemberTitle className="my-5" title={name || t('unclassified')} count={list.length} />
      <ul className="list-unstyled d-flex flex-wrap gap-3">
        {list.map(({ id, createdAt, position, recipient, recipientAvatar }) => (
          <li
            key={id as string}
            className="d-flex flex-column align-items-center gap-2 position-relative"
          >
            <MemberCard
              name={recipient + ''}
              nickname={`${position}${
                (position as string).includes('组长')
                  ? `(${new Date(createdAt as TimeData).getFullYear()})`
                  : ''
              }`}
              avatar={recipientAvatar}
            />
          </li>
        ))}
      </ul>
    </section>
  );
});
