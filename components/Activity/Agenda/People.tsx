import { AvatarProps } from 'idea-react';
import { FC } from 'react';

export type AgendaPeopleProps = Pick<AvatarProps, 'size'> &
  Record<'names' | 'avatars' | 'positions' | 'summaries', string[]>;

export const AgendaPeople: FC<AgendaPeopleProps> = ({
  size = 3,
  names,
  avatars,
  positions,
  summaries,
}) => (
  <ul className="list-unstyled d-flex align-items-center justify-content-around">
    {names?.map((name, index) => (
      <li key={name} className="text-center">
        <span
          role="img"
          className="d-inline-block rounded-circle"
          style={{
            width: `${size}rem`,
            height: `${size}rem`,
            background: avatars && `url(${avatars[index]}) center no-repeat`,
            backgroundSize: 'cover',
          }}
        />
        <ul className="list-unstyled">
          <li>{name}</li>
          <li>{positions && positions[index]}</li>
          <li>{summaries && summaries[index]}</li>
        </ul>
      </li>
    ))}
  </ul>
);
