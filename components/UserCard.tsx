import type { PropsWithoutRef } from 'react';
import { Avatar } from 'idea-react';

import { GenderName, User } from '../pages/api/user';

const Host = process.env.NEXT_PUBLIC_API_HOST;

export type UserCardProps = PropsWithoutRef<{ className?: string } & User>;

export default function UserCard({
  className = '',
  id,
  username,
  gender,
  address,
  avatar,
  summary,
}: UserCardProps) {
  return (
    <a
      className={`d-block shadow p-4 text-center ${className}`}
      href={`/user/${id}`}
    >
      <Avatar
        size={4}
        src={avatar ? new URL(avatar.url, Host) + '' : '/typescript.png'}
      />
      <h3 className="h4 my-3">{username}</h3>

      <small className="text-muted">
        {GenderName[gender!]} {gender && address && '/'} {address?.country}{' '}
        {address?.province} {address?.city}
      </small>
      {summary && <p className="small mt-3">{summary}</p>}
    </a>
  );
}
