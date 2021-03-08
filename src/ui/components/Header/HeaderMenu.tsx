import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { IMPORT_ROUTE } from 'ui/utils/routes';
import React, { useState } from 'react';

export function HeaderMenu() {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <MenuIcon ref={setAnchorEl} onClick={toggleMenu} />
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: -40,
          horizontal: 'left'
        }}
        onClick={toggleMenu}>
        <MenuItem>
          <NavLink to={IMPORT_ROUTE}>Import Data</NavLink>
        </MenuItem>
      </Menu>
    </>
  );
}
