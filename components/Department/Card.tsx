import classNames from 'classnames';
import { FC } from 'react';

import { Department } from '../../models/Personnel/Department';
import { LarkImage } from '../Base/LarkImage';
import { TagNav } from '../Base/TagNav';

export interface GroupCardProps
  extends Pick<Department, 'name' | 'logo' | 'tags' | 'summary' | 'email'> {
  className?: string;
}

export const GroupCard: FC<GroupCardProps> = ({
  className,
  name,
  logo,
  tags,
  summary,
  email,
}) => (
  <div
    className={classNames('d-flex flex-column align-items-center', className)}
  >
    <h3 className="h5 mb-3 flex-fill">
      <a
        className="text-decoration-none text-dark"
        href={`/department/${name}`}
      >
        {name as string}
      </a>
    </h3>

    {logo && (
      <LarkImage
        className="mb-3 flex-fill object-fit-contain"
        style={{ maxWidth: '10rem' }}
        src={logo}
        alt={name as string}
      />
    )}
    {tags && <TagNav model="department" list={tags as string[]} />}

    {email && (
      <dl className="mt-1 d-flex align-items-start">
        <dt className="me-1">E-mail:</dt>
        <dd>
          <a href={`mailto:${email}`}>{email as string}</a>
        </dd>
      </dl>
    )}
    <p
      className="mt-3 mb-0 text-wrap text-start overflow-auto"
      style={{ maxWidth: '50vw', maxHeight: '10rem' }}
    >
      {summary as string}
    </p>
  </div>
);
