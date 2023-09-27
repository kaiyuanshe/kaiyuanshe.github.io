import { PureComponent } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

import { DefaultImage } from '../../pages/api/lark/file/[id]';

export interface LazyImageProps extends ImageProps {
  preLazySrc?: string; //👈 懒加载前的占位图src
  errorSrc?: string; //👈 懒加载图片加载失败替换图src
}

export class LazyImage extends PureComponent<LazyImageProps> {
  watch = (image: HTMLImageElement | null) => {
    if (!image) return;

    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!isIntersecting) return;
      image.src = this.props.src as string;
      observer.unobserve(image);
    });
    observer.observe(image);
  };

  render() {
    const {
      preLazySrc = DefaultImage,
      errorSrc = DefaultImage,
      alt,
    } = this.props;

    return (
      <Image
        ref={this.watch}
        {...this.props}
        src={preLazySrc}
        alt={alt}
        onError={({ currentTarget }) => (currentTarget.src = errorSrc)}
      />
    );
  }
}
