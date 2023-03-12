import React, { useState, useEffect } from 'react';

import {
    Box, Button,
    Divider,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "@inertiajs/inertia-react";
import {styled} from "@mui/material/styles";

const FormWrapper = styled( Paper )(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        mx: 2
    },
    [theme.breakpoints.down('md')]: {
        minWidth: '50vw',
        maxWidth: 450
    },
    [theme.breakpoints.up('md')]: {
        width: 450
    },
}));

export default function PaymentForm ({ order }) {

    const [payment, setPayment] = useState(0);
    const [balance, setBalance] = useState(order.balance);

    const formData = {
      'payment' : 0,
    };

    const { data, setData, post, processing, errors } = useForm(formData);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.orders.payments.store', { order: order.id }), {
            onError: (err) => {
                console.log('submite error', err);
            }
        })
    }
    useEffect(() => {
        const value = parseFloat(payment);

        if ( isNaN(value) ) {
            setBalance(order.balance);
            setData('payment', 0);
        } else {
            const bal = order.balance - payment;

            if (bal >= 0) {
                setBalance( bal );
                setData('payment', value)
            } else {
                setPayment(order.balance);
                setBalance(0);
            }
        }

    }, [payment]);

    return (
        <FormWrapper element="form" className="p-4">
            <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Stack spacing={2}>
                    <Typography variant="h6" className="mx-2 text-center">Record a payment.</Typography>
                    <Typography className="mx-2">Order # { order.id }</Typography>
                    <Divider />
                </Stack>
                <Stack className="mx-3">
                    <Stack justifyContent="space-between" direction="row">
                        <Typography>Subtotal</Typography>
                        <Typography>৳ {order.subtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack justifyContent="space-between" direction="row">
                        <Typography>Service Charge</Typography>
                        <Typography>৳ {order.delivery_charge.toFixed(2)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack justifyContent="space-between" direction="row">
                        <Typography className="font-bold">Total</Typography>
                        <Typography className="font-bold">৳ {order.total.toFixed(2)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack justifyContent="space-between" direction="row">
                        <Typography>Previous payments</Typography>
                        <Typography>৳ {order.payments_total.toFixed(2)}</Typography>
                    </Stack>
                </Stack>
                <Box className="px-3">
                <TextField
                    required
                    inputProps={{min: 0, style: { textAlign: 'right' }}}
                    value={payment}
                    onChange={({target}) => {
                        if ( !isNaN( parseFloat(target.value) ) ) {
                            setPayment(parseFloat(target.value));
                        } else {
                            setPayment("");
                        }
                    }}
                    className="w-full"
                    size="small"
                    label="Add payment"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">৳</InputAdornment>,
                    }}
                    variant="standard"
                />
                </Box>
                <Stack className="mx-3">
                    <Stack justifyContent="space-between" direction="row">
                        <Typography className="font-bold">Balance</Typography>
                        <Typography className="font-bold">৳ { balance.toFixed(2) }</Typography>
                    </Stack>
                </Stack>
                <Button disabled={processing} type="submit" className="mb-2" variant="contained">Add Payment</Button>
            </Stack>
            </form>
        </FormWrapper>
    );
}
