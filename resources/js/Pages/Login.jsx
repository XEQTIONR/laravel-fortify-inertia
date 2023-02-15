import React, {useState, useEffect, useRef}  from 'react';
import { useForm, Link } from '@inertiajs/inertia-react';
import Nav from '@/Components/Nav';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Login ({ loginRoute, shopping_cart, categories }) {

    const { data, setData, post, processing, errors } = useForm({
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
        <Nav
            navLinks={categories.data}
            shoppingCart={shopping_cart}
            selectedCategory={null}
            showUserMenu={false}
        >
            <Box className="w-full h-full flex flex-col items-center">
            <Paper className="p-5 mt-5" elevation={5}>
            <form onSubmit={handleLogin}>
                <Stack
                    sx={{ minWidth: "300px"}}
                    spacing={2}>
                        <Typography  align="center">Log in to continue</Typography>


                        { errors.email &&  <Typography variant="caption" className="text-red-400">{ errors.email }</Typography> }

                        <TextField
                            size="small"
                            required
                            autoFocus
                            label={trans('labels.Email or phone number')}
                            defaultValue={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <TextField
                            size="small"
                            required
                            autoFocus
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
                            variant="contained"
                            type="submit"
                            disabled={processing}
                        >
                            { trans('labels.Log in') }
                        </Button>

                        <Link className="underline" href={route('password.request')}>Forgot my password</Link>
                </Stack>
            </form>
            </Paper>
            <Typography className="mt-4" align="center">or</Typography>
            <Paper className="p-5 mt-5" elevation={5}>
                <form onSubmit={handleRegister}>
                    <Stack
                        sx={{ maxWidth: "300px"}}
                        spacing={2}>
                        <Typography  align="center">Register with your mobile number</Typography>


                        { errors.email &&  <Typography variant="caption" className="text-red-400">{ errors.email }</Typography> }

                        <Stack spacing={1} direction="row">
                        <TextField
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
                            <Button type="submit" variant="contained">Submit</Button>
                        </Stack>

                    </Stack>
                </form>
            </Paper>
            </Box>
        </Nav>
    );
}
