import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import './styles.scss';

export default class DropDownMenuList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, menu, openLink, prefix } = this.props;

    return (
      <NavDropdown title={title} id={title} className="drop-down-menu-list">
        {menu.map((item, y) => (
          <MenuItem
            key={`item-${y}`}
            onClick={() => {
              if (item.slug) {
                openLink(`${prefix}/${item.slug}`);
              }
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </NavDropdown>
    );
  }
}

DropDownMenuList.propTypes = {
  title: PropTypes.string.isRequired,
  menu: PropTypes.array.isRequired,
  openLink: PropTypes.func.isRequired
};
