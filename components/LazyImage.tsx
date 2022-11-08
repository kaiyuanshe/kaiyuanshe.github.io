import { PureComponent } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

export interface LazyImageProps extends ImageProps {
  preLazySrc?: string; //👈 懒加载前的占位图src
  errorSrc?: string; //👈 懒加载图片加载失败替换图src
}

export class LazyImage extends PureComponent<LazyImageProps> {
  LazyImageRef: HTMLImageElement | undefined;

  componentDidMount() {
    const lazyImage = this.LazyImageRef as Element;
    const observer = new IntersectionObserver((entries: any) => {
      entries[0].isIntersecting &&
        (lazyImage.setAttribute('src', '' + this.props.src),
        observer.unobserve(lazyImage));
    });
    observer.observe(lazyImage);
  }

  render() {
    const {
      preLazySrc = '/kaiyuanshe.png',
      errorSrc = '/kaiyuanshe.png',
      alt,
    } = this.props;
    return (
      <Image
        ref={(element: HTMLImageElement) => (this.LazyImageRef = element)}
        {...this.props}
        src={preLazySrc}
        alt={alt}
        onError={({ currentTarget }) => (currentTarget.src = errorSrc)}
      />
    );
  }
}
