import React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import loader from '../../assets/loading.gif';

export default function Gallery({ name }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [newImageId, setNewImageId] = React.useState([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/get_company_photos/${name}`, { withCredentials: true });
      setData(response.data); // Update data with response
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [name]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setEditMode(false);
  };

  async function fetchOldDeleteNow() {
    setLoading(true);
    try {
      console.log("datica", newImageId)
      const data = { pictures: Array.isArray(newImageId) ? newImageId : [newImageId] }
      console.log("DQATAAA", data)
      const response = await axios.delete(`http://localhost:8000/delete_company_pictures/${name}`, {
        data,
        withCredentials: true
      });
      fetchData()
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchOldDeleteNow();
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
  
    try {
      const company = await axios.get(`http://localhost:8000/get_user_id/${name}`, { withCredentials: true });
      const formData = new FormData();
      formData.append('folder', 'company_pictures');
      formData.append('company_id', company.data);
  
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
  
      const response = await axios.post('http://localhost:8000/upload_company_pictures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
  
      console.log("Files uploaded successfully:", response.data.pictures);
      const pictureLinks = response.data.pictures.map(picture => picture.picture_link);
      const pictureIds = response.data.pictures.map(picture => picture.picture_id);
      setNewImageId(pictureIds);
      setData(data => [...data, ...pictureLinks]);
    } catch (error) {
      console.log("Error uploading files:", error);
    }
  };
  

  return (
    <Box sx={{ marginBottom: '20vh', marginLeft: '5vh', marginTop: '5vh', flexGrow: 1 }}>
      {!loading && !editMode && (
        <IconButton onClick={handleEdit} sx={{ alignSelf: 'flex-end', marginBottom: 2, marginRight: 4, marginTop: 2 }}>
          <EditIcon fontSize='large' sx={{ color: '#e63825' }} />
        </IconButton>
      )}
      {editMode ? (
        <Box sx={{ display: 'flex', alignSelf: 'flex-end', marginBottom: 2, marginRight: 4 }}>
          <IconButton component="label">
            <FileUploadIcon fontSize='large' sx={{ color: '#e63825' }} />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
              multiple
            />
          </IconButton>
          <IconButton onClick={handleSave}>
            <SaveIcon fontSize='large' sx={{ color: '#e63825' }} />
          </IconButton>
          <IconButton onClick={handleCancel}>
            <CloseIcon fontSize='large' sx={{ color: '#e63825' }} />
          </IconButton>
        </Box>
      ) : null}
      <Grid
        container
        spacing={2} // General spacing for rows
        columnSpacing={{ xs: 1, sm: 2, md: 3 }} // Specific spacing for columns
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {loading ? (
          <Grid
            item xs={12}
            style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
          >
            <img src={loader.src} alt="Loading..." style={{ height: '10vh' }} />
          </Grid>
        ) : ( 
          data.map((item, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Card sx={{ maxWidth: 400, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={item}
                />
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
  
}
