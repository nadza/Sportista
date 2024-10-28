
"use client"

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import "./style.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { Box } from "@mui/system";
function geocodeAddress(address) {
   
    const axios = require('axios');
    return axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            format: 'json',
            q: address
        }
    })
    .then(response => {
        const data = response.data;
        if (data && data.length > 0) {
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            return {address, latitude, longitude}
        } else {
            console.log(`Adresa "${address}" nije pronađena.`);
            return null;
        }
    })
    .catch(error => {
        console.error(`Greška prilikom geokodiranja adrese "${address}": `, error);
    });
}


async function geocodeAddresses(addresses,names) {
   
    const geocodedAddresses = [];
    for (let i=0; i < addresses.length; i++) {
         let result = await geocodeAddress(addresses[i])
        if (result && result.latitude && result.longitude) {
            geocodedAddresses.push({ ...result, name: names[i] });
        }
    }
      return geocodedAddresses;
}



export default function Map() {
    const [list, setList] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);


useEffect(() => {
    async function fetchData() {
        try {
            const citiesResponse = await axios.get('http://localhost:8000/cities');
            const cities = citiesResponse.data.cities.split(", ");
            const areas = await Promise.all(cities.map(async (city) => {
                const response = await axios.get(`http://localhost:8000/areamap/${city}`);
                return response.data;
            }));
            const areaAddresses = areas.flatMap(entry => entry.map(area => area.location_info));
            const areaNames = areas.flatMap(entry => entry.map(area => area.name));
            const geocodedAddresses = await geocodeAddresses(areaAddresses, areaNames);
            setList(geocodedAddresses);
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    fetchData();
}, []);


    return(
        <Box sx={{marginBottom: '-5vh'}}>
        <MapContainer center={[43.856430, 18.413029]} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {list.map((area) => (
                <Marker key={area.name} position={[area.latitude, area.longitude]} >
                    <Popup>{area.name}<br />{area.address}</Popup>
                </Marker>
            ))}
            </MapContainer>
        </Box>
    )
}