import React from 'react';
import { Container, Grid } from '@mui/material';
import AppointmentCard from '../cards/AreaCard';

export default function Home() {
  return (
    <Container sx={{ margin: '10vh 1vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <AppointmentCard />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AppointmentCard />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AppointmentCard />
        </Grid>
      </Grid>
    </Container>
  );
}
