import React, { useState, useEffect } from 'react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import PaymentForm from '@/Components/Admin/PaymentForm';
import { Box, Fab, Tooltip } from '@mui/material';

export default function AddPayment({ order }) {

    const [ theOrder, setOrder ] = useState(order);

    return (
        <Nav navLinks={ navItems }>
            <Box className="flex flex-row-reverse justify-between items-center h-full">
                <Box className="flex flex-col justify-end h-full">
                </Box>
                <Box className="w-full flex justify-center">
                    <PaymentForm order={order.data} />
                </Box>
            </Box>
        </Nav>
    );
}
