import { text2color } from 'idea-react';
import { FC, HTMLAttributes } from 'react';
import { Badge } from 'react-bootstrap';

export interface TagNavProps extends HTMLAttributes<HTMLElement> {
  list: string[];
}

export const TagNav: FC<TagNavProps> = ({ list, ...props }) => (
  <nav {...props}>
    {list.map(tag => (
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
);
