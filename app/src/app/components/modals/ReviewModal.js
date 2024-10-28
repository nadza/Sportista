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
    border: '2px solid #e63825',
    boxShadow: 24,
    p: 4,
};

const content = {
    en: {
        user: "User",
        grade: "Grade",
        review: "Review",
        submit: "Submit",
        close: "Close"
    },
    bs: {
        user: "Korisnik",
        grade: "Ocjena",
        review: "Recenzija",
        submit: "Pošalji",
        close: "Zatvori"
    }
}


export default function ReviewModal({team_name}) {
    const { language } = useContext(LanguageContext);
    const [reviewModal, setReviewModal] = React.useState(false);
    const [teamMembers, setTeamMembers] = React.useState([]);
    const [selectedGrade, setSelectedGrade] = React.useState('');
    const [review, setReview] = React.useState('')
    const [selectedMember, setSelectedMember] = React.useState('');
    const showReviewModal = () => {
        setReviewModal(true);
        fetchData();
    };
    const closeReviewModal = () => {
        setReviewModal(false);
    };

    const handleKeyDown = (event) => {
        event.preventDefault();
      };

    const handleSubmit = async () => {
        try {
            const reviewData = {
                review_taker: selectedMember,
                grade: selectedGrade,
                review: review,
            };
            await axios.post("http://localhost:8000/add_user_review", reviewData, { withCredentials: true });
            closeReviewModal();
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


    async function fetchData() {
        try {
            const response = await axios.get(`http://localhost:8000/team_members/${team_name}`, { withCredentials: true });
            setTeamMembers(response.data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return(
        <div style={{ textAlign: 'center' }}>
            <Button variant="contained"
             sx={{
                    background: colors.CHILI_RED, 
                    color: colors.WHITE,
                    '&:hover': {
                    background: colors.WHITE,
                    color: colors.CHILI_RED}}} 
                onClick={showReviewModal}>
                {content[language].review}
            </Button>
            <Modal open={reviewModal} onClose={closeReviewModal}>
                <Box sx={modalStyle}>
                    <Autocomplete
                       options={teamMembers}
                        getOptionLabel={(option) => option || ""}
                        value={selectedMember}
                        onChange={(event, value) => setSelectedMember(value)}
                        renderInput={(params) => <TextField {...params} label={content[language].user} />}
                        sx={{ mb: 2 }} 
                    />
                    <TextField
                    label={content[language].grade}
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 5, step: "0.5" } }}
                    value={selectedGrade}
                    onChange={(event) => setSelectedGrade(event.target.value)}
                    variant="outlined"
                    onKeyDown={handleKeyDown}
                    sx={{mb: 2}}
                    fullWidth
                    />
                    <TextField
                    label={content[language].review}
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{mb:2}}
                    fullWidth
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="contained" onClick={handleSubmit}
                            sx={{
                                  background: colors.CHILI_RED, 
                                  color: colors.WHITE,
                                  '&:hover': {
                                    background: colors.WHITE,
                                    color: colors.CHILI_RED}}}>
                                {content[language].submit}
                            </Button>
                            <Button id="close-button" variant="outlined" onClick={closeReviewModal} 
                                sx={{background: colors.WHITE, color: colors.CHILI_RED, borderColor: colors.WHITE,'&:hover': {borderColor: colors.CHILI_RED}}}>
                                {content[language].close}
                            </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
} 