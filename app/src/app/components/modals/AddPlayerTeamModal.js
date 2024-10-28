import { useState, useEffect } from "react";
import { Button, Modal, Box, TextField, IconButton, InputLabel, MenuItem, FormControl, Select, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { colors } from '../../../colors.js';
import { getCookie } from 'cookies-next';
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
        add_player: "Add player to team",
        team: "Team",
        player: "Player",
        save: "Save",
        close: "Close"
    },
    bs: {
        add_player: "Dodavanje igrača u tim",
        team: "Tim",
        player: "Igrač",
        save: "Spasi",
        close: "Zatvori"
    }
}

export default function AreaModal({ onAreaAdded }) {
    const {language} = useContext(LanguageContext)
    const [open, setOpen] = useState(false);

    const [team, setTeam] = useState('');
    const [player, setPlayer] = useState('');

    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/get-teams", { withCredentials: true });
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching team types: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                if (team) {                 
                    const res = await axios.get(`http://localhost:8000/get-player-list/${team}`, { withCredentials: true });
                    setPlayers(res.data);
                }
            } catch (error) {
                console.error("Error fetching player types: ", error);
            }
        };

        fetchPlayer();
    }, [team]); 



    const handleSubmit = async () => {
        try {
   
            const teamPlayerData = {
                user_id:player,
                team_id:team
            };
            await axios.post("http://localhost:8000/add_player_to_team", teamPlayerData, { withCredentials: true });
            
            handleClose();
            setTeam('');
            setPlayer('');
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
                    <DialogTitle>{content[language].add_player}</DialogTitle>
                    <DialogContent>

                    <FormControl fullWidth style={{ marginTop: '1vh'}}>
                            <InputLabel id="select-team">{content[language].team} </InputLabel>
                            <Select
                                labelId="select-team"
                                id="team"
                                value={team}
                                label="Team"
                                required
                                onChange={(e) => setTeam(e.target.value)}
                            >
                                {teams.map(type => (
                                    <MenuItem key={type.team_id} value={type.team_id}>{type.name}</MenuItem> 
                                ))}
                            </Select>
                        </FormControl>


                        {team && (
                            <FormControl fullWidth style={{ marginTop: '1vh' }}>
                                <InputLabel id="select-player">{content[language].player}</InputLabel>
                                <Select
                                    labelId="select-player"
                                    id="player"
                                    value={player}
                                    label="Player"
                                    required
                                    onChange={(e) => setPlayer(e.target.value)}
                                >
                                    {players.map(type => (
                                        <MenuItem key={type.user_id} value={type.user_id}>{type.username}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}




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
