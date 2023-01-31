import React, { useEffect } from 'react';
import Nav from '@/Components/Admin/Nav';
import ProductForm from '@/Components/Admin/ProductForm';
import navItems from  '@/Components/data/AdminNavItems';

import { ArrowBack } from "@mui/icons-material";
import { Box, Fab, Tooltip } from '@mui/material'

export default function AddProduct({ uom, categories }) {

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
                            onClick={() => window.history.back()}
                            id="backButton"
                            className="ml-4 mt-4 transition hover:scale-125 duration-200 scale-0"
                            color="primary"
                            size="medium"
                            aria-label="add"
                        >
                            <ArrowBack />
                        </Fab>
                    </Tooltip>
                </Box>
                <Box className="w-full flex justify-center">
                    <ProductForm action="add" existingCategories={categories.data} uom={uom} />
                </Box>
            </Box>
        </Nav>
    )
}
