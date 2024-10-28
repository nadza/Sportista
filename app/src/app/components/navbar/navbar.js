"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from '@mui/material/Link';
import axios from "axios";
import { useRouter } from 'next/navigation';
import logo from '../../assets/final_logo.png';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const content = {
  en: {
    page_section_1: 'Appointments',
    page_section_2: 'Areas',
    settings_1: 'User profile',
    settings_2: 'Log Out',
  },
  bs: {
    page_section_1: 'Termini',
    page_section_2: 'Tereni',
    settings_1: 'Korisnički profil',
    settings_2: 'Izloguj se',
  }
};

function ResponsiveAppBar() {
  const { language, setLanguage } = useContext(LanguageContext);
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const router = useRouter();

  const handleOpenChat = () => {
    router.push('/chat');
  };

  const handleOpenTermini = () => {
    router.push('/search_appointments');
  };

  const handleOpenTereni = () => {
    router.push('/search_areas');
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotif(event.currentTarget);
  }

  const handleCloseNotifications = () => {
    setAnchorElNotif(null);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutClick = () => {
    axios.post('http://localhost:8000/logout', {withCredentials: true}).then(
    (response) => {
    },
    (error) => {
      console.log("Error: ", error);
    }
  );
  router.push("/login");
  };


  return (
    <AppBar position="static" style={{ backgroundColor: '#fff',  }}>
      <Box paddingLeft="2vh" paddingRight="2vh">
        <Toolbar disableGutters>
          <Box>
            <Link href="/homepage">
              <img src={logo.src} alt="logo" style={{ height: '40px', marginRight: '10px' }} />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key={content[language].page_section_1} onClick={handleOpenTermini}>
                <Typography textAlign="center">{content[language].page_section_1}</Typography>
              </MenuItem>

              <MenuItem key={content[language].page_section_2} onClick={handleOpenTereni}>
                <Typography textAlign="center">{content[language].page_section_2}</Typography>
              </MenuItem>

              <MenuItem key={content[language].page_section_2} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{content[language].page_section_2}</Typography>
              </MenuItem>
              <MenuItem key={content[language].page_section_3} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{content[language].page_section_3}</Typography>

              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ justifyContent: 'center', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key={content[language].page_section_1}
                onClick={handleOpenTermini}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {content[language].page_section_1}
              </Button>
              <Button
                key={content[language].page_section_2}
                onClick={handleOpenTereni}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {content[language].page_section_2}
              </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Change language to Bosnian" sx = {{magin:0,padding:0, width: '15px', minWidth: '15px', color: '#000'}}>
              <Button variant="text" onClick={() => handleLanguageChange('bs')}>BS</Button>
            </Tooltip>
            <Tooltip title="Change language to English" sx = {{magin:0, marginLeft: '20px', marginRight: '20px', padding:0, width: '15px', minWidth: '15px', color: '#000'}}>
              <Button variant="text" onClick={() => handleLanguageChange('en')}>EN</Button>
          </Tooltip>
          <Tooltip title="Open chat">
            <IconButton onClick={handleOpenChat} sx={{ color: 'black' }}>
              <ChatBubbleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open notifications">
            <IconButton onClick={handleOpenNotifications} sx={{ color: 'black' }}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElNotif}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotif)}
              onClose={handleCloseNotifications}
            >

              <MenuItem key={1} onClick={handleCloseUserMenu}>
                  <Link href="/user_panel" underline="none" color="black">
                    <Typography textAlign="center">{content[language].settings_1}</Typography>
                  </Link>
              </MenuItem>    
              <MenuItem key={2} onClick={handleCloseUserMenu}>
                <Typography textAlign="center" onClick={handleLogoutClick}>{content[language].settings_2}</Typography>
              </MenuItem>   

                  <Link href="/user_panel" underline="none" color="black">
                    <Typography textAlign="center">{content[language].settings_1}</Typography>
                  </Link>
                  <Link href="/user_panel" underline="none" color="black">
                    <Typography textAlign="center">{content[language].settings_1}</Typography>
                  </Link>

              </Menu>

            <Tooltip title="Open user profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ color: 'black' }}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={1} onClick={handleCloseUserMenu}>
                  <Link href="/user_panel" underline="none" color="black">
                    <Typography textAlign="center">{content[language].settings_1}</Typography>
                  </Link>
              </MenuItem>    
              <MenuItem key={2} onClick={handleCloseUserMenu}>
                <Typography textAlign="center" onClick={handleLogoutClick}>{content[language].settings_2}</Typography>
              </MenuItem>    
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
export default ResponsiveAppBar;
