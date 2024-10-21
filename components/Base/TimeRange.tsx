import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';
import { formatDate } from 'web-utility';

export const TimeRange: FC<Record<'startTime' | 'endTime', TableCellValue>> = ({
  startTime,
  endTime,
}) =>
  startTime &&
  endTime && (
    <>
      🕒 {formatDate(+startTime!, 'YYYY-MM-DD HH:mm')} ~{' '}
      {formatDate(+endTime!, 'YYYY-MM-DD HH:mm')}
    </>
  );
