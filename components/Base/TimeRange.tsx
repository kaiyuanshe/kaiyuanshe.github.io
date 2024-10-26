import { Time } from 'idea-react';
import { TableCellValue } from 'mobx-lark';
import { FC } from 'react';

export const TimeRange: FC<Record<'startTime' | 'endTime', TableCellValue>> = ({
  startTime,
  endTime,
}) =>
  startTime &&
  endTime && (
    <>
      🕒 <Time dateTime={+startTime!} format="YYYY-MM-DD HH:mm" /> ~{' '}
      <Time dateTime={+endTime!} format="YYYY-MM-DD HH:mm" />
    </>
  );
