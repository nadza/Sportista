import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../../colors.js';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import loader from '../../assets/loading.gif'; 
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const content = {
  en: {
    company_profile: "Company profile",
    name: "Name",
    location: "Location",
    description: "Description",
    grade: "Grade",
    owner: "Owner"
  },
  bs: {
    company_profile: "Profil tvrtke",
    name: "Naziv",
    location: "Lokacija",
    description: "Opis",
    grade: "Ocjena",
    owner: "Vlasnik"

  }
}

const AreaDisplayCard = (obj) => {
  const {language} = useContext(LanguageContext)
  const theme = useTheme();

  const [areaInfo, setAreaInfo] = React.useState({
    name: "",
    description: "",
    location_info: "",
    grade: "",
    area_type: "",
    owner_company_id: ""
  });

  const [originalAreaInfo, setOriginalAreaInfo] = React.useState({});
  const [editMode, setEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:8000/get_area_info/${obj.obj}`, { withCredentials: true });
      const owner_company_name = await axios.get(`http://localhost:8000/company/info/${response.data.owner_company_id}`, { withCredentials: true });
      if (response.data) {
        const updatedAreaInfo = {
          ...response.data,
          owner_company_id: owner_company_name.data.name 
        };
        setAreaInfo(updatedAreaInfo);
        setOriginalAreaInfo(updatedAreaInfo);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAreaInfo({ ...areaInfo, [name]: value });
  };
  
  const handleSave = async () => {
    try {
      const { name, description, location_info } = areaInfo;
      const payload = {
        name,
        description,
        location_info,
      };
  
      const response = await axios.put(`http://localhost:8000/update_teren/${obj.obj}`, payload, { withCredentials: true });
      console.log("Area updated successfully:", response.data);
  
      setEditMode(false);
      setOriginalAreaInfo(areaInfo);
    } catch (error) {
      console.log("Error updating area:", error);
    }
  };
  

  const handleCancel = () => {
    setAreaInfo(originalAreaInfo);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  if (loading) {
    return (
      <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <img src={loader.src} alt="Loading..." style={{ height: '10vh' }} />
      </Grid>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1,
        backgroundColor: '#fff', padding: 3, paddingLeft: 10, paddingRight: 10, [theme.breakpoints.down('sm')]: { alignItems: 'center', padding: 0, boxShadow: 3 },
        margin: '5vh', marginTop: '10vh'
      }}
    >
      <Box sx={{ alignSelf: 'flex-start', marginTop: 2 }}>
        <Typography sx={{
          display: 'flex', alignItems: 'center', fontFamily: 'Teko', fontWeight: 400,
          fontSize: '250%', marginBottom: 5
        }}>
          <ScatterPlotIcon fontSize='large' sx={{ color: colors.CHILI_RED, marginRight: 1 }} /> {content[language].company_profile} </Typography>
      </Box>
        <TextField
          disabled={!editMode}
          id="standard-basic"
          label={content[language].name}
          variant="outlined"
          fullWidth
          value={areaInfo.name || ""}
          onChange={handleInputChange}
          name="name"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled={!editMode}
          id="standard-basic"
          label={content[language].location}
          variant="outlined"
          fullWidth
          value={areaInfo.location_info || ""}
          onChange={handleInputChange}
          name="location_info"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled={!editMode}
          id="standard-basic"
          label={content[language].description}
          variant="outlined"
          fullWidth
          value={areaInfo.description || ""}
          onChange={handleInputChange}
          name="description"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled
          id="standard-basic"
          label={content[language].grade}
          variant="outlined"
          fullWidth
          value={areaInfo.grade || ""}
          onChange={handleInputChange}
          name="grade"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled
          id="outlined-multiline-static"
          label={content[language].owner}
          multiline
          rows={4}
          value={areaInfo.owner_company_id || ""}
          onChange={handleInputChange}
          name="owner_company_id"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      {editMode ? (
        <Box sx={{ display: 'flex', alignSelf: 'flex-end', marginBottom: 2, marginTop: 2 }}>
          <IconButton onClick={handleSave}>
            <SaveIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
          </IconButton>
          <IconButton onClick={handleCancel}>
            <CloseIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
          </IconButton>
        </Box>
      ) : (
        <IconButton onClick={handleEdit} sx={{ alignSelf: 'flex-end', marginBottom: 2, marginTop: 2 }}>
          <EditIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
        </IconButton>
      )}
    </Box>
  );
};

export default AreaDisplayCard;
