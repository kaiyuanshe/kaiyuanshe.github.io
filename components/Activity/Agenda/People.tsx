import { Avatar } from 'idea-react';
import { FC } from 'react';

export type AgendaPeopleProps = Record<
  'names' | 'avatars' | 'positions' | 'summaries',
  string[]
>;

export const AgendaPeople: FC<AgendaPeopleProps> = ({
  names,
  avatars,
  positions,
  summaries,
}) => (
  <ul className="list-inline">
    {names.map((name, index) => (
      <li key={name} className="list-inline-item text-center">
        <Avatar src={avatars[index]} />

        <ul className="list-unstyled">
          <li>{name}</li>
          <li>{positions[index]}</li>
          <li>{summaries[index]}</li>
        </ul>
      </li>
    ))}
  </ul>
);
