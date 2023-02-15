import React, { useState, useEffect } from "react";
import { useForm } from '@inertiajs/inertia-react'
import Nav from '@/Components/Nav';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';

export default function PhoneVerification ({shopping_cart, categories}) {
    const { data, setData, post, processing, errors } = useForm({
        verification_code: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('verify-phone-code'));
    }

    const [cart, setCart] = useState(shopping_cart);
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
                            <Typography align="center">Enter the code sent via SMS</Typography>
                            { errors.verification_code && <Typography>{ errors.verification_code }</Typography> }
                            <TextField
                                required
                                size="small"
                                label={trans('labels.Verification code')}
                                defaultValue={data.verification_code}
                                onChange={e => setData('verification_code', e.target.value)}
                            />

                            <Button type="submit" disabled={processing} variant="contained">
                                { trans('labels.Submit') }
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Nav>
    )
}
