import { useState, useEffect } from "react";
import { Button, Modal, Box, TextField, IconButton, InputLabel, MenuItem, FormControl, Select, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { colors } from '../../../colors.js';
import { useContext } from "react";
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
        create_area: "Create area",
        name: "Name",
        location: "Location",
        description: "Description",
        area_type: "Area type",
        save: "Save",
        close: "Close"
    },
    bs: {
        create_area: "Kreiraj teren",
        name: "Naziv",
        location: "Lokacija",
        description: "Opis",
        area_type: "Tip terena",
        save: "Spasi",
        close: "Zatvori"
    }
}

export default function AreaModal({ onAreaAdded }) {
    const {language} = useContext(LanguageContext)
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [locationInfo, setLocationInfo] = useState('');
    const [areaType, setAreaType] = useState('');
    const [areaTypes, setAreaTypes] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchAreaTypes = async () => {
            try {
                const response = await axios.get("http://localhost:8000/get_area_types", { withCredentials: true });
                setAreaTypes(response.data);
            } catch (error) {
                console.error("Error fetching area types: ", error);
            }
        };

        fetchAreaTypes();
    }, []);

    const handleSubmit = async () => {
        try {
            const userResponse = await axios.get('http://localhost:8000/user_info', { withCredentials: true });
            const user = userResponse.data;
            const areaData = {
                name,
                description,
                location_info: locationInfo,
                grade: "0",  // ensure grade is a string
                area_type_id: areaType
            };
            await axios.post(`http://localhost:8000/create-area/${user.user_id}`, areaData, { withCredentials: true });
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
                    <DialogTitle>{content[language].create_area}</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        required
                        id="name"
                        name="name"
                        label={content[language].name}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                    />

                    <TextField
                        required
                        id="location_info"
                        name="location_info"
                        label={content[language].location}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={locationInfo}
                        onChange={(e) => setLocationInfo(e.target.value)}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                    />

                    <TextField
                        required
                        id="description"
                        name="description"
                        label={content[language].description}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                    />
                        <FormControl fullWidth style={{ marginTop: '1vh'}}>
                            <InputLabel id="select-area-type">{content[language].area_type}</InputLabel>
                            <Select
                                labelId="select-area-type"
                                id="area_type"
                                value={areaType}
                                label="Area type"
                                required
                                onChange={(e) => setAreaType(e.target.value)}
                            >
                                {areaTypes.map(type => (
                                    <MenuItem key={type.id} value={type.area_type_id}>{type.name}</MenuItem>
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
