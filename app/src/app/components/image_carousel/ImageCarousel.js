import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import {colors} from '../../../colors'
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import firstPicture from './images/first.jpg';
import secondPicture from './images/second.jpg';
import thirdPicture from './images/third.jpg';
import { shadows } from '@mui/system';


export default function ImageCarousel() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeImage, setActiveImage] = React.useState(firstPicture);
  const images = [firstPicture, secondPicture, thirdPicture];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + images.length) % images.length);
  };

  React.useEffect(() => {
    setActiveImage(images[activeStep]);
  }, [activeStep, images]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  return (
    <Card sx={{ width: 'calc(100% - 45px)', borderRadius: 10, margin: 3, position: 'relative', boxShadow: 3 }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          sx={{ height: '85vh' }}
          image={activeImage.src}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 10,
            color: 'white',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
          }}
        >
          <Typography variant="h1" sx={{fontFamily: "Ubuntu", fontSize: '10vh'}}>Rezerviši svoj termin</Typography>
          <Typography variant="h1" sx={{fontFamily: "Ubuntu", fontSize: '15vh'}}> i IGRAJ!</Typography>
        </Box>
        <MobileStepper
          variant="dots"
          steps={images.length}
          position="static"
          activeStep={activeStep}
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 10,
            '& .MuiMobileStepper-dot': {
              backgroundColor: 'rgba(0, 0, 0, 0.26)'
            },
            '& .MuiMobileStepper-dotActive': {
              backgroundColor: colors.CHILI_RED
            },
          }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === images.length - 1}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft sx={{ color: colors.CHILI_RED }} />
              ) : (
                <KeyboardArrowRight sx={{ color: colors.CHILI_RED }} />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight sx={{ color: colors.CHILI_RED }} />
              ) : (
                <KeyboardArrowLeft sx={{ color: colors.CHILI_RED }} />
              )}
            </Button>
          }
        />
      </Box>
    </Card>
  );
}
