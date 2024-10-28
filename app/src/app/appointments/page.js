"use client"
import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppointmentCard from '../components/cards/AppointmentCard';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

export default function Proba() {
  const [appointments, setAppointments] = useState([]);

  useEffect(()=>{
    const loginCookie = getCookie('login-cookie')
    const decodeCookieValue = (value) => {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    };
    if (loginCookie) {
      const username = JSON.parse(decodeCookieValue(loginCookie)).username;

      axios.get(`http://localhost:8000/user_appointment/${username}`)
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('Greška prilikom dohvatanja termina:', error);
      });

    };

  },[]);

  return (
    <div>
        
        <Typography sx={{ fontFamily: 'Teko', fontSize: '300%', marginTop: 5, textAlign: 'center' }}> Termini: </Typography>
    <Box sx={{ marginLeft: 2, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
      {appointments.map(appointment => ( 
          <AppointmentCard
            key={appointment.appointment_id}
            time={appointment.time}
            area_name={appointment.area_name}
            team_name={appointment.team_name}
            sport_name ={appointment.sport_name}
            teamPlayerCount={appointment.teamPlayerCount}
            maxPlayerCount={appointment.maxPlayerCount}
            style={{ flex: '1 1 50%', maxWidth: '50%' }}
          />
        ))} 


    </Box>
    </div>
  );
};