import React, { useState } from 'react';
import Nav from '@/Components/Nav';
import {
    Box,
    Button,
    Card,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
} from '@mui/material';
import { Receipt } from '@mui/icons-material';

export default function OrderCreated({order, categories, shopping_cart, user}) {

    const [cart, setCart] = useState(shopping_cart.data);
    const steps = [
        trans('statuses.created'),
        trans('statuses.prepared'),
        trans('statuses.delivered'),
        trans('statuses.paid')
    ];
    const stepsPresentTense = [
        trans('statuses.creating'),
        trans('statuses.preparing'),
        trans('statuses.delivering'),
        trans('statuses.paying')
    ];

    const stepsFutureTense = [
        trans('statuses.create'),
        trans('statuses.prepare'),
        trans('statuses.delivery'),
        trans('statuses.payment')
    ];

    function ucfirst(word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return (
        <Nav
            navLinks={categories.data}
            selectedCategory={null}
            shoppingCart={cart}
            setShoppingCart={setCart}
            showUserMenu={true}
            user
        >
            <Stack spacing={3} className="w-full md:w-3/4 lg:w-3/5 mt-4 mx-3">
                <Card className="py-3" variant="outlined">
                    <Stepper className="order-created" activeStep={ (steps.indexOf( trans('statuses.' + order.data.status) ) + 1) } alternativeLabel>
                    {
                        steps.map((label, index) => (
                            <Step>
                                <StepLabel>
                                    {
                                        index <= steps.indexOf( trans('statuses.' + order.data.status) )
                                        ? ucfirst(label)
                                        : (index === (steps.indexOf( trans('statuses.' + order.data.status) )+1)
                                            ? ucfirst(stepsPresentTense[index])
                                            : ucfirst(stepsFutureTense[index]))
                                    }
                                </StepLabel>
                            </Step>
                        ))
                    }
                    </Stepper>
                </Card>
                <Box className="flex justify-end">
                    <Button
                        onClick={() => {
                            window.open( route('orders.receipt.show', { order: order.data.id }), '_blank');
                        }}
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Receipt />}
                    >
                        { trans('labels.Receipt') }
                    </Button>
                </Box>
                <Card variant="outlined">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2}>{ trans('labels.Order ID') } {order.data.id}</TableCell>
                                    <TableCell align="right" colSpan={2}>
                                        { trans('labels.Status') }: {trans('statuses.'+order.data.status)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ trans('labels.Item') }</TableCell>
                                    <TableCell align="center">{ trans( 'labels.Quantity' ) }</TableCell>
                                    <TableCell align="right">{ trans( 'labels.Unit price' ) }</TableCell>
                                    <TableCell align="right">{ trans( 'labels.Total' ) }</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    order.data.items.map((row) => (
                                        <TableRow>
                                            <TableCell>{row.product.english_name} / {row.product.bangla_name}</TableCell>
                                            <TableCell align="center">{row.qty}</TableCell>
                                            <TableCell align="right">৳ {row.price.toFixed(2)}</TableCell>
                                            <TableCell align="right">৳ {(row.qty * row.price).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>
                                    <TableCell className="font-bold">{ trans('labels.Subtotal') }</TableCell>
                                    <TableCell className="font-bold" align="center">{order.data.items.reduce((total, {qty}) => total + qty, 0)}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="font-bold" align="right">৳ {order.data.subtotal.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">{ trans('labels.Service charge') }</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell className="font-bold" align="right">৳ {order.data.delivery_charge.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">{ trans('labels.Total') }</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell className="font-bold" align="right">৳ {order.data.total.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Stack>

        </Nav>
    )
}
