"use client";

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import dummyProfilePicture from '../../../profile_pictures/dummy_profile_pic.png';
import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '../../../colors.js'
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const content = {
  en: {
    name: "Name:",
    leader: "Leader:",
    sport: "Sport:",
    foundation: "Foundation date:",
    team_players: "Show team members"
  },
  bs: {
    name: "Naziv:",
    leader: "Vođa:",
    sport: "Sport",
    foundation: "Datum osnivanja",
    team_players: "Prikaži članove tima"
  }
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function TeamCard() {
  const {language} = useContext(LanguageContext)
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ width: 345, boxShadow: 3, borderRadius: '10%', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 3, paddingBottom: 1 }}>
        <CardMedia
          sx={{ height: 125, width: 125, borderRadius: '50%' }}
          image={dummyProfilePicture.src}
          title="user_giver_of_review_profile_picture"
        />
        
      </Box> 
      <CardContent sx={{ padding: 0 }} >
      <Divider/> 
      <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].name}   
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].leader} 
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].sport}  
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].foundation} 
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
      <Divider/> 
      </CardContent>
        <CardActions sx={{ paddingTop: 2}}>
          <Typography sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> {content[language].team_players} </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="See team players"
          >
          <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ paddingBottom: 1, fontFamily: 'Ubuntu, sans-serif', fontSize: '95%' }}>
          <Button variant="outlined" sx={{ marginTop: 1, marginLeft: 1, marginRight: 1, padding: '2%', fontSize: '60%', color: 'black', borderColor: colors.CHILI_RED}}>
            nadza.zahhhhhhhhhhhhhhhhhh
          </Button>
          <Button variant="outlined" sx={{ marginTop: 1, marginLeft: 1, marginRight: 1, padding: '2%', fontSize: '60%', color: 'black', borderColor: colors.CHILI_RED}}>
            adilovic.a
          </Button>
          <Button variant="outlined" sx={{ marginTop: 1, marginLeft: 1, marginRight: 1, padding: '2%', fontSize: '60%', color: 'black', borderColor: colors.CHILI_RED}}>
            kajma123
          </Button>
          <Button variant="outlined" sx={{ marginTop: 1, marginLeft: 1, marginRight: 1, padding: '2%', fontSize: '60%', color: 'black', borderColor: colors.CHILI_RED}}>
            emin_ema
          </Button>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}


