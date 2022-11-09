import { PureComponent } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

export interface LazyImageProps extends ImageProps {
  preLazySrc?: string; //👈 懒加载前的占位图src
  errorSrc?: string; //👈 懒加载图片加载失败替换图src
}

export class LazyImage extends PureComponent<LazyImageProps> {
  watch(image: HTMLImageElement | null) {
    if (!image) return;
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!isIntersecting) return;
      image.src = this.props.src as string;
      observer.unobserve(image);
    });
    observer.observe(image);
  }

  render() {
    const {
      preLazySrc = '/kaiyuanshe.png',
      errorSrc = '/kaiyuanshe.png',
      alt,
    } = this.props;
    return (
      <Image
        ref={this.watch.bind(this)}
        {...this.props}
        src={preLazySrc}
        alt={alt}
        onError={({ currentTarget }) => (currentTarget.src = errorSrc)}
      />
    );
  }
}
