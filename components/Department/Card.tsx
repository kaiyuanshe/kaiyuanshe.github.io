import classNames from 'classnames';
import { text2color } from 'idea-react';
import { FC } from 'react';
import { Badge } from 'react-bootstrap';

import { Department } from '../../models/Personnel/Department';
import { LarkImage } from '../Base/LarkImage';

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
    <h3 className="h5 mb-3 flex-fill">{name}</h3>
    {logo && (
      <LarkImage
        className="mb-3 flex-fill object-fit-contain"
        style={{ maxWidth: '10rem' }}
        src={logo}
        alt={name as string}
      />
    )}
    <nav>
      {(tags as string[])?.map(tag => (
        <Badge
          as="a"
          key={tag}
          className="text-decoration-none mx-1"
          bg={text2color(tag, ['light'])}
          href={`/search?tag=${tag}`}
        >
          {tag}
        </Badge>
      ))}
    </nav>
    <p
      className="mt-3 mb-0 text-wrap text-start overflow-auto"
      style={{ maxWidth: '50vw', maxHeight: '10rem' }}
    >
      {summary}
    </p>
    {email && (
      <dl className="mt-1 d-flex align-items-start">
        <dt className="me-1">E-mail:</dt>
        <dd>
          <a href={email + ''}>{(email + '')?.split(':')[1]}</a>
        </dd>
      </dl>
    )}
  </div>
);
