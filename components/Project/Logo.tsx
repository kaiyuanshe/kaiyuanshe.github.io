import * as Mobx from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Image } from 'react-bootstrap';

export interface GitLogoProps {
  name: string;
}

@observer
export class GitLogo extends PureComponent<GitLogoProps> {
  constructor(props: GitLogoProps) {
    super(props);
    Mobx.makeObservable?.(this);
  }

  @Mobx.observable
  path = '';

  async compentDidMount() {
    const { name } = this.props;
    const topic = name.toLowerCase();

    try {
      const { src } = await this.loadImage(
        `https://raw.githubusercontent.com/github/explore/master/topics/${topic}/${topic}.png`,
      );
      this.path = src;
    } catch (e) {
      const { src } = await this.loadImage(`https://github.com/${name}.png`);
      this.path = src;
    }
  }

  loadImage(path: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new globalThis.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = path;
    });
  }

  render() {
    const { path } = this;
    const { name } = this.props;

    return path && <Image fluid src={path} alt={name} />;
  }
}
