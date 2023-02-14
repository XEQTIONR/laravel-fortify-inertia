import React, { useState, Fragment } from 'react';
import {Box, Divider, IconButton, List, ListItem, Popover, Stack, Typography} from "@mui/material";
import {DeleteForever, KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";

export default function CartCard({anchor, items, setItems, open, setOpen}){
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
        <Typography variant="subtitlle1"
                    sx={{
                        display: 'block',
                        fontWeight: 'bold',
                        mt: 2,
                        mb: 1,
                        textAlign: 'center',
                    }}
        >Shopping Cart (5 Items) </Typography>

        <List sx={{ minWidth: 375, padding: 1 }}>
            { items.map(item =>
                <Fragment key={item.id}>
                    <Divider variant="middle" />
                    <ListItem
                        sx={{ my: 1 }}
                        secondaryAction={

                            <Box alignItems="center"
                                 sx={{
                                     display: 'flex',
                                     alignItems: 'center'
                                 }}
                            >
                                <Stack sx={{ mr: 1 }} spacing={0} alignItems="center">

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
                                    ৳ 240
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
                                    size="large"
                                    variant="outlined"
                                    color="error"
                                >
                                    <DeleteForever fontSize="inherit" />
                                </IconButton>

                            </Box>
                        }
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
                    </ListItem>
                </Fragment>
            )}



            <Divider variant="middle" />
            <ListItem key="total">
                <Typography sx={{ width: '60%', ml: 2, fontWeight: 'bolder' }}>Subtotal</Typography>
                <Typography sx={{ width: '40%', mr: 4, textAlign: 'right', fontWeight: 'bolder' }}>৳ 1000 /-</Typography>
            </ListItem>
        </List>
    </Popover>);
}
