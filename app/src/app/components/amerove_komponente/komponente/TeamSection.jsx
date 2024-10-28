"use client"
import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar, IconButton, Box } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { useContext } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';


const TeamMemberCard = ({ name, role, image, socials }) => {
    return (
        <Card sx={{ maxWidth: 330, margin: 1, backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        alt={name}
                        src={image}
                        sx={{ width: 120, height: 120, marginBottom: 2 }}
                    />
                    <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                        {name}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'white', marginBottom: 2 }}>
                    {role}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {socials.map((social, index) => (
                        <IconButton key={index} component="a" href={social.link} target="_blank" sx={{ color: 'white' }}>
                            {social.icon}
                        </IconButton>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

const TeamSection = () => {
    const { language } = useContext(LanguageContext);
    
    const content = {
        en: {
            teamMembers: [
                {
                    name: 'Nadža Zahiragić',
                    role: 'Project Lead',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/nadza' },
                        { icon: <Twitter />, link: 'https://twitter.com/nadza' },
                        { icon: <Instagram />, link: 'https://instagram.com/nadza' }
                    ]
                },
                {
                    name: 'Aldin Kajmović',
                    role: 'Project Lead',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/aldin' },
                        { icon: <Twitter />, link: 'https://twitter.com/aldin' },
                        { icon: <Instagram />, link: 'https://instagram.com/aldin' }
                    ]
                },
                {
                    name: 'Amer Zejnić',
                    role: 'Project Team Member',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/amer' },
                        { icon: <Twitter />, link: 'https://twitter.com/amer' },
                        { icon: <Instagram />, link: 'https://instagram.com/amer' }
                    ]
                },
                {
                    name: 'Asmir Zukić',
                    role: 'Project Team Member',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/asmir' },
                        { icon: <Twitter />, link: 'https://twitter.com/asmir' },
                        { icon: <Instagram />, link: 'https://instagram.com/asmir' }
                    ]
                },
                {
                    name: 'Karlo Blaškić',
                    role: 'Project Team Member',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/karlo' },
                        { icon: <Twitter />, link: 'https://twitter.com/karlo' },
                        { icon: <Instagram />, link: 'https://instagram.com/karlo' }
                    ]
                },
            ]
            
        },

        bs: {
            teamMembers: [
                {
                    name: 'Nadža Zahiragić',
                    role: 'Lider projekta',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/nadza' },
                        { icon: <Twitter />, link: 'https://twitter.com/nadza' },
                        { icon: <Instagram />, link: 'https://instagram.com/nadza' }
                    ]
                },
                {
                    name: 'Aldin Kajmović',
                    role: 'Lider projekta',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/aldin' },
                        { icon: <Twitter />, link: 'https://twitter.com/aldin' },
                        { icon: <Instagram />, link: 'https://instagram.com/aldin' }
                    ]
                },
                {
                    name: 'Amer Zejnić',
                    role: 'Član tima za projekat',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/amer' },
                        { icon: <Twitter />, link: 'https://twitter.com/amer' },
                        { icon: <Instagram />, link: 'https://instagram.com/amer' }
                    ]
                },
                {
                    name: 'Asmir Zukić',
                    role: 'Član tima za projekat',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/asmir' },
                        { icon: <Twitter />, link: 'https://twitter.com/asmir' },
                        { icon: <Instagram />, link: 'https://instagram.com/asmir' }
                    ]
                },
                {
                    name: 'Karlo Blaškić',
                    role: 'Član tima za projekat',
                    image: '',
                    socials: [
                        { icon: <Facebook />, link: 'https://facebook.com/karlo' },
                        { icon: <Twitter />, link: 'https://twitter.com/karlo' },
                        { icon: <Instagram />, link: 'https://instagram.com/karlo' }
                    ]
                },
            ]
        }
    }

    return (
        <Box sx={{ backgroundColor: '#D32F2F', padding: 1, paddingTop: '5vh' }}>
            <Typography variant="h4" component="div" sx={{ textAlign: 'center', color: 'white', margin:1 }}>
                {language === 'en' ? 'Project team' : 'Tim za projekat'}
            </Typography>
            <Grid container spacing={1} justifyContent="center">
                {content[language].teamMembers.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                        <TeamMemberCard {...member} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TeamSection;
