import { RangeInput, RangeInputProps } from 'mobx-restful-table';
import { FC } from 'react';

export const ScoreBar: FC<RangeInputProps> = ({ value }) => (
  <RangeInput
    icon={value => (value > 0.5 ? '❤' : '🤍')}
    readOnly
    value={value}
  />
);
