import React, { use } from 'react';
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
    email: "E-mail",
    phone_number: "Phone number",
    location: "Location",
    description: "Description"
  },
  bs: {
    company_profile: "Profil tvrtke",
    name: "Naziv",
    email: "E-mail",
    phone_number: "Telefonski broj",
    location: "Lokacija",
    description: "Opis"
  }
}

const DisplayCompanyCard = (obj) => {
  const {language} = useContext(LanguageContext)
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [companyInfo, setCompanyInfo] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    location: "",
    description: "",
    user_id: ""
  });

  const [originalCompanyInfo, setOriginalCompanyInfo] = React.useState({});
  const [editMode, setEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  async function fetchData() {
    try {
      const company_owner_profile = await axios.get(`http://localhost:8000/get_user_id/${obj.name}`, { withCredentials: true });
      const response = await axios.get(`http://localhost:8000/company_info/${company_owner_profile.data}`, { withCredentials: true });
      if (response.data) {
        console.log(response.data);
        setCompanyInfo(response.data);
        setOriginalCompanyInfo(response.data);
      } else {
        setCompanyInfo({ name: "", email: "", phone_number: "", location: "", description: "", user_id: company_owner_profile.data });
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
    setCompanyInfo({ ...companyInfo, [name]: value });
  };

  const handleSave = async () => {
    try {
      console.log("TUUUUUUUUUUUUUUUUUUUUUUUU", companyInfo)
      const response = await axios.put('http://localhost:8000/company_info_update', companyInfo, { withCredentials: true });
      console.log("Company info updated successfully:", response.data);

      setEditMode(false);
      setOriginalCompanyInfo(companyInfo);
    } catch (error) {
      console.log("Error updating user info:", error);
    }
  };

  const handleCancel = () => {
    setCompanyInfo(originalCompanyInfo);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  // Render the loading indicator if loading
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
          value={companyInfo.name || ""}
          onChange={handleInputChange}
          name="name"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled={!editMode}
          id="standard-basic"
          label={content[language].email}
          variant="outlined"
          fullWidth
          value={companyInfo.email || ""}
          onChange={handleInputChange}
          name="email"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled={!editMode}
          id="standard-basic"
          label={content[language].phone_number}
          variant="outlined"
          fullWidth
          value={companyInfo.phone_number || ""}
          onChange={handleInputChange}
          name="phone_number"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled={!editMode}
          id="standard-basic"
          label={content[language].location}
          variant="outlined"
          fullWidth
          value={companyInfo.location || ""}
          onChange={handleInputChange}
          name="location"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          disabled={!editMode}
          id="outlined-multiline-static"
          label={content[language].description}
          multiline
          rows={4}
          value={companyInfo.description || ""}
          onChange={handleInputChange}
          name="description"
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

export default DisplayCompanyCard;
