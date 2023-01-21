import { Inertia } from '@inertiajs/inertia';
import React, { useEffect } from 'react';
import Nav from '@/Components/Admin/Nav';
import AddProductForm from '@/Components/Admin/AddProductForm';
import navItems from  '@/Components/data/AdminNavItems';

import { ArrowBack } from "@mui/icons-material";
import { Box, Fab, Tooltip } from '@mui/material'

export default function AddProduct({ uom }) {

    useEffect( () => {
        setTimeout(() => {
            const backButton = document.querySelector('#backButton');
            backButton.classList.remove('scale-0');
        }, 125);
    });
    return (
        <Nav navLinks={ navItems }>
            <Box className="flex flex-row-reverse justify-between items-center h-full">
                <Box className="flex flex-col justify-end h-full">
                    <Tooltip title="Back to all products." placement="right">
                        <Fab
                            onClick={() => Inertia.visit( route('admin.products.index') )}
                            id="backButton"
                            className="transition hover:scale-125 duration-200 scale-0"
                            color="primary"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <ArrowBack />
                        </Fab>
                    </Tooltip>
                </Box>
                <Box className="w-full flex justify-center">
                    <AddProductForm uom={uom} />
                </Box>
            </Box>
        </Nav>
    )
}
