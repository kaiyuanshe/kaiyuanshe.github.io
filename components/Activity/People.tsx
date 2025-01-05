import { AvatarProps } from 'idea-react';
import { TableCellAttachment, TableCellMedia, TableCellValue } from 'mobx-lark';
import { FC } from 'react';

import { LarkImage } from '../Base/LarkImage';

type TableCellFile = TableCellMedia | TableCellAttachment;

export interface ActivityPeopleProps
  extends Pick<AvatarProps, 'size'>,
    Partial<
      Record<'names' | 'positions' | 'summaries' | 'organizations', string[]>
    > {
  avatars?: TableCellValue;
}

export const ActivityPeople: FC<ActivityPeopleProps> = ({
  size = 3,
  names,
  avatars,
  positions,
  organizations,
  summaries,
}) => (
  <ul className="list-unstyled d-flex align-items-center justify-content-around gap-3 flex-wrap">
    {(avatars as TableCellFile[])?.map((avatar, index) => (
      <li
        key={
          'file_token' in avatar ? avatar.file_token : avatar.attachmentToken
        }
        className="text-center"
      >
        <LarkImage
          className="object-fit-cover"
          style={{ width: `${size}rem`, height: `${size}rem` }}
          loading="lazy"
          src={avatar}
          alt={names?.[index]}
          roundedCircle
        />
        <ul className="list-unstyled">
          <li>{names?.[index]}</li>
          <li>{organizations?.[index]}</li>
          <li>{positions?.[index]}</li>
          <li>{summaries?.[index]}</li>
        </ul>
      </li>
    ))}
  </ul>
);
