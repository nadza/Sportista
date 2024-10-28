import { useState, useEffect } from "react";
import { Button, Modal, Box, TextField, IconButton, InputLabel, MenuItem, FormControl, Select, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { colors } from '../../../colors.js';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';


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
        team: "Create team",
        team_name: "Team name",
        date: "Date",
        select_leader: "Select leader",
        sport_type: "Sport type",
        save: "Save",
        close: "Close"
    },
    bs: {
        team: "Kreiraj tim",
        team_name: "Naziv tima",
        date: "Datum",
        select_leader: "Odaberi vođu",
        sport_type: "Tip sporta",
        save: "Spasi",
        close: "Zatvori"
    }
}

export default function AreaModal({ onAreaAdded }) {
    const {language} = useContext(LanguageContext)
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const [teamName, setTeamName] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [sportType, setSportType] = useState('');
    const [leader, setLeader] = useState('');

    const [sportTypes, setSportTypes] = useState([]);
    const [leaders, setLeaders] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/korisnici", { withCredentials: true });
                const sports = response.data.sports;
                const vodje = response.data.users;
                setSportTypes(sports);
                setLeaders(vodje);
            } catch (error) {
                console.error("Error fetching sport types: ", error);
            }
        };

        fetchData();
 
    }, []);

    const handleSubmit = async () => {
        try {
            const sportID = sportType.toString();
            const teamData = {
                name:teamName,
                foundation_date:dateTime,
                leader:leader,
                sport_id: sportID
            };
            await axios.post('http://localhost:8000/create-team', teamData,{ withCredentials: true });
            
            handleClose();
            if (onAreaAdded) {
                onAreaAdded();  // Call the callback to notify area addition
            }
        } catch (error) {
            console.error("Error Message:", error.message);
        }
    };

    return (
        
        <div>
            <IconButton onClick={handleOpen}>
                <AddCircleIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
            </IconButton>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <DialogTitle>{content[language].team}</DialogTitle>
                    <DialogContent>
                    
                    <TextField
                        autoFocus
                        required
                        id="teamName"
                        name="teamName"
                        label={content[language].team_name}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                    />

                    <TextField
                        autoFocus
                        required
                        id="dateTime"
                        name="dateTime"
                        label={content[language].date}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                    />

                        <FormControl fullWidth style={{ marginTop: '1vh'}}>
                            <InputLabel id="select-leader">{content[language].select_leader}</InputLabel>
                            <Select
                                labelId="select-leader"
                                id="leader"
                                value={leader}
                                label="Leader"
                                required
                                onChange={(e) => setLeader(e.target.value)}
                            >
                                {leaders.map(type => (
                                    <MenuItem key={type.user_id} value={type.user_id}>{type.username}</MenuItem> //ovdje provjeri je li okej ovaj key i value
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth style={{ marginTop: '1vh'}}>
                            <InputLabel id="select-sport-type">{content[language].sport_type}</InputLabel>
                            <Select
                                labelId="select-sport-type"
                                id="sport_type"
                                value={sportType}
                                label="Sport type"
                                required
                                onChange={(e) => setSportType(e.target.value)}
                            >
                                {sportTypes.map(type => (
                                    <MenuItem key={type.sport_id} value={type.sport_id}>{type.name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>

    
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
                            {content[language].save}
                        </Button>
                        <Button variant="outlined" onClick={handleClose}
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
    );
}
