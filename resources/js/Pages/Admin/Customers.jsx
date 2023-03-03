import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import usePaginate from '@/hooks/usePaginate';
import {Alert, AlertTitle, Box, Fab, Snackbar, Tooltip} from "@mui/material";
import {Add, Delete, Edit, ToggleOn} from "@mui/icons-material";

const HTTP_CREATED = 201;
const HTTP_OK = 200;


export default function Customers({ customers }) {

    const {flash} = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(customers.data);
    const [meta, setMeta] = useState(customers.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const paginate = usePaginate( route('api.customers.index'), setIsLoading, setRows, setMeta );

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'orders_count',
            headerName: '# of orders',
            width: 100,
            type: 'number',
        },
        {
            field: 'orders_sum_subtotal',
            headerName: 'Sum Subtotal',
            width: 120,
            type: 'number',
            editable: true,
            valueGetter: (params) => `৳ ${params.row.orders_sum_subtotal.toFixed(2)}`
        },
        {
            field: 'orders_sum_delivery_charge',
            headerName: 'Total Delivery Charge',
            width: 150,
            type: 'number',
            editable: true,
            valueGetter: (params) => `৳ ${params.row.orders_sum_delivery_charge.toFixed(2)}`
        },
        {
            field: 'orders_sum_total',
            headerName: 'Sum total',
            width: 120,
            type: 'number',
            editable: true,
            valueGetter: (params) => `৳ ${params.row.orders_sum_total.toFixed(2)}`
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
            editable: true,
        },
        {
            field: 'primary_contact_number',
            headerName: 'Primary Contact',
            width: 150,
            editable: true,
        },
    ]

    const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
        return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    useEffect( () => {
        paginate(meta.current_page, meta.per_page, meta.orderBy, meta.order);
    }, [customers] );

    useEffect(() => {
        setTimeout(() => {
            const addButton = document.querySelector('#addButton');
            addButton.classList.remove('scale-0');
        }, 125);
    });

    return (
        <Nav navLinks={ navItems }>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={5000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <CustomAlert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {flash.title && <AlertTitle>{flash.title}</AlertTitle>}
                    {flash.message}
                </CustomAlert>
            </Snackbar>
            <Box
                className="flex flex-row-reverse justify-between items-end"
                sx={{ height: '100%' }}
            >
                <Box
                    className="flex flex-col justify-end"
                    sx={{ height: '100%' }}
                >
                    <Tooltip title="Add a new customer." placement="right">
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
                    onSelectionModelChange={ (items) => setSelected(items)}
                    onPageSizeChange={ (newPageSize) =>
                        paginate(meta.current_page, newPageSize, meta.orderBy, meta.order)
                    }
                    onPageChange={ (newPage) =>
                        paginate(newPage+1, meta.per_page, meta.orderBy, meta.order)
                    }
                    onSortModelChange={ ([gridSortItem]) => {
                        if(gridSortItem) {
                            paginate(meta.current_page, meta.per_page, gridSortItem.field, gridSortItem.sort);
                        }
                    } }
                    pageSize={ meta.per_page }
                    paginationMode="server"
                    rows={ rows }
                    rowCount={ meta.total }
                    rowsPerPageOptions={ [5, 10, 25, 50, 100].filter((perPage) => meta.total >= perPage) }
                    sortingMode="server"
                />
            </Box>
        </Nav>
    )
}
