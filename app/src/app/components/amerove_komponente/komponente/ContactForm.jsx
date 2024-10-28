"use client"
import React, { useContext } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import backgroundImage from "../imgs/lopte.jpg";
import { LanguageContext } from '../../../context/LanguageContext';

const ContactForm = () => {
    const { language } = useContext(LanguageContext);

    return (
        <Box sx={{
            backgroundImage: `url(${backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '40px',
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '-5vh'
        }}>
            <Box sx={{ width: { xs: '100%', sm: '60%', md: '40%' }, backgroundColor: 'rgba(0,0,0,0.7)', padding: 4, borderRadius: 2 }}>
                <Typography variant="h5" component="h2" color="white" gutterBottom>
                    {language === 'en' ? 'Contact Us' : 'Kontaktiraj nas'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={language === 'en' ? 'Name' : 'Ime'}
                            variant="outlined"
                            size="small"
                            sx={{
                                background: 'white',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '5px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={language === 'en' ? 'Phone' : 'Telefon'}
                            variant="outlined"
                            size="small"
                            sx={{
                                background: 'white',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '5px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={language === 'en' ? 'Email' : 'Email'}
                            variant="outlined"
                            size="small"
                            sx={{
                                background: 'white',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '5px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={language === 'en' ? 'Subject' : 'Naslov'}
                            variant="outlined"
                            size="small"
                            sx={{
                                background: 'white',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '5px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={language === 'en' ? 'Message' : 'Poruka'}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={4}
                            sx={{
                                background: 'white',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '5px',
                                },
                            }}
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, backgroundColor: '#D32F2F', width: '100%' }}
                    endIcon={<span>&#9654;</span>} // Play icon (triangle)
                >
                    {language === 'en' ? 'Send' : 'Pošalji'}
                </Button>
            </Box>
        </Box>
    );
};

export default ContactForm;
