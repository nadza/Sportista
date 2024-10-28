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
import { LastPageRounded } from '@mui/icons-material';

const content = {
  en: {
    record: "Add record",
    report: "Report",
    username: "Username",
    first_name: "First name",
    last_name: "Last name",
    email: "E-mail",
    password: "Password",
    action: "Action"
  },
  bs: {
    record: "Dodaj red",
    report: "Izvještaj",
    username: "Korisničko ime",
    first_name: "Ime",
    last_name: "Prezime",
    email: "E-mail",
    password: "Lozinka",
    action: "Akcija"
  }
}

function EditToolbar(props) {
  const {language} = props
  const { setUserRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setUserRows((oldRows) => [...oldRows, { id, username: '', first_name: '', last_name: '', email: '', hashed_password: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'username' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        {content[language].record}
      </Button>
      <Button  sx= {{color: colors.CHILI_RED}} onClick={() => generatePDF(language,"users",props.userRows)}>
        {content[language].report}
      </Button>
    </GridToolbarContainer>
  );
}


export default function TabeleAdminPanelUsers() {
  const {language} = useContext(LanguageContext)
  const router = useRouter();

  const [userRows, setUserRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(()=>{
    axios.get('http://localhost:8000/korisnici').then(
      (response) => {
        const users = response.data.users

        const transformedUserRows = users.map(row => { 
          const { user_id, ...rest } = row; 
          return {
            id: user_id, 
            ...rest 
          };
        });

        setUserRows(transformedUserRows)
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
    axios.delete(`http://localhost:8000/delete_user/${id}`).then(
      (response) => {
        const updatedRows = userRows.filter((row) => row.id !== id);
        setUserRows(updatedRows);
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

    const editedRow = userRows.find((row) => row.id === id);
    
    if (editedRow.isNew) {
      setUserRows(userRows.filter((row) => row.id !== id));
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const id = newRow.id

    axios.put(`http://localhost:8000/admin/update_user/${id}`, updatedRow).then(
      (response) => {
        const finalRow = {...updatedRow, id: response.data.user_id, hashed_password: response.data.hashed_password}
        setUserRows(userRows.map((row) => (row.id === newRow.id ? finalRow : row)));
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

  const userColumns = [
    {
      field: 'username',
      headerName: `${content[language].username}`,
      width: 150,
      editable: true,
    },
    {
      field: 'first_name',
      headerName: `${content[language].first_name}`,
      width: 150,
      editable: true,
    },
    {
      field: 'last_name',
      headerName: `${content[language].last_name}`,
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: `${content[language].email}`,
      width: 150,
      editable: true,
    },
    {
      field: 'hashed_password',
      headerName: `${content[language].password}`,
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
          rows={userRows}
          columns={userColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setUserRows, setRowModesModel, userRows, language },
          }}
        />
    
  </Box>
  );
}