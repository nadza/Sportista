import {Modal, Box, Button} from '@mui/material';
import React from 'react';
import {colors} from '../../../colors.js';
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
        see_more: "See more",
        sports: "Sports",
        description: "Description",
        close: "Close"
    },
    bs: {
        see_more: "Više",
        sports: "Sportovi",
        description: "Opis",
        close: "Zatvori"
    }
}

export default function SeeMoreModal({description, sports}) {
    const { language } = useContext(LanguageContext);
    const [seeMoreModal, setSeeMoreModal] = React.useState(false);
    const showSeeMoreModal = () => {
        setSeeMoreModal(true);
    };
    const closeSeeMoreModal = () => {
        setSeeMoreModal(false);
    };

    return(
        <div style={{ textAlign: 'center' }}>
            <Button sx={{color: colors.CHILI_RED}} onClick={showSeeMoreModal}>
                {content[language].see_more}
            </Button>
            <Modal open={seeMoreModal} onClose={closeSeeMoreModal}>
                <Box sx={modalStyle}>
                    <h2>{content[language].sports}</h2>
                    <p>{sports}</p>
                    <h2>{content[language].description}</h2>
                    <p>{description}</p>
                    <Button variant="contained" sx={{
                            background: colors.CHILI_RED, 
                            color: colors.WHITE,
                            '&:hover': {
                            background: colors.WHITE,
                            color: colors.CHILI_RED}}}  
                    onClick={closeSeeMoreModal}>
                        {content[language].close}
                    </Button>
                </Box>   
            </Modal>
        </div>
    )

}