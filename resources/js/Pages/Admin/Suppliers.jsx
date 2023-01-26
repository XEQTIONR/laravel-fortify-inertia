import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Delete, Edit, ShoppingBag, ToggleOn } from "@mui/icons-material";
import { Alert, AlertTitle, Box, Fab, Tooltip, Modal, Snackbar } from '@mui/material'

import usePaginate from '@/hooks/usePaginate';

const HTTP_CREATED = 201;
const HTTP_OK = 200;

export default function Suppliers({ suppliers }) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(suppliers.data);
    const [meta, setMeta] = useState(suppliers.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const paginate = usePaginate( route('api.suppliers.index'), setIsLoading, setRows, setMeta );
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90
        },
        {
            field: 'contact_name',
            headerName: 'Contact Name',
            width: 150,
            editable: true,
        },
        {
            field: 'business_name',
            headerName: 'Business Name',
            width: 150,
            editable: true,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 250,
            editable: true,
        },
        {
            field: 'primary_contact_number',
            headerName: 'Mobile Number',
            width: 160,
            editable: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: true,
            width: 110,
        },
    ];

    const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
        return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    useEffect( () => {
        if (flash.status === HTTP_CREATED || flash.status === HTTP_OK) {
            setShowSnackbar(true);
        }

    }, [flash] );

    useEffect( () => {
        paginate(meta.current_page, meta.per_page, meta.orderBy, meta.order);
    }, [suppliers] );

    useEffect(() => {
        setTimeout(() => {
            const addButton = document.querySelector('#addButton');
            addButton.classList.remove('scale-0');
        }, 125);

        if ( ! window.localStorage.getItem('api-token') ) {
            axios.get(route('admin.token'), { headers: { Accept: 'application/json' } })
                .then(({data}) => {
                    data && window.localStorage.setItem('api-token', data);
                })
                .catch( (e) => {
                    console.log('error');
                    console.log(e);
                });
        }
    });

    return (
        <Nav navLinks={ navItems }>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={5000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <CustomAlert className="w-full"
                    onClose={() => setShowSnackbar(false)}
                    severity="success"
                >
                    {flash.title && <AlertTitle>{flash.title}</AlertTitle>}
                    {flash.message}
                </CustomAlert>
            </Snackbar>
            <Box
                className="flex flex-row-reverse justify-between items-end h-full"
            >
                <Box
                    className="flex flex-col justify-end"
                    sx={{ height: '100%' }}
                >
                    <Tooltip title="View / Edit supplier's products." placement="right">
                        <Fab
                            onClick={() => Inertia.visit((route('admin.suppliers.products.index', { supplier : selected[0]})))}
                            className={`ml-4 mt-4 transition duration-200 ${ selected.length === 1 ? 'hover:scale-125' : 'scale-0' }`}
                            color="warning"
                            size="medium"
                            aria-label="add"
                        >
                            <ShoppingBag />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Edit selected supplier." placement="right">
                        <Fab
                            className={`ml-4 mt-4 transition duration-200 ${ selected.length === 1 ? 'hover:scale-125' : 'scale-0' }`}
                            color="warning"
                            size="medium"
                            aria-label="add"
                        >
                            <Edit />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Activate/Deactivate selected suppliers." placement="right">
                        <Fab
                            onClick={() => Inertia.post( route('admin.suppliers.status'), { ids: selected } )}
                            className={`transition duration-200 ${ selected.length ? 'hover:scale-125' : 'scale-0' }`}
                            color="success"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <ToggleOn />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Delete selected supplier." placement="right">
                        <Fab
                            className={`ml-4 mt-4 transition duration-200 ${ selected.length ? 'hover:scale-125' : 'scale-0' }`}
                            color="error"
                            size="medium"
                            aria-label="add"
                        >
                            <Delete />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Add a new supplier." placement="right">
                        <Fab
                            onClick={() => Inertia.visit(route('admin.suppliers.create'))}
                            id="addButton"
                            className="ml-4 mt-4 transition hover:scale-125 duration-200 scale-0"
                            color="primary"
                            size="medium"
                            aria-label="add"
                        >
                            <Add />
                        </Fab>
                    </Tooltip>
                </Box>
                <DataGrid
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
                    rowsPerPageOptions={ [5, 10, 25, 50, 100] }
                    sortingMode="server"
                />
            </Box>
        </Nav>
    )
}
