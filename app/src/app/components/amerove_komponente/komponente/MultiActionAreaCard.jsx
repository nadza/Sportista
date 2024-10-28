"use client"
import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/system';
import { LanguageContext } from '../../../context/LanguageContext';
import { useContext } from 'react';

const content = {
    en: {
        offer: "WE OFFER YOU...",
        cardsData: [
            {
                icon: "🏟️",
                title: "FIELDS",
                description: "From soccer and basketball courts to tennis and volleyball courts – all in one place. Join numerous teams!",
            },
            {
                icon: "👥",
                title: "TEAMS",
                description: "Connect with other athletes, create teams, and organize matches or training sessions.",
            },
            {
                icon: "📅",
                title: "RESERVATIONS",
                description: "The easiest way to book your desired time slot in just a few steps.",
            },
            {
                icon: "✅",
                title: "RELIABILITY",
                description: "We partner with trusted sports centers to provide you with safe and high-quality services.",
            },
        ]
    },
    bs: {
        offer: "NUDIMO VAM...",
        cardsData: [
            {
                title: "RAZNOVRSNI SPORTSKI TERENI",
                description: "Od fudbalskih i košarkaških terena, do teniskih i terena za odbojku – sve na jednom mjestu.",
                icon: "🏟️",
            },
            {
                title: "KREIRANJE TIMOVA",
                description: "Povežite se sa drugim sportistima, kreirajte timove i organizujte utakmice ili treninge.",
                icon: "👥",
            },
            {
                title: "REZERVACIJA",
                description: "Nikad lakši način rezervacije omogućava vam da u nekoliko koraka obezbjedite željeni termin.",
                icon: "📅",
            },
            {
                title: "POUZDANOST",
                description: "Sarađujemo sa provjerenim sportskim centrima kako bismo vam pružili sigurne i kvalitetne usluge.",
                icon: "✅",
            },
        ]
    },
};

const CustomCard = styled(Card)({
    minWidth: 275,
    height: 200,
    margin: 2,
    transition: 'box-shadow 0.8s',
    '&:hover': {
        boxShadow: '0px 0px 10px 5px rgba(230, 56, 37, 0.5)',
    },
    '& a': {
        textDecoration: 'none',
        color: 'red',
    },
});

const CardSlider = () => {
    const { language } = useContext(LanguageContext);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content[language].cardsData.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + content[language].cardsData.length) % content[language].cardsData.length);
    };

    const getVisibleCards = () => {
        const cardsData = content[language].cardsData; // Removed .cardsData here
        const visibleCards = [];
        for (let i = 0; i < 4; i++) {
            const index = (currentIndex + i) % cardsData.length;
            visibleCards.push(cardsData[index]);
        }
        return visibleCards;
    };

    return (
        <Box sx={{ marginTop: '10vh', textAlign: 'center', marginBottom: '10vh' }} className="CardSliderContainer">
            <Typography variant="h3" component="div" sx={{ marginBottom: 4 }}>
                {content[language].offer}
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton onClick={handlePrev}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Grid container spacing={2} justifyContent="center">
                    {getVisibleCards().map((card, index) => (
                        <Grid item key={index} xs={12} sm={6} md={3}>
                            <CustomCard>
                                <CardContent sx={{ paddingTop: '24px' }}>
                                    <Typography variant="h3" component="div" align="center">
                                        {card.icon}
                                    </Typography>
                                    <Typography variant="h5" component="div" align="center">
                                        {card.title}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary" align="center">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </CustomCard>
                        </Grid>
                    ))}
                </Grid>
                <IconButton onClick={handleNext}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default CardSlider;
