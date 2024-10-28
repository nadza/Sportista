"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dummyAreaPicture from '../../../profile_pictures/dummy_area_pic.jpg';
import Divider from '@mui/material/Divider';
import { colors } from '../../../colors.js'
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import SeeMoreModal from '../modals/SeeMoreModal';

const content = {
  en: {
    name: "Name:",
    location: "Location:",
    type: "Type:",
    owner: "Owner:"
  },
  bs: {
    name: "Naziv:",
    location: "Lokacija:",
    type: "Tip:",
    owner: "Vlasnik:"
  }
};

export default function AreaCard({name, location, type, owner, description, sports, price}) {
  const { language } = useContext(LanguageContext);

  return (
    <Card sx={{display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', 
      width: 345, 
      boxShadow: 3, 
      borderRadius: '10%', 
      margin: 2}}>
      <CardMedia
        sx={{ height: 140 }}
        image={dummyAreaPicture.src}
        title="Company picture"
      />
      <CardContent sx={{ padding: 0 }} >
      <Typography sx={{ padding: 1,  paddingTop: 2, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].name}   
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> {name} </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].location}
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> {location} </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].type}  
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> {type} </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].owner} 
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> {owner} </Typography>
      </Typography>
        <Divider/> 
      <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        Price: 
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> {price} $ </Typography>
      </Typography>
   
      
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <SeeMoreModal description={description} sports={sports}/>
      </CardActions>
    </Card>
  );
}