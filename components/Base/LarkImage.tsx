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
  alt,
  ...props
}) => (
  <Image
    // eslint-disable-next-line react/jsx-sort-props
    fluid
    loading="lazy"
    {...props}
    src={blobURLOf(src)}
    alt={alt}
    onError={({ currentTarget: image }) => {
      const path = fileURLOf(src),
        errorURL = decodeURI(image.src);

      if (!path) return;

      if (errorURL.endsWith(path)) {
        if (!alt) image.src = DefaultImage;
      } else if (!errorURL.endsWith(DefaultImage)) {
        image.src = path;
      }
    }}
  />
);
