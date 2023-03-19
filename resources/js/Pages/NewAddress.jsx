import React, { useState } from 'react';
import { useForm } from "@inertiajs/inertia-react";
import Nav from '@/Components/Nav';
import {Button, Box, Card, InputAdornment, Stack, TextField, Typography} from '@mui/material';
import useInput from '@/hooks/useInput';

export default function NewAddress({categories, shopping_cart, user}) {

    const [cart, setCart] = useState(shopping_cart.data);

    const formData = {
        'full_name': '',
        'business_name': '',
        'address': '',
        'phone_number': '',
    };

    const { data, setData, post, processing, progress } = useForm(formData);

    const [newAddressErrors, setNewAddressErrors] = useState({});

    function handleSubmit(e) {
        e.preventDefault();
        post( route('addresses.store'), {
            onError: (err) => {
                setNewAddressErrors(err);
            }
        });
    }

    const removeError = function(key) {
        const localAddressErrors = newAddressErrors;
        delete localAddressErrors[key];
        setNewAddressErrors(localAddressErrors);
    }

    return (
        <Nav
            navLinks={categories.data}
            selectedCategory={null}
            showUserMenu={true}
            shoppingCart={cart}
            setShoppingCart={setCart}
            user
        >
            <Box className="w-full p-3" component="form" onSubmit={handleSubmit}>
                <Card className="w-full p-4 max-w-screen-sm" variant="outlined">
                    <Stack spacing={2}>
                        <Typography className="font-bold ml-1 mt-1">Add a new address</Typography>
                        <TextField
                            required
                            size="small"
                            name="full_name"
                            value={data.full_name}
                            onChange={({target}) => {
                                removeError('full_name');
                                setData('full_name', target.value);
                            }}
                            error={newAddressErrors.hasOwnProperty('full_name')}
                            label={trans('labels.Full name')}
                            helperText={newAddressErrors.hasOwnProperty('full_name') && newAddressErrors['full_name']}
                        />
                        <TextField
                            size="small"
                            name="business_name"
                            value={data.business_name}
                            onChange={({target}) => {
                                removeError('business_name');
                                setData('business_name', target.value);
                            }}
                            error={newAddressErrors.hasOwnProperty('business_name')}
                            label={trans('labels.Business name')}
                            helperText={newAddressErrors.hasOwnProperty('business_name') && newAddressErrors['business_name']}
                        />
                        <TextField
                            multiline
                            rows={4}
                            size="small"
                            required
                            name="address"
                            label={trans('labels.Address')}
                            value={data.address}
                            error={newAddressErrors.hasOwnProperty('address')}
                            onChange={({target}) => {
                                removeError('address');
                                setData('address', target.value)
                            }}
                            helperText={newAddressErrors.hasOwnProperty('address') && newAddressErrors['address']}
                        />
                        <TextField
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+88</InputAdornment>
                            }}
                            name="phone_number"
                            label={trans('labels.Phone number')}
                            value={data.phone_number}
                            error={newAddressErrors.hasOwnProperty('phone_number')}
                            onChange={({target}) => {
                                removeError('phone_number');
                                setData('phone_number', target.value)
                            }}
                            helperText={newAddressErrors.hasOwnProperty('phone_number') && newAddressErrors['phone_number']}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                type="submit"
                                className="mb-1"
                                variant="contained"
                            >
                                {trans('labels.Save new address')}
                            </Button>
                            <Button color="error">{trans('labels.Cancel')}</Button>
                        </Stack>
                    </Stack>
                </Card>
            </Box>
        </Nav>
    )
}
