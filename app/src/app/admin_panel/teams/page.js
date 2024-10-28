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
import {colors} from "../../../colors.js";
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
    record: "Add record",
    report: "Report",
    name: "Name",
    foundation: "Foundation date",
    leader: "Leader",
    sport: "Sport",
    action: "Action"
  },
  bs: {
    record: "Dodaj red",
    report: "Izvještaj",
    name: "Naziv",
    foundation: "Datum nastanka",
    leader: "Vođa",
    sport: "Sport",
    action: "Akcija"

  }
}

function EditToolbar(props) {
  const {language} = props
  const { setTeamRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setTeamRows((oldRows) => [...oldRows, { id, name: '', foundation_date: '', leader: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        {content[language].record}
      </Button>
      <Button sx={{color: colors.CHILI_RED}} onClick={() => generatePDF(language,"teams",props.teamRows)}>
        {content[language].report}
      </Button>
    </GridToolbarContainer>
  );
}


export default function TabeleAdminPanelTeams() {
  const {language} = useContext(LanguageContext)
  const router = useRouter();

  const [teamRows, setTeamRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(()=>{
    axios.get('http://localhost:8000/korisnici').then(
      (response) => {
        const teams = response.data.teams
        const users = response.data.users 
        const sports = response.data.sports

        const userIdToUsernameMap = users.reduce((acc, user) => {
            acc[user.user_id] = user.username;
            return acc;
          }, {});

          const sportIdToSportNameMap = sports.reduce((acc, sport) => {
            acc[sport.sport_id] = sport.name;
            return acc;
          }, {});



        const transformedTeamRows = teams.map(row => { 
          const { team_id,leader, sport_id, ...rest } = row; 
          return {
            id: team_id, 
            leader : userIdToUsernameMap[leader],
            sport_id : sportIdToSportNameMap[sport_id],
            ...rest 
          };
        });

        setTeamRows(transformedTeamRows)
      },
      (error) => {
        console.log("Error: ", error);
      })
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id) => () => {
    axios.delete(`http://localhost:8000/delete_team/${id}`).then(
      (response) => {
        const updatedRows = teamRows.filter((row) => row.id !== id);
        setTeamRows(updatedRows);
      },
      (error) => {
        console.log("Error: ", error);
      }
      );
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = teamRows.find((row) => row.id === id);
    
    if (editedRow.isNew) {
      setTeamRows(teamRows.filter((row) => row.id !== id));
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const id = newRow.id

    axios.put(`http://localhost:8000/admin/update_team/${id}`, updatedRow).then(
      (response) => {
        const finalRow = {...updatedRow, id: response.data.team_id}
        setTeamRows(teamRows.map((row) => (row.id === newRow.id ? finalRow : row)));
      },
      (error) => {
        console.log("Error: ", error);
      }
      );
    
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const teamColumns = [
    {
      field: 'name',
      headerName: `${content[language].name}`,
      width: 150,
      editable: true,
    },
    {
      field: 'foundation_date',
      headerName: `${content[language].foundation}`,
      width: 150,
      editable: true,
    },
    {
      field: 'leader',
      headerName: `${content[language].leader}`,
      width: 150,
      editable: true,
    },
    {
      field: 'sport_id',
      headerName: `${content[language].sport}`,
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: `${content[language].action}`,
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ bgcolor:"white", margin:"auto", height: 500,
        '& .actions': { color: 'text.secondary' },
        '& .textPrimary': { color: 'text.primary' },
      }}
    >
        <DataGrid 
          rows={teamRows}
          columns={teamColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setTeamRows, setRowModesModel, teamRows, language},
          }}
        />
    
  </Box>
  );
}