"use client"

import * as React from "react";
import { TextField, Autocomplete, Button, Box} from "@mui/material";
import axios from "axios";
import { colors } from '../../colors.js'
import AreaCard from "../components/cards/AreaCard.js";
import FilterModal from "../components/modals/FilterModal.js";
import dynamic from 'next/dynamic';
import loader from '../assets/loading.gif';
import { Grid } from '@mui/material';
import Navbar from '../components/navbar/navbar'
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const DynamicMap = dynamic(() => import('../mapa_terena/page'), { ssr: false });

const content = {
    en: {
        area: "Area",
        search: "Search"
    },
    bs: {
        area: "Teren",
        search: "Pretraga"
    }
};

export default function SearchAreas() {
    const { language } = useContext(LanguageContext);
    const [area_id, setArea] = React.useState('');
    const [listOfAreas, setListOfAreas] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const handleAreaChange = (event, value) => {
        setArea(value ? value.name : '');
    };

    async function fetchData() {
        try {
            const response = await axios.get("http://localhost:8000/korisnici", { withCredentials: true });
            const areas = response.data.tereni;
            const transformedAreaRows = areas.map(row => {
                const { area_id, ...rest } = row;
                return {
                    id: area_id,
                    ...rest
                };
            });
            setListOfAreas(transformedAreaRows);
        } catch (error) {
            console.error("Error Message:", error.message);
            console.error("Error Code:", error.code);
            console.error("Error Config:", error.config);
            console.error("Error Request:", error.request);
        } 
        try {
            const response = await axios.get("http://localhost:8000/search_areas", {withCredentials: true})
            const transformedAreaRows = response.data.map(row => {
                const { area_id, ...rest } = row;
                return {
                    id: area_id,
                    ...rest
                };
            });
            setSearchResults(transformedAreaRows);
            setLoading(false);
        } catch(error) {
            console.log("Error: " + error)
        }
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.get("http://localhost:8000/search_areas", {
                params: {name: area_id},
                withCredentials: true
            });
            console.log(response.data)
            const transformedAreaRows = response.data.map(row => {
                const { area_id, ...rest } = row;
                return {
                    id: area_id,
                    ...rest
                };
            });
            setSearchResults(transformedAreaRows);
        } catch (error) {
            console.log("Error: " + error);
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
                <Autocomplete
                    id="select-area-id"
                    options={listOfAreas}
                    getOptionLabel={(option) => option.name}
                    value={listOfAreas.find(area => area.name === area_id) || null}
                    onChange={handleAreaChange}
                    renderInput={(params) => <TextField {...params} label={content[language].area} sx={{width: 400}}/>}
                />
                <Button sx={{ paddingRight: 2, color: colors.CHILI_RED, '&:hover': {background: colors.CHILI_RED, color: colors.WHITE} }} onClick={handleSubmit}>{content[language].search}</Button>
                <FilterModal setSearchResults={setSearchResults}/>
            </Box>

            <Box sx={{ marginTop: '7vh', marginLeft: 2, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {loading ? (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '78vh',}}>                
                <img src={loader.src} alt="Loading..." style={{ height: '10vh' }} />
            </Grid>
            ) : (
            searchResults.map(area => ( 
            <AreaCard
                key={area.id}
                name={area.name}
                location={area.location_info}
                type ={area.area_type}
                owner = {area.owner_company}
                description= {area.description}
                sports = {area.sports}
                style={{ flex: '1 1 50%', maxWidth: '50%' }}
            />
            )))}
            </Box>
            <DynamicMap />
        </div>
    );
}