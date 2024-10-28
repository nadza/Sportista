"use client"

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import React from 'react';
import './../globals.css';
import './LoginRegister.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';


const LoginRegister = () => {
    const { register, handleSubmit, errors } = useForm();
    const router = useRouter();
    const { language, setLanguage } = useContext(LanguageContext);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
      };
  
    const onSubmit = (data) => {
  
      axios.post('http://localhost:8000/registration', data).then(
          (response) => {
            router.push('/login');
          },
          (error) => {
            console.log("Error: ", error);
          }
        );
  
    };
    return (
        <div className='wrapper'>
            <div className='login'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>
                        {language === 'en' ? 'Registration' : 'Registracija'}
                    </h1>

                    <Box display="flex" flexDirection="column" alignItems="center" marginTop="4vh">
                        <div className='input-box'>
                            <TextField
                                required
                                id="first_name"
                                label = {language === 'en' ? 'First name' : 'Ime'}
                                variant="outlined"
                                name="first_name"
                                {...register("first_name", { required: true })}
                            />
                        </div>

                        <div className='input-box'>
                            <TextField 
                                required
                                id="last_name"
                                label = {language === 'en' ? 'Last name' : 'Prezime'}
                                variant="outlined"
                                name="last_name"
                                {...register("last_name", { required: true })}
                            />
                        </div>

                        <div className='input-box'>
                            <TextField required
                                id="username"
                                label = {language === 'en' ? 'Username' : 'Korisničko ime'}
                                variant="outlined"
                                name="username"
                                {...register("username", { required: true })}
                            />
                        </div>

                        <div className='input-box'>
                            <TextField 
                                required
                                id="email"
                                label="Email"
                                variant="outlined"
                                name="email"
                                {...register("email", { required: true })}
                            />
                        </div>

                        <div className='input-box'>
                            <TextField 
                                required
                                type="password"
                                id="password"
                                label = {language === 'en' ? 'Password' : 'Lozinka'}
                                variant="outlined"
                                name="password"
                                {...register("password", { required: true })}
                            />
                        </div>

                        <Box sx={{ width: 245, marginBottom: '3vh' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    {language === 'en' ? 'Category' : 'Kategorija'}
                                </InputLabel>
                                <Select labelId="demo-simple-select-label" 
                                label = {language === 'en' ? 'Category' : 'Kategorija'}
                                {...register("user_role_id")}>
                                <MenuItem value={2}>
                                    {language === 'en' ? 'Player' : 'Igrač'}
                                </MenuItem>
                                <MenuItem value={3}>
                                    {language === 'en' ? 'Company' : 'Firma'}
                                </MenuItem>
                                </Select>
                            </FormControl>
                            </Box>

                        <button type='submit'>
                            {language === 'en' ? 'Register' : 'Registruj se'}
                        </button>
                    </Box>    

                    <div className='register-link' >
                        <p>
                            {language === 'en' ? "Have a profile?" : 'Imaš profil?'}
                             <a href="/registration">
                                {language === 'en' ? ' Log In!' : ' Loguj se!'}        
                            </a>
                        </p>
                    </div>

                    <div className='register-link' >
                        <Tooltip title="Change language to Bosnian" sx = {{magin:0,padding:0, width: '15px', minWidth: '15px', color: '#000'}}>
                            <Button variant="text" onClick={() => handleLanguageChange('bs')}>BS</Button>
                        </Tooltip>
                        <Tooltip title="Change language to English" sx = {{magin:0, marginLeft: '20px', marginRight: '20px', padding:0, width: '15px', minWidth: '15px', color: '#000'}}>
                            <Button variant="text" onClick={() => handleLanguageChange('en')}>EN</Button>
                        </Tooltip>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginRegister;
