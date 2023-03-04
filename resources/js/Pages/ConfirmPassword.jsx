import React, {useState, useEffect, useRef}  from 'react';
import { useForm, Link } from '@inertiajs/inertia-react';
import Nav from '@/Components/Nav';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Login ({ loginRoute, shopping_cart, categories, errors }) {

    const { data, setData, post, processing } = useForm({
        password: '',
    })

    function handleSubmit(e) {
        e.preventDefault();
        post( '/user/confirm-password',{
            onError: () => setData('password', '')
        });
    }

    function handleRegister(e) {
        e.preventDefault();
        RegisterForm.get(route('register'));
    }

    return (
        <Box className="w-full h-screen flex flex-col justify-center items-center">
            <Paper className="p-5 mt-5" elevation={5}>
                <form onSubmit={handleSubmit}>
                    <Stack
                        sx={{ minWidth: "300px"}}
                        spacing={2}
                    >
                        <Typography  align="center">Confirm your password to continue.</Typography>
                        <TextField
                            size="small"
                            required
                            label={trans('labels.Password')}
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={processing}
                        >
                            { trans('labels.Submit') }
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
