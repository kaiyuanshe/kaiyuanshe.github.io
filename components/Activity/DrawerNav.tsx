import { Icon,PageNav } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button,Offcanvas } from 'react-bootstrap';
import { sleep } from 'web-utility';

@observer
export class DrawerNav extends PureComponent {
  @observable
  drawerShown = false;

  closeDrawer = async () => {
    let { scrollTop } = document.scrollingElement || {};

    do {
      await sleep(0.1);
      if (scrollTop === document.scrollingElement?.scrollTop) {
        this.drawerShown = false;
        break;
      }
      scrollTop = document.scrollingElement?.scrollTop;
    } while (true);
  };

  render() {
    const { drawerShown, closeDrawer } = this;

    return (
      <>
        <div className="fixed-bottom p-3">
          <Button onClick={() => (this.drawerShown = true)}>
            <Icon name="layout-text-sidebar" />
          </Button>
        </div>

        <Offcanvas
          style={{ width: 'max-content' }}
          show={drawerShown}
          onHide={closeDrawer}
        >
          <Offcanvas.Body>
            <PageNav onItemClick={this.closeDrawer} depth={2} />
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
}
