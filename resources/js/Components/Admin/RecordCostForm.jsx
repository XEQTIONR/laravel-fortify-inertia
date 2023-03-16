import React, { useEffect, useState } from 'react';
import { useForm } from "@inertiajs/inertia-react";
import {
    Box, Button,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";

export default function RecordCostForm({order}) {

    const formData = {
        'items' : order.items.map(({id, cost}) => {
            return { id, cost };
        })
    };

    const { data, setData, post, processing, errors } = useForm(formData);

    function handleSubmit(e) {
        e.preventDefault();

        post( route('admin.orders.cost.store', { order: order.id }), {
            onError: (err) => {
                console.log(err)
            }
        })
    }

    return (
        <Box component="form" onSubmit={handleSubmit} className="flex flex-col">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Row Total</TableCell>
                            <TableCell align="right">Row Cost</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            order.items.map(({id, product, qty, price, cost}, index) => <TableRow key={id}>
                                <TableCell>{product.english_name} / {product.bangla_name} {product.amount} {product.uom}</TableCell>
                                <TableCell align="center">{qty}</TableCell>
                                <TableCell align="right">৳ {price.toFixed(2)}</TableCell>
                                <TableCell align="right">৳ {(qty*price).toFixed(2)}</TableCell>
                                <TableCell className="p-0" align="right">
                                    <TextField
                                        size="small"
                                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        type="number"
                                        value={data.items[index].cost ?? ''}
                                        onChange={({target}) => {
                                            const localCosts = [...data.items];
                                            localCosts[index].cost = target.value;
                                            setData('items', localCosts);
                                        }}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">৳</InputAdornment>
                                        }}
                                    />
                                </TableCell>
                            </TableRow>)
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="font-bold">Subtotal</TableCell>
                            <TableCell align="center" className="font-bold">{ order.items.reduce( (total, item) => total+item.qty, 0 ) }</TableCell>
                            <TableCell />
                            <TableCell align="right" className="font-bold">৳ { order.subtotal.toFixed(2) }</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold">Delivery Charge</TableCell>
                            <TableCell />
                            <TableCell align="right" className="font-bold">
                                { order.delivery_charge_type === 'amount' ? '৳ ' : null }
                                { order.delivery_charge_amount }
                                { order.delivery_charge_type === 'percentage' ? ' %' : null }
                            </TableCell>
                            <TableCell align="right" className="font-bold">৳ { order.delivery_charge.toFixed(2) }</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold">Grand Total</TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell align="right" className="font-bold">৳ { order.total.toFixed(2) }</TableCell>
                            <TableCell className="text-right font-bold">
                                <span className="mr-4">Total Cost</span>
                                ৳ { data.items.reduce((total, {cost}) => total + (isNaN(parseFloat(cost)) ? 0 : parseFloat(cost)), 0 ).toFixed(2) }
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Box className="flex justify-end mt-4">
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </Box>
    );
}
