"use client"

import * as React from "react";
import { TextField, Autocomplete, Button, Box} from "@mui/material";
import axios from "axios";
import { colors } from '../../colors.js'
import AppointmentCard from "../components/cards/AppointmentCard.js";
import FilterModal from "../components/modals/FilterModal.js";
import dynamic from 'next/dynamic';
import loader from '../assets/loading.gif';
import { Grid } from '@mui/material';
import Navbar from '../components/navbar/navbar'
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const content = {
    en: {
        area: "Area",
        search: "Search"
    },
    bs: {
        area: "Teren",
        search: "Pretraga"
    }
}

export default function SearchAppointments() {
    const {language} = useContext(LanguageContext)
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(true);


    async function fetchData() {
        try {
            
            const response = await axios.get("http://localhost:8000/search_appointments", {withCredentials: true})
            const transformedAppointmentRows = response.data.map(row => {
                const { appointment_id, ...rest } = row;
                return {
                    id: appointment_id,
                    ...rest
                };
            });
            setSearchResults(transformedAppointmentRows);
            setLoading(false);
        } catch(error) {
            console.log("Error: " + error)
        }
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
                flexGrow: 1, minWidth: 200,
                marginTop: '15vh'
            }}>
            </Box>

            <Box sx={{ marginTop: '7vh', marginLeft: 2, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {loading ? (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '78vh',}}>                
                <img src={loader.src} alt="Loading..." style={{ height: '10vh' }} />
            </Grid>
            ) : (
            searchResults.map(appointment => ( 
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
            )))}
            </Box>
        </div>
    );
}