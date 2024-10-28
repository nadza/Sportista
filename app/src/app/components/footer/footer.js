"use client"
import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import logo from '../../assets/logo_2.png'
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const content = {
  en: {
    page_section_1: 'Appointments',
    page_section_2: 'Areas',
    page_section_3: 'Blog',
  },
  bs: {
    page_section_1: 'Termini',
    page_section_2: 'Tereni',
    page_section_3: 'Blog',
  }
};

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const handleOpenTermini = () => {
    router.push('/search_appointments');
  };

  const handleOpenTereni = () => {
    router.push('/search_areas');
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: '5vh',
        backgroundColor: '#e63825'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, mb: 2 }}>
              <img src={logo.src} alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />
              <Typography variant="h6" component="div" color="#fff">
                Sportista
              </Typography>
              <Typography variant="body2" color="#fff">
                © Sportista2024
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 1, textAlign: { xs: 'center', sm: 'right' } }}>
            <Box>
              <Link href="https://twitter.com" color="inherit" sx={{ mx: 1 }}>
                <Twitter sx={{ color: 'white' }} />
              </Link>
              <Link href="https://facebook.com" color="inherit" sx={{ mx: 1 }}>
                <Facebook sx={{ color: 'white' }}/>
              </Link>
              <Link href="https://instagram.com" color="inherit" sx={{ mx: 1 }}>
                <Instagram sx={{ color: 'white' }}/>
              </Link>
            </Box>
            <Box sx={{ marginTop: 1}}>
              <Link href="/search_appointments" color="#fff" sx={{ mx: 1 }} underline="none">{content[language].page_section_1}</Link>
              <Link href="/search_areas" color="#fff" sx={{ mx: 1 }} underline="none">{content[language].page_section_2}</Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
