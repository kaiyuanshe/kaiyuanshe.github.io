import type { FC } from 'react';
import { TableCellAttachment } from 'mobx-lark';
import { blobURLOf } from '../../models/Base';
import { Image } from 'react-bootstrap';
import { i18n } from '../../models/Translation';

export type StaffProps = Record<'producerAvatars' | 'volunteerAvatars', any> &
  Record<'producerNames' | 'volunteerNames', string[]>;

export const Staff: FC<StaffProps> = ({
  producerAvatars,
  producerNames,
  volunteerAvatars,
  volunteerNames,
}: StaffProps) => {
  const { t } = i18n;

  return (
    <ul className="list-unstyled d-flex align-items-center justify-content-center px-2">
      {(producerAvatars as unknown as TableCellAttachment[])?.map(file => (
        <Image
          key={file.attachmentToken}
          className="object-fit-cover rounded-circle"
          style={{ width: '5rem', height: '5rem' }}
          loading="lazy"
          src={blobURLOf([file])}
        />
      ))}
      <ul className="list-unstyled d-flex justify-content-center pe-5 ps-2">
        <li>{t('producer')} </li>
        <li>{(producerNames as string[])?.join(' ')}</li>
      </ul>
      {(volunteerAvatars as unknown as TableCellAttachment[])?.map(file => (
        <Image
          key={file.attachmentToken}
          className="object-fit-cover rounded-circle"
          style={{ width: '5rem', height: '5rem' }}
          loading="lazy"
          src={blobURLOf([file])}
        />
      ))}
      <ul className="list-unstyled d-flex justify-content-center pe-5 ps-2">
        <li>{t('volunteer')} </li>
        <li>{(volunteerNames as string[])?.join(' ')}</li>
      </ul>
    </ul>
  );
};
