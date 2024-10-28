import { useState, useEffect } from "react";
import { Button, Modal, Box, TextField, IconButton, InputLabel, MenuItem, FormControl, Select, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from 'axios';
import { colors } from '../../../colors.js';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const content = {
    en: {
      title: 'Add user(s)',
      user: 'User(s)'
    },
    bs: {
        title: 'Dodaj korisnika',
        user: 'Korisnik'
    }
  };

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

export default function NewChatModal({name}) {
    console.log("nameeee", name)
    const { language } = useContext(LanguageContext);

    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    console.log(selectedUsers)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setSelectedUsers([])
        setOpen(false);
    }

    async function fetchData() {
        try {
            const users = await axios.get(`http://localhost:8000/users-not-in-chat/${name}`, { withCredentials: true });
            setUsers(users.data.users);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [name]);

    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:8000/add-users-to-chat/${name}`, selectedUsers, { withCredentials: true });
            handleClose();
        } catch (error) {
            console.error("Error Message:", error.message);
        }
    };

    const handleUserSelection = (event) => {
        setSelectedUsers(event.target.value);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#e63825', marginLeft: 2 }}>
                <AddIcon fontSize='small' sx={{ color: '#fff'  }} />
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <DialogTitle>{content[language].title}</DialogTitle>
                    <DialogContent>

                        <FormControl fullWidth style={{ marginTop: '1vh'}}>
                            <InputLabel id="select-users">{content[language].user}</InputLabel>
                            <Select
                                required
                                labelId="select-users"
                                id="users"
                                multiple
                                value={selectedUsers}
                                onChange={handleUserSelection}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 224,
                                            width: 250
                                        }
                                    }
                                }}
                            >
                                {users.map(user => (
                                    <MenuItem key={user.user_id} value={user.username}>
                                        {user.username}
                                    </MenuItem>
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
                            <SaveIcon/>
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
                            <CloseIcon/>
                        </Button>
                    </DialogActions>
                </Box>
            </Modal>
        </div>
    );
}