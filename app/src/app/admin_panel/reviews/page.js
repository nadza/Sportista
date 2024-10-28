"use client"
import React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from '../pdf';
import { colors } from '../../../colors.js';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import { useRouter } from 'next/navigation';

const content = {
  en: {
    report: "Report",
    review_taker: "Review taker",
    review_giver: "Review giver",
    grade: "Grade",
    review: "Review"
  },
  bs: {
    report: "Izvještaj",
    review_taker: "Primatelj recenzije",
    review_giver: "Davatelj recenzije",
    grade: "Ocjena",
    review: "Recenzija"
  }
}


export default function TabeleAdminPanelReviews() {
    const {language} = useContext(LanguageContext);
    const router = useRouter();
  
    const [reviewRows, setReviewRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
  
    React.useEffect(() => {
      axios.get('http://localhost:8000/korisnici').then(
        (response) => {
          const reviews = response.data.reviews;
          const users = response.data.users;

          const userIdToUsernameMap = users.reduce((acc, user) => {
            acc[user.user_id] = user.username;
            return acc;
          }, {});
  
          const transformedReviewRows = reviews.map(row => {
            const { user_review_id, review_giver, review_taker, ...rest } = row;
            return {
              id: user_review_id,
              review_giver: userIdToUsernameMap[review_giver],
              review_taker: userIdToUsernameMap[review_taker],
              ...rest
            };
          });
  
          setReviewRows(transformedReviewRows);
        },
        (error) => {
          console.log("Error: ", error);
        });
    }, []);
  
    const reviewColumns = [
      {
        field: 'review_giver',
        headerName: `${content[language].review_giver}`,
        width: 150
      },
      {
        field: 'review_taker',
        headerName: `${content[language].review_taker}`,
        width: 150
      },
      {
        field: 'grade',
        headerName: `${content[language].grade}`,
        width: 150
      },
      {
        field: 'review',
        headerName: `${content[language].review}`,
        width: 150
      }
    ];
  
    return (
      <Box sx={{ bgcolor:"white", margin: "auto", height: 500,
        '& .actions': { color: 'text.secondary' },
        '& .textPrimary': { color: 'text.primary' },
      }}>
        <Button sx= {{color: colors.CHILI_RED}} onClick={() => generatePDF(language,"reviews",reviewRows)}>
        {content[language].report}
        </Button>
        <DataGrid
          rows={reviewRows}
          columns={reviewColumns}
        />
      </Box>
    );
  }
  