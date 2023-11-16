import { FC, PropsWithChildren } from 'react';

import style from './style.module.less';

export type TextScrollableProps = PropsWithChildren<{
  maxWidth?: string;
  duration?: string;
  height?: string;
}>;

export const TextScrollable: FC<TextScrollableProps> = ({
  children,
  maxWidth = '100%',
  duration,
  height,
}) => (
  <div className="overflow-hidden mw-100">
    <div
      className={`d-inline-block align-top text-nowrap ${style.scrollWrap}`}
      style={{
        maxWidth,
        animationDuration: duration,
        height,
        lineHeight: height,
      }}
    >
      <div
        className={`d-inline-block ${style.scrollItem}`}
        style={{ animationDuration: duration }}
      >
        {children}
      </div>
    </div>
  </div>
);

export const TextScrollableBox: FC<TextScrollableProps> = ({
  children,
  maxWidth,
  duration,
  height,
}) =>
  height ? (
    <div
      className={`overflow-hidden ${style.scrollHeightWrap}`}
      // @ts-ignore
      style={{ maxWidth: maxWidth, '--scroll-height': height }}
    >
      <div
        className={`d-inline-block overflow-hidden mw-100 ${style.scrollContainer}`}
      >
        <div
          className={`d-block overflow-hidden text-wrap text-break ${style.unScrollItem}`}
        >
          {children}
        </div>
        <TextScrollable duration={duration}>
          {children}
        </TextScrollable>
      </div>
    </div>
  ) : (
    <TextScrollable maxWidth={maxWidth} duration={duration} height={height}>
      {children}
    </TextScrollable>
  );
