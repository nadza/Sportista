"use client"
import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import backgroundImage from '../imgs/trcanje1.jpg'; // Uvezi pozadinsku sliku
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';


const Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: `url(${backgroundImage.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    textAlign: 'center',
    padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: '800px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: theme.spacing(2),
}));

const Content = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(4),
}));

const Quote = styled(Typography)(({ theme }) => ({
    fontSize: '2.7rem',
    fontStyle: 'italic',
    marginBottom: theme.spacing(2),
    color:'white'
}));

const Author = styled(Typography)(({ theme }) => ({
    fontSize: '2.0rem',
    fontWeight: 'bold',
    color:'white'
}));

const IconButtonWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

const content = {
    en: {
        heading: 'ABOUT US...',
        testimonials: [
            {
                quote: 'The tennis courts are excellent! They are always clean and well-maintained. An ideal place for playing with friends or for serious training.',
                author: 'Asmir Zukic',
                title: 'Satisfied Customers',
            },
            {
                quote: 'The basketball court is great! A fantastic space for fun and recreation with friends. Highly recommended for basketball enthusiasts!',
                author: 'Nadža Zahiragić',
                title: 'Satisfied Customers',
            },
            {
                quote: 'The football field is top-notch! The field is in excellent condition, providing a true professional feel during matches and training.',
                author: 'Karlo Blaškić',
                title: 'Satisfied Customers',
            }
        ]
    },

    bs: {
        heading: 'ŠTA KAŽU O NAMA...',
        testimonials: [
            {
                quote: 'Teniski tereni su odlični! Uvek su čisti i dobro održavani. Idealno mesto za igru sa prijateljima ili za ozbiljan trening.',
                author: 'Asmir Zukic',
                title: 'Zadovoljni klijenti',
            },
            {
                quote: 'Košarkaški teren je super! Odličan prostor za zabavu i rekreaciju sa društvom. Sve preporuke za ljubitelje košarke!',
                author: 'Nadža Zahiragić',
                title: 'Zadovoljni klijenti',
            },
            {
                quote: 'Fudbalski teren je vrhunski! Teren je u odličnom stanju, što omogućava pravi profesionalni osećaj tokom utakmica i treninga.',
                author: 'Karlo Blaškić',
                title: 'Zadovoljni klijenti',
            }
        ]
    }
}


const TestimonialCard = () => {
    const { language } = useContext(LanguageContext);

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const handleNext = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <Root>
            <Typography variant="h3" sx={{ marginTop: 1 , color: 'white'}}>
                {content[language].heading}
            </Typography>

            <StyledCard>
                <Content>
                    <Quote variant="h5">
                        “{content[language].testimonials[currentTestimonial].quote}”
                    </Quote>
                    <Author>
                        {content[language].testimonials[currentTestimonial].author}
                    </Author>
                    <Typography variant="subtitle1">
                        {content[language].testimonials[currentTestimonial].title}
                    </Typography>
                </Content>
            </StyledCard>

            <IconButtonWrapper>
                <IconButton style={{color: '#fff'}} onClick={handlePrev}>
                    <ArrowBackIosIcon/>
                </IconButton>

                <IconButton style={{color: '#fff'}} onClick={handleNext}>
                    <ArrowForwardIosIcon/>
                </IconButton>
            </IconButtonWrapper>
        </Root>
    );
};

export default TestimonialCard;
