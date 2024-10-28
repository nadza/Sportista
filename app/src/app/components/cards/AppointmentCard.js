"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PeopleIcon from '@mui/icons-material/People';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import { colors } from '../../../colors.js'
import Button from '@mui/material/Button'
import ReviewModal from '../modals/ReviewModal.js';

export default function AppointmentCard({time, area_name,team_name,sport_name, teamPlayerCount, maxPlayerCount, show}) {
    const appointmentTime = new Date(time);
    const currentTime = new Date();
  
    const appointmentHasPassed = appointmentTime < currentTime;
  
    return (
        <Card sx={{ width: 345,  boxShadow: 3, borderRadius: '10%', margin: 2,border: '2px solid transparent', transition: 'border-color 0.3s', 
            '&:hover': { borderColor: colors.CHILI_RED,  }}}>
        <CardContent sx={{ padding: 0 }} >
            <Box sx={{ display: 'flex',  padding: 2, paddingLeft: 2 }}> 
                <AccessTimeIcon />
                <Typography component="span" sx={{ paddingLeft: 1, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%' }}> {time} </Typography>
            </Box>
            <Divider/> 
            <Box sx={{ display: 'flex',  padding: 2, paddingLeft: 2 }}> 
                <FmdGoodIcon />
                <Typography component="span" sx={{ paddingLeft: 1, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%' }}> {area_name} </Typography>
            </Box>
            <Divider/> 
            <Box sx={{ display: 'flex',  padding: 2, paddingLeft: 2 }}> 
                <PeopleIcon />
                <Typography component="span" sx={{ paddingLeft: 1, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%' }}> {team_name} </Typography>
            </Box>
            <Divider/> 
            <Box sx={{ display: 'flex',  padding: 2, paddingLeft: 2 }}> 
                <SportsBasketballIcon />
                <Typography component="span" sx={{ paddingLeft: 1, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%' }}> {sport_name} </Typography>
            </Box>
            <Divider/> 
        </CardContent>
        <CardActions sx={{ padding: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'Teko, sans-serif', fontWeight: 400, fontSize: '140%' }}> {teamPlayerCount}/{maxPlayerCount} </Typography>
            { show === "true" && (
                    <IconButton>
                        <AddCircleIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
                    </IconButton>
                )}
            {appointmentHasPassed && (
                <ReviewModal team_name={team_name} />
            )}
        </CardActions>
    </Card>
  );
}