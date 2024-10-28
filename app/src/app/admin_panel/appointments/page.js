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
import {colors} from "../../../colors.js";
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { generatePDF } from '../pdf';
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
    time: "Time",
    area_name: "Area",
    team_name: "Team",
    action: "Action"
  },
  bs: {
    record: "Dodaj red",
    report: "Izvještaj",
    time: "Vrijeme",
    area_name: "Teren",
    team_name: "Tim",
    action: "Akcija"
  }
}

function EditToolbar(props) {
  const {language} = props
  const { setAppointmentRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setAppointmentRows((oldRows) => [...oldRows, { id, time:'', area_id:'', team_id: '', isNew: true }]);
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
      <Button sx={{color: colors.CHILI_RED}} onClick={() => generatePDF(language,"appointments",props.appointmentRows)}>
        {content[language].report}
      </Button>
    </GridToolbarContainer>
  );
}


export default function TabeleAdminPanel() {
  const {language} = useContext(LanguageContext)
  const router = useRouter();

  const [appointmentRows, setAppointmentRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(()=>{
    axios.get('http://localhost:8000/korisnici').then(
      (response) => {
        const appointment = response.data.appointments

        if (!Array.isArray(appointment)) {
          console.error("Expected an array for 'appointment', but got:", appointment);
        } else {
        const transformedAppointmentRows = appointment.map(row => { 
          const { id, ...rest } = row; 
          return {
            id: id, 
            ...rest 
          };
        });

        setAppointmentRows(transformedAppointmentRows)
      } },
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
    axios.delete(`http://localhost:8000/delete_termin/${id}`).then(
      (response) => {
        const updatedRows = appointmentRows.filter((row) => row.id !== id);
        setAppointmentRows(updatedRows);
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

    const editedRow = appointmentRows.find((row) => row.id === id);
    
    if (editedRow.isNew) {
      setAppointmentRows(appointmentRows.filter((row) => row.id !== id));
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const id = newRow.id

    axios.put(`http://localhost:8000/admin/update_termin/${id}`, updatedRow).then(
      (response) => {
        const finalRow = {...updatedRow, id: response.data.appointment_id}
        setAppointmentRows(appointmentRows.map((row) => (row.id === newRow.id ? finalRow : row)));
      },
      (error) => {
        console.log("Error: ", error);
        console.log(error.response.data)
      }
      );
    
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const appointmentColumns = [
    {
      field: 'time',
      headerName: 'Time',
      headerName: `${content[language].time}`,
      width: 150,
      editable: true,
    },
    {
      field: 'area_id',
      headerName: 'Area',
      field: 'area_name',
      headerName: `${content[language].area_name}`,
      width: 150,
      editable: true,
    },
    {
      field: 'team_id',
      headerName: 'Team',
      field: 'team_name',
      headerName: `${content[language].team_name}`,
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
          rows={appointmentRows}
          columns={appointmentColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setAppointmentRows, setRowModesModel, appointmentRows, language },
          }}
        />
    
  </Box>
  );
}
