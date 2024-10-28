"use client"
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '../../colors.js';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import {useEffect, useState} from 'react';
import { getCookie } from 'cookies-next';
import  axios  from 'axios'
import NewChatModal from '../components/modals/NewChatModal.js';


function MyBox ({colorL, content, username}){
  const backgroundColor = (colorL === 'Red') ?  '#e63825' : null;
  const color = (colorL === 'Red') ? '#fff' : '#000';
  return(
    <>
    <Box
      my={4}
      display="flex"
      alignItems="center"
      gap={4}
      p={2}
      sx={{ boxShadow: 3, backgroundColor: {backgroundColor}, borderRadius: '10px', maxWidth: '80%' }}
    >
      <Typography sx={{ color: {color}, overflowWrap: 'break-word', maxWidth: '100%' }}>
        {username}: {content}
      </Typography>
    </Box>
</>
  )
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
  backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
  marginLeft: theme.spacing(3),
  width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


export default function ChatBox() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { language } = useContext(LanguageContext);
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeChat, setActiveChat] = useState(0);
  const [chatNames, setChatNames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState('');

  const loginCookie = getCookie('login-cookie');
  const decodeCookieValue = (value) => {
    if(value != undefined)
      return decodeURIComponent(value.replace(/\+/g, ' '));
  };
  const username = JSON.parse(decodeCookieValue(loginCookie)).username;

  async function getChats(username){
    try{
      const response = await axios.get(`http://localhost:8000/chats/${username}`);
      return response.data;
    }
    catch(err){
      console.log(err);
    }
  }

  async function fetchChatsData(){
        const chats = await getChats(username);
        const ms = await fetchMessagesData(chats[activeChat]);
        setChatNames(chats);
        setMessages(ms);
      }

  async function getMessages(chatName, username){
    try{
      const response = await axios.get(`http://localhost:8000/chats/${username}/${chatName}`);
      return response.data;
    }
    catch(err){
      console.log(err);
    }
  }
  
  async function fetchMessagesData(chatName){
      const messages = await getMessages(chatName, username);
      return messages;
    }


  async function handleClick(i){
    if(activeChat === i) return;
    setActiveChat(i);
    const response = await axios.get(`http://localhost:8000/get-chat-participants/${chatNames[activeChat]}`);
    setParticipants(response.data.join(', '));
  }

  useEffect(
    () => {fetchChatsData();}, [activeChat]
  )
  return (
<Box
      sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1,
        backgroundColor: '#fff', padding: 2, [theme.breakpoints.down('sm')]: { alignItems: 'center', padding: 0, boxShadow: 3 },
        margin: '5vh', marginTop: '10vh', marginBottom: '10vh', boxShadow: 3
      }}
    >
      <Box sx={{ alignSelf: 'flex-start', marginTop: 2 }}>
        <Typography sx={{
          display: 'flex', alignItems: 'center', marginLeft: 2, fontFamily: 'Teko', fontWeight: 400,
          fontSize: '250%', marginBottom: 5
        }}>
          <ScatterPlotIcon fontSize='large' sx={{ color: colors.CHILI_RED, marginRight: 1 }} />
          {language === 'en' ? 'Messages' : 'Poruke'}
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ borderTop: '2px solid #e63825' }}>
        
        <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center', borderRight: !isXs ? '2px solid #e63825' : 'none' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2, marginRight: 2 }}>
            <Search sx={{ boxShadow: 3,  maxWidth: '100%', flexGrow: 1 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box>
              <NewChatModal/>
            </Box>
          </Box>
          <List
            dense
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              marginTop: '2vh',
              height: '50vh', // Adjust the height as needed
              overflowY: 'auto'
            }}
          >
            {chatNames.map((name, i) => {
              return (
                <ListItem key={name} disablePadding sx={{ margin: '1vh' }}>
                  <ListItemButton onClick = {() => handleClick(i)}>
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar n°${name + 1}`}
                        src='dummy_pic.jpg'
                      />
                    </ListItemAvatar>
                    <ListItemText id={name} primary={name} sx={{ color: (activeChat === i) ? '#e63825' : '#000' }}/>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Grid container spacing={2} sx={{ padding: 5,  }}>
            <Grid item xs={12} sx={{ padding: isXs ? 2 : 0 }}>
              <ListItem key='1' disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt='' src='' />
                  </ListItemAvatar>
                  <ListItemText id='1' primary={chatNames[activeChat]} secondary={participants} />
                </ListItemButton>
              </ListItem>
              {messages.map(m => {
                if(username === m.username){
                  return <MyBox colorL = 'Red' content = {m.content} username = {m.username}/>
                }
                else{
                  return <MyBox colorL = 'White' content = {m.content} username = {m.username}/>
                }
              })}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  hiddenLabel
                  id="filled-hidden-label-normal"
                  variant="filled"
                  sx={{ width: '80%', marginRight: '8px' }} // Adjust width as needed
                />
                <Button size="small" sx={{ minWidth: 0 }}>
                  <SendIcon sx={{ fontSize: 20, color: '#e63825' }} />
                </Button>
              </Box>

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  
  );
};