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
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const content = {
  en: {
    user_profile: 'User profile',
    first_name: 'First name',
    last_name: 'Last name',
    username: 'Username',
    email: 'E-mail',
    password: 'Password'
  },
  bs: {
    user_profile: 'Korisnički profil',
    first_name: 'Ime',
    last_name: 'Prezime',
    username: 'Korisničko ime',
    email: 'E-mail',
    password: 'Lozinka'
  }
};

const UserProfileCard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { language } = useContext(LanguageContext);  

  const [userInfo, setUserInfo] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    hashed_password: "",
  });

  const [originalUserInfo, setOriginalUserInfo] = React.useState({});
  const [editMode, setEditMode] = React.useState(false);
  const [userPhoto, setUserPhoto] = React.useState('/profile_pictures/dummy_pic.jpg'); 
  const [pictureId, setPictureId] = React.useState(null); 

  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:8000/user_info', { withCredentials: true });
      setUserInfo(response.data);
      setOriginalUserInfo(response.data);
      const photoResponse = await axios.get(`http://localhost:8000/get_user_photo/${response.data.username}`, { withCredentials: true });
      if (photoResponse.data.picture_link) {
        setUserPhoto(photoResponse.data.picture_link);
        setPictureId(photoResponse.data.picture_id); 
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8000/user_info_update', userInfo, { withCredentials: true });
      console.log("User info updated successfully:", response.data);

      if (pictureId) {
        console.log({ username: userInfo.username, picture_id: pictureId })
        const response_2 = await axios.put('http://localhost:8000/user_info_update_image', { username: userInfo.username, picture_id: pictureId });
        console.log("User image updated successfully:");
      } else {
        console.log("No picture_id available to update.");
      }

      setEditMode(false);
      setOriginalUserInfo(userInfo);
    } catch (error) {
      console.log("Error updating user info:", error);
    }
  };

  const fetchImg = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user_info', { withCredentials: true });
      const photoResponse = await axios.get(`http://localhost:8000/get_user_photo/${response.data.username}`, { withCredentials: true });
      if (photoResponse.data.picture_link) {
        setUserPhoto(photoResponse.data.picture_link);
        setPictureId(photoResponse.data.picture_id); 
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleCancel = () => {
    fetchImg();
    setUserInfo(originalUserInfo);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('folder', 'profile_pictures'); 
      formData.append('username', userInfo.username);
      formData.append('files', file);

      const response = await axios.post('http://localhost:8000/upload_picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      console.log("File uploaded successfully:", response.data);
      setPictureId(response.data.picture_id); 
      setUserPhoto(response.data.picture_link);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1,
        backgroundColor: '#fff', padding: 2, [theme.breakpoints.down('sm')]: { alignItems: 'center', padding: 0, boxShadow: 3 },
        margin: '5vh', marginTop: '10vh', marginBottom: '18vh'
      }}
    >
      <Box sx={{ alignSelf: 'flex-start', marginTop: 2 }}>
        <Typography sx={{
          display: 'flex', alignItems: 'center', marginLeft: 2, fontFamily: 'Teko', fontWeight: 400,
          fontSize: '250%', marginBottom: 5
        }}>
          <ScatterPlotIcon fontSize='large' sx={{ color: colors.CHILI_RED, marginRight: 1 }} /> {content[language].user_profile} </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
          <Box display="flex" justifyContent="center">
            <img
              src={userPhoto}
              alt="Profile picture"
              style={{
                width: '100%',   
                height: 'auto',  
                maxWidth: '40vh', 
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2} sx={{ padding: 5 }}>
            <Grid sx={{ marginLeft: isSmallScreen ? 2 : 0, marginRight: isSmallScreen ? 2 : 0 }} item xs={12} sm={6}>
              <TextField
                disabled={!editMode}
                id="standard-basic"
                label= {content[language].first_name}
                variant="outlined"
                fullWidth
                value={userInfo.first_name || ""}
                onChange={handleInputChange}
                name="first_name"
              />
            </Grid>
            <Grid sx={{ marginLeft: isSmallScreen ? 2 : 0, marginRight: isSmallScreen ? 2 : 0 }} item xs={12} sm={6}>
              <TextField
                disabled={!editMode}
                id="standard-basic"
                label= {content[language].last_name}
                variant="outlined"
                fullWidth
                value={userInfo.last_name || ""}
                onChange={handleInputChange}
                name="last_name"
              />
            </Grid>
            <Grid sx={{ marginLeft: isSmallScreen ? 2 : 0, marginRight: isSmallScreen ? 2 : 0 }} item xs={12} sm={6}>
              <TextField
                disabled={!editMode}
                id="standard-basic"
                label= {content[language].username}
                variant="outlined"
                fullWidth
                value={userInfo.username || ""}
                onChange={handleInputChange}
                name="username"
              />
            </Grid>
            <Grid sx={{ marginLeft: isSmallScreen ? 2 : 0, marginRight: isSmallScreen ? 2 : 0 }} item xs={12} sm={6}>
              <TextField
                disabled={!editMode}
                id="standard-basic"
                label= {content[language].email}
                variant="outlined"
                fullWidth
                value={userInfo.email || ""}
                onChange={handleInputChange}
                name="email"
              />
            </Grid>
            <Grid sx={{ marginLeft: isSmallScreen ? 2 : 0, marginRight: isSmallScreen ? 2 : 0 }} item xs={12} sm={6}>
              <TextField
                disabled={!editMode}
                id="standard-basic"
                label= {content[language].password}
                variant="outlined"
                fullWidth
                value={userInfo.hashed_password || ""}
                onChange={handleInputChange}
                name="hashed_password"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {editMode ? (
        <Box sx={{ display: 'flex', alignSelf: 'flex-end', marginBottom: 2, marginRight: 4, marginTop: 2 }}>
          <IconButton component="label">
            <FileUploadIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </IconButton>
          <IconButton onClick={handleSave}>
            <SaveIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
          </IconButton>
          <IconButton onClick={handleCancel}>
            <CloseIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
          </IconButton>
        </Box>
      ) : (
        <IconButton onClick={handleEdit} sx={{ alignSelf: 'flex-end', marginBottom: 2, marginRight: 4, marginTop: 2 }}>
          <EditIcon fontSize='large' sx={{ color: colors.CHILI_RED }} />
        </IconButton>
      )}
    </Box>
  );
};

export default UserProfileCard;
