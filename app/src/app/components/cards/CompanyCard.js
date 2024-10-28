"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dummyCompanyPicture from '../../../profile_pictures/dummy_company_pic.jpg';
import Divider from '@mui/material/Divider';
import { colors } from '../../../colors.js'
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const content = {
  en: {
    name: "Name",
    email: "E-mail",
    phone_nmber: "Phone number",
    location: "Location"
  },
  bs: {
    name: "Naziv",
    email: "E-mail",
    phone_number: "Telefonski broj",
    location: "Lokacija"
  }
}
export default function CompanyCard() {
  const {language} = useContext(LanguageContext);
  return (
    <Card sx={{ width: 345, boxShadow: 3, borderRadius: '10%' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={dummyCompanyPicture.src}
        title="Company picture"
      />
      <CardContent sx={{ padding: 0 }} >
      <Typography sx={{ padding: 1, paddingTop: 2, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].name}  
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].email}
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].phone_number}
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
        <Divider/> 
        <Typography sx={{ padding: 1, paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 500 }}> 
        {content[language].location}
        <Typography component="span" sx={{ paddingLeft: 2, fontFamily: 'Ubuntu, sans-serif', fontWeight: 400, fontSize: '95%', align: 'justify'  }}> Lorem Ipsum </Typography>
      </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" sx={{ paddingRight: 2, color: colors.CHILI_RED }}>{content[language].see_more}</Button>
      </CardActions>

    </Card>
  );
}