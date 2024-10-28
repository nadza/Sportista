import React, { useState, useEffect } from 'react';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import CardsLayout from '../cards/CardsLayout';
import UserProfileCard from '../cards/UserProfileCard';
import PropTypes from 'prop-types';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Person from '@mui/icons-material/Person';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import Review from '@mui/icons-material/RateReview';
import Ball from '@mui/icons-material/SportsBasketball';
import { getCookie } from 'cookies-next';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Footer from '../footer/footer';
import Navbar from '../navbar/navbar'
import ApartmentIcon from '@mui/icons-material/Apartment';
import DisplayCompanyCard from '../cards/DisplayCompanyCard';
import CollectionsIcon from '@mui/icons-material/Collections';
import AreaGallery from '../gallery/AreaGallery';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AreaDisplayCard from '../cards/AreaDisplayCard';

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
        setContent(<AreaDisplayCard obj="abb6859c-d438-4365-a1db-86b80056376f" />);
        break;
      case 1:
        setContent(<AreaGallery id="abb6859c-d438-4365-a1db-86b80056376f"/>)
        break;
      case 2:
        setContent(null)
        break;
      default:
        setContent(null);
    }
  };

  return (
    <Sheet sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', bgcolor: 'white'}}>
      <List orientation={orientation}>
        <ListItem>
          <NavMenuButton
            label="Apps"
            open={menuIndex === 0}
            onOpen={() => handleMenuClick(0)}
          >
            <Person />
          </NavMenuButton>
        </ListItem>
        <>
        <ListItem>
            <NavMenuButton
            label="Warehouse"
            open={menuIndex === 1}
            onOpen={() => handleMenuClick(1)}
            >
            <CollectionsIcon />
            </NavMenuButton>
        </ListItem>
        </>
        <>
        <ListItem>
            <NavMenuButton
            label="Warehouse"
            open={menuIndex === 2}
            onOpen={() => handleMenuClick(2)}
            >
            <BookOnlineIcon />
            </NavMenuButton>
        </ListItem>
        </>
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
  paddingRight: '5vh',
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

const AreaLayout = () => {
  const [content, setContent] = useState(<AreaDisplayCard obj="abb6859c-d438-4365-a1db-86b80056376f"/>);
  const isMdUp = useMediaQuery('(min-width:960px)');

  return (
    <Box>
      <Grid container spacing={2} sx={{  flexDirection: { xs: 'column', md: 'row' } }}>
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

    </Box>
  );
};

export default AreaLayout;
