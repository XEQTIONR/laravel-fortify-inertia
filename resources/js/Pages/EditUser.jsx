import React, { useState } from 'react';
import { useForm } from "@inertiajs/inertia-react";
import Nav from '@/Components/Nav';
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";

export default function EditUser({shopping_cart, categories, field, label, user}) {

    const [cart, setCart] = useState(shopping_cart.data);
    const formData = {
        'field': field,
        [field] : user[field],
    }
    const [validationErrors, setValidationErrors] = useState({});
    const { data, setData, put } = useForm(formData);

    function handleSubmit(e) {
        e.preventDefault();
        put( route('user-profile-information.update' ), {
            onError: (err) => {
                setValidationErrors(err);
            }
        });
    }
    const removeError = function(key) {
        if ( validationErrors.hasOwnProperty('updateProfileInformation') ) {
            const localAddressErrors = validationErrors;
            delete localAddressErrors[key];
            setValidationErrors(localAddressErrors);
        }
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
                        <Typography>Change Your {label}</Typography>
                        <TextField
                            value={data[field]}
                            onChange={({target}) => {
                                setData(field, target.value)
                                removeError('updateProfileInformation')
                            }}
                            size="small"
                            label={label}
                            error={validationErrors.hasOwnProperty('updateProfileInformation')}
                            helperText={
                                validationErrors.hasOwnProperty('updateProfileInformation')
                                && validationErrors.updateProfileInformation[field]
                            }
                            variant="outlined"
                            InputProps={{
                                startAdornment: [
                                    'primary_contact_number',
                                    'secondary_contact_number'
                                ].includes(field)
                                    ? <Typography className="mr-1">+88</Typography>
                                    : null
                            }}
                        />
                        <Button type="submit" variant="contained">{ trans('labels.Submit') }</Button>
                    </Stack>
                </Card>
            </Box>
        </Nav>
    );
}
