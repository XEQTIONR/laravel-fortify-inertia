import React, { useEffect, useState } from 'react';
import { Inertia } from "@inertiajs/inertia";
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import RecordCostForm from '@/Components/Admin/RecordCostForm';
import { Box, Fab, Tooltip } from '@mui/material'
import { Add } from "@mui/icons-material";

export default function RecordCost(props) {

    const [order, setOrder] = useState(props.order.data);

    useEffect(() => {
        setTimeout(() => {
            const addButton = document.querySelector('#backButton');
            addButton.classList.remove('scale-0');
        }, 125);
    });

    return (
        <Nav navLinks={ navItems }>
            <Box
                className="flex flex-row-reverse justify-between items-end"
                sx={{ height: '100%' }}
            >
                <Box
                    className="flex flex-col justify-end"
                    sx={{ height: '100%' }}
                >
                    <Tooltip title="Add a new product." placement="right">
                        <Fab
                            onClick={() => Inertia.visit(route('admin.products.create')) }
                            id="backButton"
                            className="transition hover:scale-125 duration-200 scale-0"
                            color="primary"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <Add />
                        </Fab>
                    </Tooltip>
                </Box>
                <RecordCostForm order={order} />
            </Box>
        </Nav>
    )
}
