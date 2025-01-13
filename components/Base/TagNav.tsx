import { text2color } from 'idea-react';
import { FC, HTMLAttributes } from 'react';
import { Badge } from 'react-bootstrap';

export interface TagNavProps extends HTMLAttributes<HTMLElement> {
  linkOf?: (value: string) => string;
  list: string[];
  onCheck?: (value: string) => any;
}

export const TagNav: FC<TagNavProps> = ({
  className = '',
  list,
  linkOf,
  onCheck,
  ...props
}) => (
  <nav className={`d-flex flex-wrap gap-2 ${className}`} {...props}>
    {list.map(tag => (
      <Badge
        key={tag + ''}
        as="a"
        className={`text-decoration-none ${onCheck ? 'cursor-pointer' : ''}`}
        bg={text2color(tag + '', ['light'])}
        href={linkOf?.(tag)}
        onClick={onCheck && (() => onCheck(tag))}
      >
        {tag + ''}
      </Badge>
    ))}
  </nav>
);
