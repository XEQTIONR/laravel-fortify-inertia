import { Inertia } from '@inertiajs/inertia';
import React, { useState, Fragment } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react'
import {Box, Button, Divider, IconButton, List, ListItem, Popover, Stack, Typography} from "@mui/material";
import {Clear, KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import { red } from '@mui/material/colors';

const col = red[300];
export default function CartCard({anchor, items, setItems, open, setOpen, user}){
    const { data, setData, post, processing, errors } = useForm({
        items: items,
        address_id: null,
        user_id: user ? user.id : null,
        payment_type: 'cash on delivery',
        status: 'created',
    });

    function submit(e) {
        e.preventDefault();

        Inertia.visit(route('orders.create'));
        //get( route('orders.create') )
    }
    return (
        <Popover
            onClose={() => setOpen(false)}
            open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorEl={anchor}
        >
        <form onSubmit={submit}>
        <Typography variant="subtitlle1"
                    sx={{
                        display: 'block',
                        fontWeight: 'bold',
                        mt: 3,
                        mb: 1,
                        textAlign: 'center',
                    }}
        >
            Shopping Cart (<span>{items.reduce((total, {qty}) => total+qty, 0)}</span> Items)
        </Typography>

        <List sx={{ minWidth: 320 }}>
            { items.map(item =>
                <Fragment key={item.id}>
                    <Divider variant="middle" />
                    <ListItem
                        sx={{ my: 1 }}
                    >
                        <Box width={50} height={50}
                             sx={{
                                 backgroundImage: "url('" + item.product.image + "')",
                                 backgroundSize: 'cover'
                             }}
                        >

                        </Box>
                        <Stack
                            sx={{
                                marginLeft: 2,
                                marginY: 0,
                                width: '33%'
                            }}
                        >
                            <Typography variant="body2">{item.product.english_name}</Typography>
                            <Typography variant="subtitle2">{item.product.amount} {item.product.uom}</Typography>
                        </Stack>
                        <Box alignItems="center" justifyContent="space-between"
                             sx={{
                                 flexGrow: 1,
                                 display: 'flex',
                             }}
                        >
                            <Stack spacing={0} alignItems="center">

                                <IconButton
                                    onClick={() => {
                                        axios.put( route('api.carts.update', {  cart: item.id }), {
                                            qty: item.qty+1
                                        })
                                            .then(({data}) => {
                                                if (data.action === 'update') {
                                                    // const update = items.find(({id}) => data.cart.id)
                                                    const updated = items.map((anItem) => {
                                                        if (data.cart.id === anItem.id) {
                                                            anItem.qty = data.cart.qty;
                                                        }
                                                        return anItem
                                                    })
                                                    setItems(updated);
                                                    //console.log(update);
                                                }
                                            })
                                            .catch((e) => {
                                                console.log('err', e)
                                            })
                                    }}
                                    size="small"
                                >
                                    <KeyboardArrowUp fontSize="inherit" />
                                </IconButton>
                                <Typography variant="caption">{item.qty}</Typography>
                                <IconButton
                                    onClick={() => {
                                        axios.put( route('api.carts.update', {  cart: item.id }), {
                                            qty: item.qty-1
                                        })
                                            .then(({data}) => {
                                                console.log(data);
                                                if (data.action === 'update') {
                                                    // const update = items.find(({id}) => data.cart.id)
                                                    setItems(items.map((anItem) => {
                                                        if (data.cart.id === anItem.id) {
                                                            anItem.qty = data.cart.qty;
                                                        }
                                                        return anItem
                                                    }));
                                                    //console.log(update);
                                                } else if ( data.action === 'delete') {
                                                    setItems(items.filter( (anItem) => anItem.id !== data.id ))
                                                }
                                            })
                                            .catch((e) => {
                                                console.log('err', e)
                                            })
                                    }}
                                    size="small">
                                    <KeyboardArrowDown fontSize="inherit" />
                                </IconButton>

                            </Stack>
                            <Typography
                                variant="caption"
                                sx={{ ml: 2 }}
                            >
                                ৳ <span>{item.qty * item.product.current_selling_price}</span>
                            </Typography>
                            <IconButton
                                onClick={() => {
                                    axios.delete(route('api.carts.destroy', {  cart: item.id }))
                                        .then(({data}) => {
                                            //console.log(res)
                                            setItems(items.filter( (anItem) => anItem.id !== data ))
                                        })
                                        .catch((e) => {
                                            console.log('error', e);
                                        });
                                }}
                                sx={{ marginLeft: 1 }}
                                size="small"
                                variant="outlined"
                            >
                                <Clear color={col} fontSize="inherit" />
                            </IconButton>

                        </Box>
                    </ListItem>
                </Fragment>
            )}



            <Divider variant="middle" />
            <ListItem key="total">
                <Typography sx={{ width: '60%', ml: 2, fontWeight: 'bolder' }}>Subtotal</Typography>
                <Typography sx={{ width: '40%', mr: 1, textAlign: 'right', fontWeight: 'bold' }}>৳
                    <Typography component="span" sx={{ mx: 2, fontWeight: 'bold' }}>{
                    items.reduce((total, {qty, product}) => total+(product.current_selling_price*qty), 0)
                    }</Typography>
                /-</Typography>
            </ListItem>
            <ListItem>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ display: 'block', width: '100%', mt: 2  }}
                    disabled={items.length === 0}
                    onClick={() => {

                    }}
                >
                    Checkout
                </Button>
            </ListItem>

        </List>
        </form>
    </Popover>);
}
