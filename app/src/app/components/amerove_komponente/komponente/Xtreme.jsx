"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Grid, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import backgroundImage from '../imgs/fit.jpg';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';

const content = {
    en: {
      login: "Log In",  
      sections: [
        {
          title: "WELCOME",
          subtitle: "Want to book a field for football, basketball, tennis, or any other sport?",
          text: "",
        },
        {
          title: "TEAMS",
          subtitle: "Need a team for joint training or a recreational match?",
          text: "",
        },
        {
          title: "RENTAL",
          subtitle: "We enable you to easily and quickly rent sports fields and connect with other players.",
          text: "",
        },
        {
          title: "RESERVATIONS",
          subtitle: "Our intuitive reservation system allows you to secure your desired time slot in a few steps.",
          text: "",
        },
      ],
    },
    bs: {
      login: "Prijavi se",
      sections: [
        {
          title: "DOBRODOŠLI",
          subtitle: "Želite da rezervišete teren za fudbal, košarku, tenis ili bilo koji drugi sport?",
          text: "",
        },
        {
          title: "EKIPE",
          subtitle: "Trebate ekipu za zajednički trening ili rekreativni meč?",
          text: "",
        },
        {
          title: "IZNAJMLJIVANJE",
          subtitle: "Mi vam omogućavamo jednostavno i brzo iznajmljivanje sportskih terena i povezivanje sa drugim igračima.",
          text: "",
        },
        {
          title: "REZERVACIJE",
          subtitle: "Intuitivan sistem rezervacije omogućava vam da u nekoliko koraka obezbedite željeni termin.",
          text: "",
        },
      ],
    },
  };
  

  const XtremeFitness = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { language } = useContext(LanguageContext);
  
    const sections = content[language].sections;
  
    const handleLeftClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? sections.length - 1 : prevIndex - 1
      );
    };
  
    const handleRightClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sections.length - 1 ? 0 : prevIndex + 1
      );
    };
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === sections.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);
  
      return () => clearInterval(intervalId);
    }, [currentIndex, sections.length]);
  
    return (
      <Box sx={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 20px',
        [theme.breakpoints.down('sm')]: {
          padding: '0 10px'
        }
      }}>
        {isSmallScreen ? (
          <>
            <IconButton onClick={handleLeftClick} color="#e63825">
              <ArrowBackIcon fontSize="large" style={{ fill: "#e63825" }} />
            </IconButton>
            <Box sx={{ marginBottom: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              {sections[currentIndex].title}
            </Typography>
            <Typography variant="h5" component="h3" gutterBottom style={{ fontWeight: 'bold' }}>
              {sections[currentIndex].subtitle}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '20px' }}>
              {sections[currentIndex].text}
            </Typography>
            <Box sx={{ marginTop: 2 }} />
            <IconButton onClick={handleRightClick} color="#e63825">
              <ArrowForwardIcon fontSize="large" style={{ fill: "#e63825" }} />
            </IconButton>
          </>
        ) : (
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={2} sm={1}>
              <IconButton onClick={handleLeftClick} color="secondary">
                <ArrowBackIcon fontSize="large" style={{ fill: "#e63825" }} />
              </IconButton>
            </Grid>
            <Grid item xs={10} sm={8} md={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                {sections[currentIndex].title}
              </Typography>
              <Typography variant="h5" component="h3" gutterBottom style={{ fontWeight: 'bold' }}>
                {sections[currentIndex].subtitle}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                {sections[currentIndex].text}
              </Typography>
            </Grid>
            <Grid item xs={2} sm={1}>
              <IconButton onClick={handleRightClick} color="secondary">
                <ArrowForwardIcon fontSize="large" style={{ fill: "#e63825" }} />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  };
  
  export default XtremeFitness;