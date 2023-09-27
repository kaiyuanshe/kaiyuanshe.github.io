import { FC } from 'react';
import { Badge } from 'react-bootstrap';

import { Gift } from '../../models/Activity/Gift';
import { LarkImage } from '../LarkImage';
import style from './GiftCard.module.less';

export interface GiftCardProps extends Gift {
  disabled?: boolean;
}

export const GiftCard: FC<GiftCardProps> = ({
  name,
  photo,
  stock,
  disabled = !stock,
}) => (
  <>
    <div
      className={`position-relative mb-3 ${style.gift} ${
        disabled ? style.disabled : ''
      }`}
    >
      <LarkImage roundedCircle src={photo} />

      <div className="position-absolute end-0 bottom-0 p-2">
        <Badge bg="danger" pill>
          {stock}
        </Badge>
      </div>
    </div>

    {name}
  </>
);
