import classNames from 'classnames';
import { text2color } from 'idea-react';
import { FC } from 'react';
import { Badge, Image } from 'react-bootstrap';

import { Department } from '../../models/Group';
import { fileURLOf } from '../../pages/api/lark/file/[id]';

export interface GroupCardProps
  extends Pick<Department, 'name' | 'logo' | 'tags' | 'summary'> {
  className?: string;
}

export const GroupCard: FC<GroupCardProps> = ({
  className,
  name,
  logo,
  tags,
  summary,
}) => (
  <div
    className={classNames('d-flex flex-column align-items-center', className)}
  >
    <h3 className="h5 mb-3 flex-fill">{name}</h3>
    {logo && (
      <Image
        className="mb-3 flex-fill object-fit-contain"
        style={{ maxWidth: '10rem' }}
        src={fileURLOf(logo)}
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
      className="mt-3 mb-0 text-wrap overflow-auto"
      style={{ maxWidth: '50vw', maxHeight: '10rem' }}
    >
      {summary}
    </p>
  </div>
);
