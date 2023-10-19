import { AvatarProps } from 'idea-react';
import { FC } from 'react';

import { LarkImage } from '../Base/LarkImage';

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
        <LarkImage
          roundedCircle
          className="object-fit-cover"
          style={{ width: `${size}rem`, height: `${size}rem` }}
          loading="lazy"
          src={avatars?.[index]}
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
