import React, {useState, useEffect, useRef}  from 'react';
import { useForm, Link } from '@inertiajs/inertia-react';
import Nav from '@/Components/Nav';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import AppLogo from "../Components/AppLogo";

export default function Login ({ loginRoute, shopping_cart, categories, errors }) {

    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const RegisterForm = useForm({
        primary_contact_number: '',
    })

    function handleLogin(e) {
        e.preventDefault();
        post( loginRoute ?? route('login'),{
            onError: () => setData('password', '')
        });
    }

    function handleRegister(e) {
        e.preventDefault();
        RegisterForm.get(route('register'));
    }

    return (
        <Box className="w-full h-screen flex flex-col justify-center items-center">
            <AppLogo height="3rem" color="#ff7d17" show={true} />
            <Paper className="p-5 mt-5" elevation={5}>
            <form onSubmit={handleLogin}>
                <Stack
                    sx={{ minWidth: "300px"}}
                    spacing={2}>
                        <Typography  align="center">{trans('labels.Log in to continue')}</Typography>


                        { errors.email &&  <Typography variant="caption" color="error">{ errors.email }</Typography> }

                        <TextField
                            error={!! errors.email }
                            size="small"
                            required
                            autoFocus
                            label={trans('labels.Email or phone number')}
                            defaultValue={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <TextField

                            // color="secondary"
                            size="small"
                            required
                            label={trans('labels.Password')}
                            type="password"
                            defaultValue={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />

                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox
                                    defaultChecked={data.remember}
                                    onChange={e => setData('remember', e.target.value)}
                                />
                            } label={ trans('labels.Remember me')} />
                        </FormGroup>



                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={processing}
                        >
                            { trans('labels.Log in') }
                        </Button>

                        <Link className="underline" href={route('password.request')}>{trans('labels.Forgot my password')}</Link>
                </Stack>
            </form>
            </Paper>
            <Typography className="mt-4" align="center">{ trans('labels.or') }</Typography>
            <Paper className="p-5 mt-5" elevation={5}>
                <form onSubmit={handleRegister}>
                    <Stack
                        sx={{ maxWidth: "300px"}}
                        spacing={2}>
                        <Typography  align="center">{trans('labels.Register with your mobile number')}</Typography>


                        { errors.primary_contact_number &&  <Typography variant="caption" className="text-red-400">{ errors.primary_contact_number }</Typography> }
                        <Stack spacing={1} direction="row">

                        <TextField
                            // color="secondary"
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+88</InputAdornment>
                            }}
                            required
                            autoFocus
                            label={trans('labels.Mobile number')}
                            defaultValue={RegisterForm.data.primary_contact_number}
                            onChange={e => RegisterForm.setData('primary_contact_number', e.target.value)}
                        />
                            <Button className="flex-shrink-0" type="submit" variant="contained">{trans('labels.Submit')}</Button>
                        </Stack>

                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
