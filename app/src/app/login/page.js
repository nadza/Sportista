"use client"

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from "axios";
import React from 'react';
import './../globals.css';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
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
        axios.post('http://localhost:8000/login', data,  {withCredentials: true}).then(
            (response) => {
                window.location.href = "/homepage";
                //router.push("/homepage");
            },
            (error) => {
              router.push("/login");
              console.log("Error: ", error);
            }
          );
      };

    return (
        <div className='wrapper'>
            <div className='login'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>
                        {language === 'en' ? 'Login' : 'Prijava'}
                    </h1>

                    <Box display="flex" flexDirection="column" alignItems="center" marginTop="4vh">
                        <div className='input-box'>
                            <TextField
                                required
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
                                type="password"
                                id="password"
                                label = {language === 'en' ? 'Password' : 'Lozinka'}
                                variant="outlined"
                                name="password"
                                {...register("password", { required: true })}
                            />
                        </div>
                        
                        <button type='submit'>
                            {language === 'en' ? 'Log In' : 'Prijavi se'}
                        </button>
                    </Box>

                    <div className='register-link' >
                        <p>
                            {language === 'en' ? "Don't have a profile?" : 'Nemaš profil?'}
                             <a href="/registration">
                                {language === 'en' ? ' Register!' : ' Registruj se!'}        
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
