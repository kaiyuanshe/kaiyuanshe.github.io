import { Base, Media } from '../base';
import { User } from '../user';
import { Tag } from '../tag';

export interface Article extends Base {
  title: string;
  summary?: string;
  content: string;
  license?: string;
  author?: User;
  tags?: Tag[];
  files?: Media[];
  link?: string;
  image?: Media;
}
