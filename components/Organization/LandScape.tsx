import { Dialog } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { splitArray } from 'web-utility';

import systemStore from '../../models/Base/System';
import {
  Organization,
  OrganizationModel,
} from '../../models/Community/Organization';
import { LarkImage } from '../Base/LarkImage';
import { OrganizationCard } from './Card';
import styles from './LandScape.module.less';

export type OpenCollaborationLandscapeProps = Pick<OrganizationModel, 'tagMap'>;

@observer
export class OpenCollaborationLandscape extends Component<OpenCollaborationLandscapeProps> {
  @observable
  accessor itemSize = 5;

  modal = new Dialog<{ name?: string }>(({ defer, name }) => (
    <Modal show={!!defer} onHide={() => defer?.resolve()}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{this.renderCard(name!)}</Modal.Body>
    </Modal>
  ));

  renderCard(name: string) {
    const organization = Object.values(this.props.tagMap)
      .flat()
      .find(({ name: n }) => n === name);

    if (!organization) return <></>;

    const { id, ...data } = organization;

    return <OrganizationCard {...data} />;
  }

  renderLogo = ({ name, logos }: Organization) => (
    <li
      key={name as string}
      className={`border ${styles.listItem}`}
      onClick={() => this.modal.open({ name: name as string })}
    >
      <LarkImage
        className="object-fit-contain"
        style={{ width: this.itemSize + 'rem', height: this.itemSize + 'rem' }}
        src={logos}
      />
    </li>
  );

  render() {
    const { screenNarrow } = systemStore;
    const rows = splitArray(Object.entries(this.props.tagMap), 2);

    return (
      <>
        {rows.map(row => (
          <ul
            className={`list-unstyled d-flex flex-${screenNarrow ? 'column' : 'row'} gap-2`}
          >
            {row.map(([name, list]) => (
              <li key={name} className="flex-fill">
                <h2 className={`h5 p-2 text-white ${styles.groupTitle}`}>
                  {name}
                </h2>

                <ol className="list-unstyled d-flex flex-wrap gap-2">
                  {list.map(this.renderLogo)}
                </ol>
              </li>
            ))}
          </ul>
        ))}
        <this.modal.Component />
      </>
    );
  }
}
