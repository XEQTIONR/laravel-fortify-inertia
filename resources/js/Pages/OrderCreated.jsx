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

    const [cart, setCart] = useState(shopping_cart);
    const steps = [
        'Create',
        'Confirm',
        'Prepare',
        'Deliver',
    ];
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
                    <Stepper activeStep={1} alternativeLabel>
                    {
                        steps.map((label) => (
                            <Step>
                                <StepLabel>
                                    {label.charAt(0).toUpperCase() + label.slice(1)}
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
                        Receipt
                    </Button>
                </Box>
                <Card variant="outlined">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2}>Order # {order.data.id}</TableCell>
                                    <TableCell align="right" colSpan={2}>
                                        Status: {order.data.status.charAt(0).toUpperCase() + order.data.status.slice(1)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Unit Price</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    order.data.items.map((row) => (
                                        <TableRow>
                                            <TableCell>{row.product.english_name}</TableCell>
                                            <TableCell align="center">{row.qty}</TableCell>
                                            <TableCell align="right">৳ {row.price.toFixed(2)}</TableCell>
                                            <TableCell align="right">৳ {(row.qty * row.price).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>
                                    <TableCell className="font-bold">SubTotal</TableCell>
                                    <TableCell className="font-bold" align="center">{order.data.items.reduce((total, {qty}) => total + qty, 0)}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="font-bold" align="right">৳ {order.data.subtotal.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">Charges</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell className="font-bold" align="right">৳ {order.data.delivery_charge.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">Total</TableCell>
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
