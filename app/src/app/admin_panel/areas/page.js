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
import {colors} from '../../../colors.js';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const content = {
  en: {
    record: "Add record",
    report: "Report",
    name: "Name",
    description: "Description",
    location: "Location info",
    grade: "Grade",
    action: "Action"
  },
  bs: {
    record: "Dodaj red",
    report: "Izvještaj",
    name: "Naziv",
    description: "Opis",
    location: "Lokacija",
    grade: "Ocjena",
    action: "Akcija"
  }
}

function EditToolbar(props) {
  const { language } = props; 
  const { setAreaRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setAreaRows((oldRows) => [...oldRows, { id, name: '', description: '', location_info: '', grade: '', isNew: true }]);
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
      <Button sx={{color: colors.CHILI_RED}} onClick={() => generatePDF(language,"areas",props.areaRows)}>
        {content[language].report}
      </Button>
    </GridToolbarContainer>
  );
}


export default function TabeleAdminPanel() {
  const {language} = useContext(LanguageContext);
  const router = useRouter();

  const [areaRows, setAreaRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  React.useEffect(()=>{
    axios.get('http://localhost:8000/korisnici').then(
      (response) => {
        const areas = response.data.tereni

        const transformedAreaRows = areas.map(row => { 
          const { area_id, ...rest } = row; 
          return {
            id: area_id, 
            ...rest 
          };
        });

        setAreaRows(transformedAreaRows)
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
    axios.delete(`http://localhost:8000/delete_teren/${id}`).then(
      (response) => {
        const updatedRows = areaRows.filter((row) => row.id !== id);
        setAreaRows(updatedRows);
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

    const editedRow = areaRows.find((row) => row.id === id);
    
    if (editedRow.isNew) {
      setAreaRows(areaRows.filter((row) => row.id !== id));
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const id = newRow.id

    axios.put(`http://localhost:8000/admin/update_teren/${id}`, updatedRow).then(
      (response) => {
        const finalRow = {...updatedRow, id: response.data.area_id}
        setAreaRows(areaRows.map((row) => (row.id === newRow.id ? finalRow : row)));
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

  const areaColumns = [
    {
      field: 'name',
      headerName: `${content[language].name}`,
      width: 150,
      editable: true,
    },
    {
      field: 'description',
      headerName: `${content[language].description}`,
      width: 150,
      editable: true,
    },
    {
      field: 'location_info',
      headerName: `${content[language].location}`,
      width: 150,
      editable: true,
    },
    {
      field: 'grade',
      headerName: `${content[language].grade}`,
      width: 150,
      editable: true
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
          rows={areaRows}
          columns={areaColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setAreaRows, setRowModesModel, areaRows, language},
          }}
        />
    
  </Box>
  );
}