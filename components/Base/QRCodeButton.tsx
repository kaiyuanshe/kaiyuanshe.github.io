import { Dialog, DialogClose } from 'idea-react';
import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';
import { Button, ButtonProps, Modal, ModalProps } from 'react-bootstrap';

type DialogQRCProps = Pick<
  ModalProps,
  'size' | 'fullscreen' | 'centered' | 'animation' | 'scrollable'
> &
  Pick<ButtonProps, 'title' | 'value'>;

const dialogQRC = new Dialog<DialogQRCProps>(
  ({ defer, title, value, ...props }) => (
    <Modal
      {...props}
      show={!!defer}
      onHide={() => defer?.reject(new DialogClose())}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <QRCodeCanvas className="d-block m-auto" value={value + ''} />
      </Modal.Body>
    </Modal>
  ),
);

export type QRCodeButtonProps = DialogQRCProps & ButtonProps;

export const QRCodeButton: FC<QRCodeButtonProps> = ({
  title,
  value = '',
  size = 'sm',
  variant = 'danger',
  disabled,
  children,
  ...props
}) => (
  <>
    <Button
      {...{ size, variant, disabled }}
      onClick={() => dialogQRC.open().catch(console.log)}
    >
      {children}
    </Button>

    <dialogQRC.Component {...{ title, value, size, ...props }} />
  </>
);
