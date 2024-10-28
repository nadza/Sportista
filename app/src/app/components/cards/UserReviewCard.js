"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import dummyProfilePicture from '../../../profile_pictures/dummy_profile_pic.png';
import '../../my_global.css';
import { colors } from '../../../colors.js'
import Rating from '@mui/material/Rating';

export default function UserReviewCard({ review_giver, grade, review }) {
  return (
    <Card sx={{ width: 345, height: 360, boxShadow: 3, borderRadius: '10%', position: 'relative', margin: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 3 }}>
        <CardMedia
          sx={{ height: 75, width: 75, borderRadius: '50%' }}
          image={dummyProfilePicture.src}
          title="user_giver_of_review_profile_picture"
        />
      </Box>
      <Typography sx={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: 2, fontFamily: 'Ubuntu, sans-serif', fontSize: '100%' }}>
        {review_giver}
      </Typography>
      <Box sx={{ textAlign: 'center', paddingTop: 1 }}>
        <Rating value={grade} readOnly />
      </Box>
      <CardContent sx={{ position: 'relative', padding: '35px 20px', overflow: 'hidden' }}>
        <FormatQuoteIcon
          sx={{ fontSize: 125, color: colors.CHILI_RED, transform: 'rotate(180deg)', position: 'absolute', top: 0, left: 0, zIndex: 1, opacity: 0.2 }}
        />
        <Box sx={{ height: 120, overflowY: 'auto', position: 'relative', zIndex: 2, paddingX: 2, paddingY: 1 }}>
          <Typography sx={{ textAlign: 'center', fontFamily: 'Ubuntu, sans-serif', fontSize: '95%' }}>
            {review}
          </Typography>
        </Box>
        <FormatQuoteIcon
          sx={{ fontSize: 125, color: colors.CHILI_RED, position: 'absolute', bottom: 0, right: 0, zIndex: 1, opacity: 0.2 }}
        />
      </CardContent>
    </Card>
  );
}
