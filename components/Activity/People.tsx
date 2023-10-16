import { AvatarProps } from 'idea-react';
import { FC } from 'react';

import { DefaultImage } from '../../pages/api/lark/file/[id]';

export type ActivityPeopleProps = Pick<AvatarProps, 'size'> &
  Partial<Record<'names' | 'avatars' | 'positions' | 'summaries', string[]>>;

export const ActivityPeople: FC<ActivityPeopleProps> = ({
  size = 3,
  names,
  avatars,
  positions,
  summaries,
}) => (
  <ul className="list-unstyled d-flex align-items-center justify-content-around gap-3">
    {names?.map((name, index) => (
      <li key={name} className="text-center">
        <span
          role="img"
          className="d-inline-block rounded-circle"
          style={{
            width: `${size}rem`,
            height: `${size}rem`,
            background: `url(${
              avatars?.[index] || DefaultImage
            }) center no-repeat`,
            backgroundSize: 'cover',
          }}
        />

        <ul className="list-unstyled">
          <li>{name}</li>
          <li>{positions?.[index]}</li>
          <li>{summaries?.[index]}</li>
        </ul>
      </li>
    ))}
  </ul>
);
