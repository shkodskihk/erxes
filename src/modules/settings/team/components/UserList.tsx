import { IUser } from 'modules/auth/types';
import {
  Button,
  ControlLabel,
  FormGroup,
  ModifiableList,
  NameCard,
  Table
} from 'modules/common/components';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import styled from 'styled-components';
import { ModalFooter } from '../../../common/styles/main';
import { List, RowActions } from '../../common/components';
import { ICommonListProps } from '../../common/types';
import { UserForm } from '../containers';

const UserAvatar = styled.td`
  &:hover {
    cursor: pointer;
  }
`;

class UserList extends React.Component<ICommonListProps, { emails: string[] }> {
  constructor(props) {
    super(props);

    this.state = {
      emails: []
    };
  }

  onAvatarClick = object => {
    return this.props.history.push(`team/details/${object._id}`);
  };

  onAddingEmail = options => {
    this.setState({ emails: options });
  };

  onRemovingEmail = options => {
    this.setState({ emails: options });
  };

  onSubmit = () => {
    // tslint:disable-next-line
    console.log(this.state.emails);
  };

  renderInvitationForm = props => {
    return (
      <div>
        <FormGroup>
          <ControlLabel>Emails</ControlLabel>
          <ul>
            <ModifiableList
              options={[]}
              addButtonLabel="Add Email"
              onAddingOption={this.onAddingEmail}
              onRemovingOption={this.onRemovingEmail}
            />
          </ul>
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={props.closeModal}
            icon="cancel-1"
          >
            Cancel
          </Button>

          <Button
            btnStyle="success"
            type="submit"
            onClick={this.onSubmit}
            icon="checked-1"
          >
            Invite
          </Button>
        </ModalFooter>
      </div>
    );
  };

  renderForm = props => {
    return <UserForm {...props} />;
  };

  renderRows({ objects }: { objects: IUser[] }) {
    return objects.map((object, index) => {
      const onClick = () => {
        this.onAvatarClick(object);
      };

      return (
        <tr key={index}>
          <UserAvatar onClick={onClick}>
            <NameCard user={object} avatarSize={30} singleLine={true} />
          </UserAvatar>
          <td>{object.email}</td>
          <td>{object.role}</td>

          <RowActions
            {...this.props}
            object={object}
            renderForm={this.renderForm}
          />
        </tr>
      );
    });
  }

  renderContent = props => {
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Full name')}</th>
            <th>{__('Email')}</th>
            <th>{__('Role')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody>{this.renderRows(props)}</tbody>
      </Table>
    );
  };

  breadcrumb() {
    return [
      { title: __('Settings'), link: '/settings' },
      { title: __('Team members') }
    ];
  }

  render() {
    return (
      <List
        title="Invite team members"
        breadcrumb={[
          { title: __('Settings'), link: '/settings' },
          { title: __('Team members') }
        ]}
        renderForm={this.renderInvitationForm}
        renderContent={this.renderContent}
        {...this.props}
      />
    );
  }
}

export default UserList;
