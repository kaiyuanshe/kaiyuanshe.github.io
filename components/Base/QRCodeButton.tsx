import { OverlayBox, OverlayBoxProps } from 'idea-react';
import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

export type QRCodeButtonProps = Omit<OverlayBoxProps, 'children'> & ButtonProps;

export const QRCodeButton: FC<QRCodeButtonProps> = ({
  title,
  value = '',
  trigger = 'click',
  placement = 'bottom',
  size = 'sm',
  variant = 'danger',
  disabled,
  children,
  ...props
}) => (
  <OverlayBox
    detail={<QRCodeCanvas className="d-block m-auto" value={value + ''} />}
    {...{ title, trigger, placement, ...props }}
  >
    <Button {...{ size, variant, disabled }}>{children}</Button>
  </OverlayBox>
);
