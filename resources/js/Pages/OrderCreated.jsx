import React, { useState } from 'react';
import Nav from '@/Components/Nav';
import {
    Box,
    Card,
    Paper,
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
                <Card variant="outlined">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2}>Order # {order.data.id}</TableCell>
                                    <TableCell align="right" colSpan={2}>Status: {order.data.status.charAt(0).toUpperCase() + order.data.status.slice(1)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Unit Price</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    order.data.items.map((row) => (
                                        <TableRow>
                                            <TableCell>{row.product.english_name}</TableCell>
                                            <TableCell align="right">{row.qty}</TableCell>
                                            <TableCell align="right">{row.price}</TableCell>
                                            <TableCell align="right">{row.qty * row.price}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>SubTotal</TableCell>
                                    <TableCell align="right">{order.data.items.reduce((total, {qty}) => total + qty, 0)}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="right">{order.data.subtotal}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Charges</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right">{order.data.delivery_charge}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right">{order.data.total}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Card>
            </Stack>

        </Nav>
    )
}
