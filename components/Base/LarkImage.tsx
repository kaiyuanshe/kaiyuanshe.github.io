import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

import { blobURLOf } from '../../models/Base';
import { DefaultImage, fileURLOf } from '../../pages/api/lark/file/[id]';

export interface LarkImageProps extends Omit<ImageProps, 'src'> {
  src?: TableCellValue;
}

export const LarkImage: FC<LarkImageProps> = ({
  src = DefaultImage,
  ...props
}) => (
  <Image
    fluid
    loading="lazy"
    {...props}
    src={blobURLOf(src)}
    onError={({ currentTarget: image }) => {
      const path = fileURLOf(src);

      if (!path) return;

      const errorURL = decodeURI(image.src);

      image.src = errorURL.endsWith(path)
        ? errorURL.endsWith(DefaultImage)
          ? ''
          : DefaultImage
        : path;
    }}
  />
);
