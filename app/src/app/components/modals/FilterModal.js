import React from "react";
import { Modal, Box, Autocomplete, TextField, Button} from "@mui/material";
import { colors } from '../../../colors.js';
import axios from "axios";
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const content = {
    en: {
        filter: "Filters",
        location: "Location",
        sport: "Sport",
        type: "Type",
        company: "Company",
        search: "Search",
        close: "Close"
    },
    bs: {
        filter: "Filtri",
        location: "Lokacija",
        sport: "Sport",
        type: "Tip",
        company: "Kompanija",
        search: "Pretraga",
        close: "Zatvori"
    }
}

export default function FilterModal({setSearchResults}) {
    const { language } = useContext(LanguageContext);
    const [locations, setLocations] = React.useState([]);
    const [sports, setSports] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [companies, setCompanies] = React.useState([]);

    const [selectedLocation, setSelectedLocation] = React.useState(null);
    const [selectedSport, setSelectedSport] = React.useState(null);
    const [selectedType, setSelectedType] = React.useState(null);
    const [selectedCompany, setSelectedCompany] = React.useState(null);

    const [filterModal, setFilterModal] = React.useState(false);
    const showFilterModal = () => {
        setFilterModal(true);
    };

    const closeFilterModal = () => {
        setFilterModal(false);
    };

    const handleSubmit = async () => {
        const filters = {
            location: selectedLocation ? selectedLocation : '',
            sport: selectedSport ? selectedSport : '',
            type: selectedType ? selectedType : '',
            company: selectedCompany ? selectedCompany : ''
        };
        
        try {
            const response = await axios.get("http://localhost:8000/search_areas", {
                params: filters,
                withCredentials: true
            });
            const transformedAreaRows = response.data.map(row => {
                const { area_id, ...rest } = row;
                return {
                    id: area_id,
                    ...rest
                };
            });
            setSearchResults(transformedAreaRows);
            closeFilterModal()
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    async function fetchData() {
        try {
            const response = await axios.get("http://localhost:8000/filter_data", { withCredentials: true });
            setLocations(response.data.locations);
            setSports(response.data.sports);
            setTypes(response.data.types);
            setCompanies(response.data.companies);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <Button variant="contained"
             sx={{
                    background: colors.CHILI_RED, 
                    color: colors.WHITE,
                    '&:hover': {
                    background: colors.WHITE,
                    color: colors.CHILI_RED}}} 
                onClick={showFilterModal}>
                {content[language].filter}
            </Button>
            <Modal open={filterModal} onClose={closeFilterModal}>
                <Box sx={modalStyle}>
                    <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => option || ""}
                        value={selectedLocation}
                        onChange={(event, value) => setSelectedLocation(value)}
                        renderInput={(params) => <TextField {...params} label={content[language].location} />}
                        sx={{ mb: 2 }} 
                    />
                    <Autocomplete
                        options={sports}
                        getOptionLabel={(option) => option || ""}
                        value={selectedSport}
                        onChange={(event, value) => setSelectedSport(value)}
                        renderInput={(params) => <TextField {...params} label={content[language].sport} />}
                        sx={{ mb: 2 }} 
                    />
                    <Autocomplete
                        options={types}
                        getOptionLabel={(option) => option || ""}
                        value={selectedType}
                        onChange={(event, value) => setSelectedType(value)}
                        renderInput={(params) => <TextField {...params} label={content[language].type} />}
                        sx={{ mb: 2 }} 
                    />
                    <Autocomplete
                        options={companies}
                        getOptionLabel={(option) => option || ""}
                        value={selectedCompany}
                        onChange={(event, value) => setSelectedCompany(value)}
                        renderInput={(params) => <TextField {...params} label={content[language].company} />}
                        sx={{ mb: 2}} 
                    />
                
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="contained" onClick={handleSubmit}
                            sx={{
                                  background: colors.CHILI_RED, 
                                  color: colors.WHITE,
                                  '&:hover': {
                                    background: colors.WHITE,
                                    color: colors.CHILI_RED}}}>
                                {content[language].search}
                            </Button>
                            <Button id="close-button" variant="outlined" onClick={closeFilterModal} 
                                sx={{background: colors.WHITE, color: colors.CHILI_RED, borderColor: colors.WHITE,'&:hover': {borderColor: colors.CHILI_RED}}}>
                                {content[language].close}
                            </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}