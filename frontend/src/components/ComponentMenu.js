//Importaciones
import React, { Component } from 'react';
import { Icon, Menu } from 'semantic-ui-react'

//CSS
import './global/css/Menu.css';

//Defincion de la clase
class ComponentMenu extends Component {
  state = { activeItem: 'gamepad' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  constructor (props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu icon='labeled'>
        <Menu.Item
          name='gamepad'
          active={activeItem === 'gamepad'}
          onClick={this.handleItemClick}
        >
          <Icon name='gamepad' />
          Games
        </Menu.Item>

        <Menu.Item
          name='video camera'
          active={activeItem === 'video camera'}
          onClick={this.handleItemClick}
        >
          <Icon name='video camera' />
          Channels
        </Menu.Item>

        <Menu.Item
          name='video play'
          active={activeItem === 'video play'}
          onClick={this.handleItemClick}
        >
          <Icon name='video play' />
          Videos
        </Menu.Item>
      </Menu>
    );
  }
}

export default ComponentMenu;