import React from 'react';
import { Navbar, NavbarBrand, NavbarText, Nav, NavItem } from 'reactstrap';

const NavBar = () => {
  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <Nav className="mx-auto" navbar>
          <NavItem>
            <NavbarBrand href="/">
              <h4>VLSM</h4>
            </NavbarBrand>
            <NavbarText>
              <h4>Subnet Mask Calculator</h4>
            </NavbarText>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
