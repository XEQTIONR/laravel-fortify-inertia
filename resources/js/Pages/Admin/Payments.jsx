import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';
import * as moment from 'moment';

import usePaginate from '@/hooks/usePaginate';
import { Box, Fab, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function Payments({ payments }) {
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(payments.data);
    const [meta, setMeta] = useState(payments.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const paginate = usePaginate( route('api.payments.index'), setIsLoading, setRows, setMeta );

    useEffect(() => {
        setTimeout(() => {
            const addButton = document.querySelector('#addButton');
            addButton.classList.remove('scale-0');
        }, 125);
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100
        },
        {
            field: 'order_id',
            headerName: 'Order',
            width: 100,
        },
        {
            field: 'created_at',
            headerName: 'Created On',
            width: 185,
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY h:mm:ss a")
        },
        {
            field: 'payment_type',
            headerName: 'Payment Type',
            width: 150,
            valueGetter: (params) => params.row.payment_type.charAt(0).toUpperCase() + params.row.payment_type.substring(1),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 150,
            type: 'number',
            valueGetter: (params) => `৳ ${params.row.amount.toFixed(2)}`
        },
    ]
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
                    <Tooltip title="Add a new payment." placement="right">
                        <Fab
                            onClick={() => Inertia.visit(route('admin.products.create')) }
                            id="addButton"
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
                <DataGrid
                    getRowHeight={() => 'auto'}
                    keepNonExistentRowsSelected
                    checkboxSelection
                    columns={ columns }
                    disableColumnMenu
                    disableSelectionOnClick
                    experimentalFeatures={ { newEditingApi: true } }
                    loading={ isLoading }
                    selectionModel={selected}
                    onSelectionModelChange={ (items) => setSelected(items)}
                    onPageSizeChange={ (newPageSize) => {
                        paginate(meta.current_page, newPageSize, meta.orderBy, meta.order)
                    }}
                    onPageChange={ (newPage) => {
                        paginate(newPage+1, meta.per_page, meta.orderBy, meta.order)
                    }}
                    onSortModelChange={ ([gridSortItem]) => {
                        if(gridSortItem) {
                            paginate(meta.current_page, meta.per_page, gridSortItem.field, gridSortItem.sort);
                        }
                    }}
                    pageSize={ meta.per_page }
                    paginationMode="server"
                    rows={ rows }
                    rowCount={ meta.total }
                    rowsPerPageOptions={ [10, 25, 50, 100] }
                    sortingMode="server"
                />
            </Box>
        </Nav>
    )
}
