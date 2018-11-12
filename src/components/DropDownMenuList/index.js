import React from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import './styles.scss';

const DropDownMenuList = ({ title, menu, openLink, prefix }) => (
  <NavDropdown title={title} id={title} className="drop-down-menu-list">
    {menu.map(item => (
      <MenuItem
        key={item.slug}
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

DropDownMenuList.propTypes = {
  title: PropTypes.string.isRequired,
  menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  openLink: PropTypes.func.isRequired
};

export default DropDownMenuList;
