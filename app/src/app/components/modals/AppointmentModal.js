import { useState, useEffect, useContext } from "react";
import { Button, Modal, Box, Autocomplete, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { colors } from '../../../colors.js';
import { LanguageContext } from "../../context/LanguageContext.js";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #e63825',
    boxShadow: 24,
    p: 4,
};

const content = {
    en: {
        create_app: "Create Appointment",
        creating_app: "Creating appointment",
        area: "Area",
        team: "Team",
        datetime: "Date and time",
        submit: "Submit",
        close: "Close"
    },
    bs: {
        create_app: "Kreiraj termin",
        creating_app: "Kreiranje termina",
        area: "Teren",
        team: "Tim",
        datetime: "Datum i vrijeme",
        submit: "Pošalji",
        close: "Zatvori"

    }
}

export default function AppointmentModal() {
    const {language} = useContext(LanguageContext)
    const [open, setOpen] = useState(false);
    const [area, setArea] = useState(null);
    const [team, setTeam] = useState(null);
    const [dateTime, setDateTime] = useState(null);

    const [listOfAreas, setListOfAreas] = useState([]);
    const [listOfTeams, setListOfTeams] = useState([]);

    const handleAreaChange = (event, value) => {
        setArea(value);
    };

    const handleTeamChange = (event, value) => {
        setTeam(value);
    };

    const openPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
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
            console.log("Error: ", error);
        }
        try {
            const response = await axios.get("http://localhost:8000/user/teams", { withCredentials: true });
            const teams = response.data;
            const transformedTeamsRows = teams.map(row => {
                const { team_id, ...rest } = row;
                return {
                    id: team_id,
                    ...rest
                };
            });
            setListOfTeams(transformedTeamsRows);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const handleSubmit = async () => {
        const formattedDateTime = dateTime.format('YYYY-MM-DD HH:mm:ss');
        const appointmentData = {
            time: formattedDateTime,
            area_id: area ? area.id : '',
            team_id: team ? team.id : '',
        };
        console.log(appointmentData);
        try {
            await axios.post("http://localhost:8000/create_appointment", appointmentData, { withCredentials: true });
            closePopup();
        } catch (error) {
            if (error.response) {
                console.error("Data:", error.response.data);
                console.error("Status:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Button onClick={openPopup} sx={{background: colors.CHILI_RED, color: colors.WHITE, '&:hover': {color: colors.CHILI_RED}}}>{content[language].create_app}</Button>
            <Modal open={open} onClose={closePopup}>
                <Box sx={modalStyle}>
                    <DialogTitle>{content[language].creating_app}</DialogTitle>
                    <DialogContent>
                        <Autocomplete
                            options={listOfAreas}
                            getOptionLabel={(option) => option.name || ""}
                            value={area}
                            onChange={handleAreaChange}
                            renderInput={(params) => <TextField {...params} label={content[language].area} fullWidth />}
                            sx={{ mb: 2 }}
                        />
                        <Autocomplete
                            options={listOfTeams}
                            getOptionLabel={(option) => option.name || ""}
                            value={team}
                            onChange={handleTeamChange}
                            renderInput={(params) => <TextField {...params} label={content[language].team} fullWidth/>}
                            sx={{ mb: 2 }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label={content[language].datetime}
                                value={dateTime}
                                onChange={(newValue) => setDateTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth/>}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={handleSubmit}
                            sx={{
                                background: colors.CHILI_RED,
                                color: colors.WHITE,
                                '&:hover': {
                                    background: colors.WHITE,
                                    color: colors.CHILI_RED
                                }
                            }}>
                            {content[language].submit}
                        </Button>
                        <Button variant="outlined" onClick={closePopup}
                            sx={{
                                background: colors.WHITE,
                                color: colors.CHILI_RED,
                                borderColor: colors.WHITE,
                                '&:hover': {
                                    borderColor: colors.CHILI_RED
                                }
                            }}>
                            {content[language].close}
                        </Button>
                    </DialogActions>
                </Box>
            </Modal>
        </div>
    )
}