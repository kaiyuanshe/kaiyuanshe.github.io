import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

import { blobURLOf } from '../models/Base';
import { fileURLOf } from '../pages/api/lark/file/[id]';

export interface LarkImageProps extends Omit<ImageProps, 'src'> {
  src: TableCellValue;
}

export const LarkImage: FC<LarkImageProps> = ({ src, ...props }) => (
  <Image
    fluid
    loading="lazy"
    {...props}
    src={blobURLOf(src)}
    onError={({ currentTarget: image }) => {
      const path = fileURLOf(src);

      if (path && !image.src.endsWith(path)) image.src = path;
    }}
  />
);
