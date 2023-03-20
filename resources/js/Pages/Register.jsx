import React, { useState, useEffect } from "react";
import { useForm } from '@inertiajs/inertia-react'
import Nav from '@/Components/Nav';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';


export default function Register({shopping_cart, categories, primary_contact_number}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        primary_contact_number: primary_contact_number ?? '',
        secondary_contact_number: '',
        password: '',
        password_confirmation: '',
    });

    const [cart, setCart] = useState(shopping_cart.data);


    function handleSubmit(e) {
        e.preventDefault();
        post(route('register'));
    }
    return (
        <Nav
            navLinks={categories.data}
            shoppingCart={cart}
            setShoppingCart={setCart}
            selectedCategory={null}
            showUserMenu={false}
        >
            <Paper className="p-5 mt-5" elevation={5}>
        <form onSubmit={handleSubmit}>
            <Stack
                sx={{ minWidth: "300px"}}
                spacing={2}
            >
                <Typography align="center">{ trans('labels.Register') }</Typography>
                <TextField
                    required
                    size="small"
                    label={trans('labels.Full name')}
                    defaultValue={data.name}
                    onChange={e => setData('name', e.target.value)}
                />
                { errors.name && <div>{ errors.name }</div> }

                <TextField
                    size="small"
                    label={trans('labels.Email')}
                    defaultValue={data.email}
                    onChange={e => setData('email', e.target.value)}
                />
                { errors.email && <div>{ errors.email }</div> }

                <TextField
                    required
                    size="small"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+88</InputAdornment>
                    }}
                    label={trans('labels.Mobile number')}
                    defaultValue={data.primary_contact_number}
                    onChange={e => setData('primary_contact_number', e.target.value)}
                />
                { errors.primary_contact_number && <div>{ errors.primary_contact_number }</div> }

                <TextField
                    size="small"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+88</InputAdornment>
                    }}
                    label={trans('labels.Other contact number')}
                    defaultValue={data.secondary_contact_number}
                    onChange={e => setData('secondary_contact_number', e.target.value)}
                />
                { errors.secondary_contact_number && <div>{ errors.secondary_contact_number }</div> }

                <TextField
                    required
                    size="small"
                    label={trans('labels.Password')}
                    defaultValue={data.password}
                    onChange={e => setData('password', e.target.value)}
                />
                { errors.password && <div>{ errors.password }</div> }

                <TextField
                    required
                    size="small"
                    label={trans('labels.Confirm password')}
                    defaultValue={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                />

                <Button type="submit" disabled={processing} variant="contained">
                    { trans('labels.Register') }
                </Button>
            </Stack>
        </form>
            </Paper>
        </Nav>
    )
}
