import React, { useState } from 'react';
import { useForm } from "@inertiajs/inertia-react";
import Nav from '@/Components/Nav';
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";

export default function UpdatePassword({ shopping_cart, categories, user}) {

    const [cart, setCart] = useState(shopping_cart);

    const formData = {
        'current_password': '',
        'password': '',
        'password_confirmation': ''
    }

    const [validationErrors, setValidationErrors] = useState({});
    const { data, setData, reset, put } = useForm(formData);

    const removeError = function(key) {
        if ( validationErrors.hasOwnProperty(key) ) {
            const localAddressErrors = validationErrors;
            delete localAddressErrors[key];
            setValidationErrors(localAddressErrors);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        put(route( 'user-password.update' ), {
            onError: (err) => {
                reset();
                setValidationErrors(err.updatePassword);
            }
        });
    }

    return (
        <Nav navLinks={categories.data}
             selectedCategory={null}
             showUserMenu={true}
             shoppingCart={cart}
             setShoppingCart={setCart}
             user
        >
            <Box component="form" onSubmit={handleSubmit} className="w-full flex justify-center mt-4 mx-3">
                <Card className="w-full sm:w-3/4 md:w-3/5 lg:w-2/5 2xl:w-1/4 p-5 flex flex-col" variant="outlined">
                    <Stack spacing={2}>
                        <Typography>Update Password</Typography>
                        <TextField
                            required
                            value={data.current_password}
                            onChange={({target}) => {
                                setData('current_password', target.value)
                                removeError('current_password')
                            }}
                            size="small"
                            label={trans('labels.Current password')}
                            error={validationErrors.hasOwnProperty('current_password')}
                            helperText={
                                validationErrors.hasOwnProperty('current_password')
                                && validationErrors.current_password
                            }
                            type="password"
                            variant="outlined"
                        />
                        <TextField
                            required
                            value={data.password}
                            onChange={({target}) => {
                                setData('password', target.value)
                                removeError('password')
                            }}
                            size="small"
                            label={trans('labels.New password')}
                            error={validationErrors.hasOwnProperty('password')}
                            helperText={
                                validationErrors.hasOwnProperty('password')
                                && validationErrors.password
                            }
                            type="password"
                            variant="outlined"
                        />
                        <TextField
                            required
                            value={data.password_confirmation}
                            onChange={({target}) => {
                                setData('password_confirmation', target.value)
                                removeError('password_confirmation')
                            }}
                            size="small"
                            label={trans('labels.Confirm new password')}
                            error={validationErrors.hasOwnProperty('password_confirmation')}
                            helperText={
                                validationErrors.hasOwnProperty('password_confirmation')
                                && validationErrors.password_confirmation
                            }
                            type="password"
                            variant="outlined"
                        />
                        <Button type="submit" variant="contained">{ trans('labels.Submit') }</Button>
                    </Stack>
                </Card>
            </Box>
        </Nav>
    )
}
