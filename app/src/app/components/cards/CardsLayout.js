import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import loader from '../../assets/loading.gif';
import AppointmentCard from './AppointmentCard';
import UserReviewCard from './UserReviewCard';
import AreaCard from './AreaCard';
import Box from '@mui/material/Box';
import AreaModal from '../modals/AreaModal';

const CardsLayout = ({ type, show }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (username) => {
    setLoading(true);
    try {
      let response;
      if (type === 'appointment') {
        response = await axios.get(`http://localhost:8000/user_appointment/${username}`);
      } else if (type === 'review') {
        response = await axios.get(`http://localhost:8000/reviews/${username}`);
      } else if (type === 'area') {
        response = await axios.get(`http://localhost:8000/get_areas_by_company_name/${username}`);
      }
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginCookie = getCookie('login-cookie');
    const decodeCookieValue = (value) => {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    };

    if (loginCookie) {
      const username = JSON.parse(decodeCookieValue(loginCookie)).username;
      fetchData(username);
    } else {
      setData([]);
      setLoading(false);
    }
  }, [type]);

  const handleAreaAdded = () => {
    const loginCookie = getCookie('login-cookie');
    const decodeCookieValue = (value) => {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    };

    if (loginCookie) {
      const username = JSON.parse(decodeCookieValue(loginCookie)).username;
      fetchData(username);
    }
  };

  const renderCard = (item) => {
    if (type === 'appointment') {
      return (
        <AppointmentCard
          key={item.appointment_id}
          time={item.time}
          area_name={item.area_name}
          team_name={item.team_name}
          sport_name={item.sport_name}
          teamPlayerCount={item.teamPlayerCount}
          maxPlayerCount={item.maxPlayerCount}
          show={show}
        />
      );
    } else if (type === 'review') {
      return (
        <UserReviewCard
          key={item.user_review_id}
          review_giver={item.review_giver}
          review={item.review}
          grade={item.grade}
        />
      );
    } else if (type === 'area') {
      const prices = [10,15,17,20,22,25,30];
      const randomIndex = Math.floor(Math.random() * prices.length); 
      const randomPrice = prices[randomIndex]; 
      return (
        
        <AreaCard
          key={item.area_id}
          name={item.name}
          location={item.location}
          type={item.type}
          owner={item.owner}
          price = {randomPrice}

        />
      );
    }
    return null;
  };

  return (
    <Box marginBottom="50vh" justifyContent="center" marginTop="8vh">
      <Grid container spacing={0} justifyContent="center">
        {type === 'area' && (
          <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh'}}>
            <AreaModal onAreaAdded={handleAreaAdded}/>
          </Grid>
        )}
        {loading ? (
          <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <img src={loader.src} alt="Loading..." style={{ height: '10vh' }} />
          </Grid>
        ) : (
          data.map(item => renderCard(item))
        )}
      </Grid>
    </Box>
  );
};

export default CardsLayout;
