import Link from 'next/link';
import { FC, ReactNode } from 'react';

export const ZodiacSigns = [
  '🐵',
  '🐔',
  '🐶',
  '🐷',
  '🐭',
  '🐮',
  '🐯',
  '🐰',
  '🐲',
  '🐍',
  '🐴',
  '🐐',
];

export interface ZodiacBarProps {
  startYear: number;
  endYear?: number;
  itemOf?: (
    year: number,
    zodiac: string,
  ) => { link?: string; title?: ReactNode };
}

export const ZodiacBar: FC<ZodiacBarProps> = ({
  startYear,
  endYear = new Date().getFullYear(),
  itemOf,
}) => (
  <ol className="list-inline d-flex flex-wrap gap-3">
    {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
      const year = endYear - index;
      const zodiac = ZodiacSigns[year % 12];
      const { link = '#', title } = itemOf?.(year, zodiac) || {};

      return (
        <li key={index} className="list-inline-item border rounded">
          <Link
            className="d-inline-block p-3 text-decoration-none text-center"
            href={link}
          >
            <div className="fs-1">{zodiac}</div>

            {title}
          </Link>
        </li>
      );
    })}
  </ol>
);
