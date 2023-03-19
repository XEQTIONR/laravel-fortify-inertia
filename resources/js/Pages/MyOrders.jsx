import React, { useEffect, useState }  from 'react';
import { Inertia } from '@inertiajs/inertia';
import Cookies from 'js-cookie'
import Nav from '@/Components/Nav';
import * as moment from 'moment';
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';

import { Receipt, Cancel, Visibility } from "@mui/icons-material";

export default function MyOrders ({ shopping_cart, categories, user, orders }) {

    const [cart, setCart] = useState(shopping_cart.data);

    useEffect(() => {
        const cookie = Cookies.get('shopping-cart')
        if ( ! cookie ) {
            axios.get(route('cookie'));
        }
    }, [])

    return (
        <Nav navLinks={categories.data}
             selectedCategory={null}
             showUserMenu={true}
             shoppingCart={cart}
             setShoppingCart={setCart}
             user
        >
            <Box className="w-full flex flex-col m-0 p-6">
                <Typography variant="h5">{trans('labels.My orders')}</Typography>
                <TableContainer className="my-3" component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                <TableCell>{trans('labels.Order ID')}</TableCell>
                                <TableCell align="center">{trans('labels.Order at')}</TableCell>
                                <TableCell align="right">{trans('labels.Order total')}</TableCell>
                                <TableCell>{trans('labels.Delivery date')}</TableCell>
                                <TableCell>{trans('labels.Time slot')}</TableCell>
                                <TableCell>{trans('labels.Status')}</TableCell>
                                <TableCell align="center">{trans('labels.Actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            orders.data.map((order, i) => (
                                <TableRow key={order.id}>
                                    <TableCell align="center">{i+1}</TableCell>
                                    <TableCell align="center">{order.id}</TableCell>
                                    <TableCell align="center">{moment(order.created_at).format("DD/MM/YYYY h:mm:ss a")}</TableCell>
                                    <TableCell align="right">৳ {order.total.toFixed(2)}</TableCell>
                                    <TableCell>{moment(order.delivery_date).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{order.time_slot}</TableCell>
                                    <TableCell>{order.status.charAt(0).toUpperCase() + order.status.substring(1)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => Inertia.visit( route('orders.show', {order: order.id}))}><Tooltip title={trans('labels.View order')}><Visibility /></Tooltip></IconButton>
                                        <IconButton><Tooltip title={trans('labels.View receipt')}><Receipt /></Tooltip></IconButton>
                                        {
                                            order.status === 'created'
                                            && <IconButton color="error">
                                                <Tooltip title={trans('labels.Cancel order')}><Cancel /></Tooltip>
                                            </IconButton>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Nav>
    )

}
