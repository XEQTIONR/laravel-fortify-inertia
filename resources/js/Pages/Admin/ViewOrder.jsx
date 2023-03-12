import { Inertia } from '@inertiajs/inertia';
import React from 'react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import {
    Box,
    List,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
} from "@mui/material";

export default function ViewOrder({ order }) {
    return (
        <Nav navLinks={ navItems }>
            <Box className="flex">
                <List className="w-full md:w-1/2">
                    <ListItemText
                        primary="Order ID"
                        secondary={order.data.id}
                    />

                    <ListItemText
                        primary="Created at"
                        secondary={order.data.created_at}
                    />
                    <ListItemText
                        primary="Delivery date"
                        secondary={order.data.delivery_date}
                    />
                    <ListItemText
                        primary="Time slot"
                        secondary={order.data.time_slot}
                    />
                    <ListItemText
                        primary={"Status"}
                        secondary={order.data.status}
                    />
                </List>
                <List className="w-full md:w-1/2">
                    <ListItemText
                        primary="Customer ID"
                        secondary={order.data.customer.id}
                    />
                    <ListItemText
                        primary="Name"
                        secondary={order.data.customer.name}
                    />
                    <ListItemText
                        primary="Email"
                        secondary={order.data.customer.email}
                    />
                    <ListItemText
                        primary="Primary contact number"
                        secondary={order.data.customer.primary_contact_number}
                    />
                    <ListItemText
                        primary="Secondary contact number"
                        secondary={order.data.customer.secondary_contact_number}
                    />
                </List>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            order.data.items.map(item => (
                                <TableRow>
                                    <TableCell>{item.product.english_name} / {item.product.bangla_name} {item.product.amount} {item.product.uom}</TableCell>
                                    <TableCell align="center">{item.qty}</TableCell>
                                    <TableCell align="right">৳ {item.price.toFixed(2)}</TableCell>
                                    <TableCell align="right">৳ {(item.qty*item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>Subtotal</TableCell>
                            <TableCell align="center">{order.data.items.reduce( (acc, item) => acc + item.qty, 0)}</TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right">৳ {order.data.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Delivery Charge</TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right">
                                { order.data.delivery_charge_type === 'amount' ? '৳ ' : null }
                                { order.data.delivery_charge_amount }
                                { order.data.delivery_charge_type === 'percentage' ? ' %' : null }</TableCell>
                            <TableCell align="right">৳ {order.data.delivery_charge.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold">Grand Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="font-bold" align="right">৳ {order.data.total.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Nav>
    );
}
