"use client"
import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Person from '@mui/icons-material/Person';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import Review from '@mui/icons-material/RateReview';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TabeleAdminPanelUsers from './users/page'; //done
import TabeleAdminPanelTeams from './teams/page'; //done
import AppointmentsAdminPanel from './appointments/page';
import AreasAdminPanel from './areas/page'; //done
import CompaniesAdminPanel from './companies/page'; //done
import ReviewsAdminPanel from './reviews/page'; // done
import SportsAdminPanel from './sports/page'; //done
import GroupsIcon from '@mui/icons-material/Groups';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import BusinessIcon from '@mui/icons-material/Business';
import './admin.css'
import BookOnlineIcon from '@mui/icons-material/BookOnline';

function NavMenuButton({
  children,
  menu,
  open,
  onOpen,
  onLeaveMenu,
  label,
  ...props
}) {
  const isOnButton = React.useRef(false);
  const internalOpen = React.useRef(open);

  const handleButtonKeyDown = (event) => {
    internalOpen.current = open;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      onOpen(event);
    }
  };

  return (
    <Dropdown
      bgcolor="white"
      open={open}
      onOpenChange={(_, isOpen) => {
        if (isOpen) {
          onOpen?.();
        }
      }}
    >
      <MenuButton
        {...props}
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
        onMouseDown={() => {
          internalOpen.current = open;
        }}
        onClick={() => {
          if (!internalOpen.current) {
            onOpen();
          }
        }}
        onKeyDown={handleButtonKeyDown}
        sx={{
          bgcolor: open ? 'neutral.plainHoverBg' : undefined,
          '&:focus-visible': {
            bgcolor: 'neutral.plainHoverBg',
          },
        }}
      >
        {children}
      </MenuButton>
    </Dropdown>
  );
}

NavMenuButton.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  menu: PropTypes.element.isRequired,
  onLeaveMenu: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

function MenuIconSideNavExample({ orientation, setContent }) {
  const [menuIndex, setMenuIndex] = useState(null);

  const handleMenuClick = (index) => {
    setMenuIndex(index);
    switch (index) {
      case 0:
        setContent(<TabeleAdminPanelUsers/>);
        break;
      case 1:
          setContent(<TabeleAdminPanelTeams/>);
        break;
      case 2:
        setContent(<SportsAdminPanel/>)
        break;
      case 3:
        setContent(<AreasAdminPanel/>) 
        break;
      case 4:
        setContent(<CompaniesAdminPanel/>)
        break;
      case 5:
        setContent(<ReviewsAdminPanel/>)
        break;
      case 6:
        setContent(<AppointmentsAdminPanel/>);
        break;
      default:
        setContent(null);
    }
  };

  return (
    <Sheet sx={{ boxShadow: 3, bgcolor: 'white' }}>
      <List orientation={orientation}>
        <ListItem>
          <NavMenuButton
            label="Apps"
            open={menuIndex === 0}
            onOpen={() => handleMenuClick(0)}
          >
            <GroupsIcon />
          </NavMenuButton>
        </ListItem>
          <ListItem>
            <NavMenuButton
              label="Settings"
              open={menuIndex === 1}
              onOpen={() => handleMenuClick(1)}
            >
              <Diversity3Icon />
            </NavMenuButton>
          </ListItem>
          <>
            <ListItem>
              <NavMenuButton
                label="Warehouse"
                open={menuIndex === 2}
                onOpen={() => handleMenuClick(2)}
              >
                <SportsHandballIcon />
              </NavMenuButton>
            </ListItem>
          </>
        <ListItem>
          <NavMenuButton
            label="Personal"
            open={menuIndex === 3}
            onOpen={() => handleMenuClick(3)}
          >
            <WarehouseIcon />
          </NavMenuButton>
        </ListItem>
        <ListItem>
          <NavMenuButton
            label="Personal"
            open={menuIndex === 4}
            onOpen={() => handleMenuClick(4)}
          >
            <BusinessIcon />
          </NavMenuButton>
        </ListItem>
        <ListItem>
          <NavMenuButton
            label="Personal"
            open={menuIndex === 5}
            onOpen={() => handleMenuClick(5)}
          >
            <Review />
          </NavMenuButton>
        </ListItem>
        <ListItem>
          <NavMenuButton
            label="Personal"
            open={menuIndex === 6}
            onOpen={() => handleMenuClick(6)}
          >
            <BookOnlineIcon />
          </NavMenuButton>
        </ListItem>
      </List>
    </Sheet>
  );
}




MenuIconSideNavExample.propTypes = {
  orientation: PropTypes.string,
  setContent: PropTypes.func.isRequired,
};

const SidebarBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  margin: 'auto',
  position: 'fixed',
  top: 0,
  left: 15,
}));

const MainContentBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  margin: 'auto',
});

const FixedSidebarH = styled(Box)({
  position: 'fixed',
  bottom: 5,
  left: '50%',
  transform: 'translateX(-50%)',
  maxWidth: '100%',
  padding: '10px',
  zIndex: 10,
});

const Layout = () => {
  const [content, setContent] = useState(<TabeleAdminPanelUsers/>);
  const isMdUp = useMediaQuery('(min-width:960px)');

  return (
    <Grid container spacing={2} sx={{ height: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
      {isMdUp ? (
        <Grid item xs={12} md={1} sx={{ order: { xs: 2, md: 1 } }}>
          <SidebarBox>
            <MenuIconSideNavExample orientation={null} setContent={setContent} />
          </SidebarBox>
        </Grid>
      ) : (
        <Grid item xs={12} sx={{ order: { xs: 1, md: 1 } }}>
          <FixedSidebarH>
            <MenuIconSideNavExample orientation="horizontal" setContent={setContent} />
          </FixedSidebarH>
        </Grid>
      )}
      <Grid item xs={12} md={isMdUp ? 11 : 12} sx={{ order: { xs: 2, md: 2 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MainContentBox>{content}</MainContentBox>
      </Grid>
    </Grid>
  );
};

export default Layout;

