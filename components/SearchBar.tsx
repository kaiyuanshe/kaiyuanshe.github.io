import { PureComponent } from 'react';
import {
  Form,
  Button,
  InputGroup,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';

import { SearchScope, MainRoute } from './data';

interface State {
  scope: SearchScope;
  scopeName: string;
}

export default class SearchBar extends PureComponent<
  { scope?: SearchScope },
  State
> {
  state: Readonly<State> = {
    scope: SearchScope.Article,
    scopeName: MainRoute[SearchScope.Article].title,
  };

  componentDidMount() {
    this.setScope(this.props.scope);
  }

  setScope(scope = SearchScope.Article) {
    this.setState({
      scope,
      scopeName: MainRoute[scope].title,
    });
  }

  render() {
    const { scope, scopeName } = this.state;

    return (
      <Form className="my-3" action={MainRoute[scope].path}>
        <InputGroup className="mb-3">
          <DropdownButton
            variant="outline-primary"
            title={scopeName}
            onSelect={key => this.setScope(+(key || ''))}
          >
            {Object.entries(MainRoute).map(([value, { title }]) => (
              <Dropdown.Item
                key={value}
                eventKey={value}
                active={+value === scope}
              >
                {title}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          <Form.Control type="search" name="keywords" />

          <Button className="px-4" type="submit">
            搜 索
          </Button>
        </InputGroup>
      </Form>
    );
  }
}
