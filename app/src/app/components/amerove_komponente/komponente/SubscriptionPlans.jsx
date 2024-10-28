"use client"
import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import image1 from '../imgs/basic1.png';
import image2 from '../imgs/std.png';
import image3 from '../imgs/premium.jpg';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';


const SubscriptionCard = ({ title, price, features, image, text }) => {
    return (
        <Card
            sx={{
                maxWidth: 345,
                margin: 'auto',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 0px 10px 5px rgba(230, 56, 37, 0.5)',
                                },
            }}
        >
            <div style={{ backgroundImage: `url(${image.src})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 200 }} />
            <CardContent>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: 2 }}>
                    {title}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#f44336',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        {price}
                    </div>
                </div>
                {features.map((feature, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}
                    >
                        <CheckCircle sx={{ fontSize: 18, marginRight: 1 }} />
                        {feature}
                    </Typography>
                ))}
            </CardContent>
            <CardActions>
                <Button size="large" variant="contained" color="primary" sx={{ margin: 'auto', marginBottom: '2vh' }}>
                    {text}
                </Button>
            </CardActions>
        </Card>
    );
};

const content = {
    en: {
        plans: [
            {
                title: 'BASIC',
                price: '$45',
                features: [
                    'Access to basic areas for rent',
                    'Advance booking option',
                    '24/7 Customer Service Support',
                    'Easy online booking',
                    'Free cancellation option'
                ],
                image: image1,
                text: 'Join Now'
            },
            {
                title: 'STANDARD',
                price: '$50',
                features: [
                    'Access to standard and premium areas',
                    'Priority appointment booking',
                    'More location options',
                    '24/7 Customer Service Support',
                    'Special Offers & Discounts'
                ],
                image: image2,
                text: 'Join Now'
            },
            {
                title: 'PREMIUM',
                price: '$60',
                features: [
                    'Access to all grounds and additional content',
                    'VIP support and personalized services',
                    'Luxury locations and exclusive appointments',
                    'Special offers for members',
                    'Premium sports equipment included'
                ],
                image: image3,
                text: 'Join Now'
            },
        ]
    },

    bs: {
        plans: [
            {
                title: 'OBIČNI',
                price: 'KM45',
                features: [
                    'Pristup osnovnim terenima za iznajmljivanje',
                    'Mogućnost rezervacije unapred',
                    'Podrška korisničkom servisu 24/7',
                    'Jednostavna online rezervacija',
                    'Mogućnost otkazivanja bez naknade'
                ],
                image: image1,
                text: 'Priduži se'
            },
            {
                title: 'STANDARD',
                price: 'KM50',
                features: [
                    'Pristup standardnim i premium terenima',
                    'Prioritetna rezervacija termina',
                    'Više opcija lokacija',
                    'Podrška korisničkom servisu 24/7',
                    'Posebne ponude i popusti'
                ],
                image: image2,
                text: 'Priduži se'
            },
            {
                title: 'PREMIUM',
                price: 'KM60',
                features: [
                    'Pristup svim terenima i dodatnim sadržajima',
                    'VIP podrška i personalizovane usluge',
                    'Luksuzne lokacije i ekskluzivni termini',
                    'Specijalne ponude za članove',
                    'Uključena premium sportska oprema'
                ],
                image: image3,
                text: 'Priduži se'
            },
        ]
    }
}

export default function SubscriptionPlans() {
    const { language } = useContext(LanguageContext);

    return (
        <Grid container spacing={3} sx={{ padding: 3, marginBottom: '10vh', marginTop: '10vh' }}>
            {content[language].plans.map((plan, index) => (
                <Grid item xs={12} sm={4} key={index}>
                    <SubscriptionCard {...plan} />
                </Grid>
            ))}
        </Grid>
    );
};

