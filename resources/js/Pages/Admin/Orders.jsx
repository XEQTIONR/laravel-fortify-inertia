import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState, useCallback } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Check, Delete, Edit, ShoppingCartCheckout, ToggleOn } from "@mui/icons-material";
import {Alert, AlertTitle, Box, Chip, Fab, Tooltip, Snackbar, Select, MenuItem, FormControl} from '@mui/material'

import usePaginate from '@/hooks/usePaginate';

const HTTP_CREATED = 201;
const HTTP_OK = 200;

export default function Orders({ orders }) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(orders.data);
    const [meta, setMeta] = useState(orders.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );
    const [ showConfirmButton, setShowConfirmButton ] = useState(false);
    const [ showPrepareButton, setShowPrepareButton ] = useState(false);

    const paginate = usePaginate( route('api.orders.index'), setIsLoading, setRows, setMeta );

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 75
        },
        {
            field: 'delivery_date',
            headerName: 'Delivery Date',
            width: 140,
        },
        {
            field: 'time_slot',
            headerName: 'Time Slot',
            width: 125,
        },
        {
            field: 'subtotal',
            headerName: 'Subtotal',
            width: 125,
        },
        {
            field: 'delivery_charge',
            headerName: 'Delivery Charge',
            width: 150,
        },
        {
            field: 'total',
            headerName: 'Total',
            width: 125,
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: true,
            width: 90,
        },
    ];

    const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
        return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    function debounce( fn, timeout = 1000) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { fn(...args); }, timeout);
        };
    }
    const callOrderIndexApi = (ids) => {
        if (ids !== false) {
            axios.get( route('api.orders.index'), { params: { ids: ids }})
                .then(({data}) => {
                    if ( data.data.every(({status}) => status === 'created') ) {
                        setShowConfirmButton(true);
                    } else if ( data.data.every(({status}) => status === 'confirmed') ) {
                        setShowPrepareButton(true);
                    }
                })
                .catch((e) => {
                    console.log('error',e);
                });
        }
    }

    const callDebounce = useCallback( debounce( (ids) => {
        callOrderIndexApi(ids);
    }), []);

    useEffect( () => {
        setShowConfirmButton(false);
        setShowPrepareButton(false);
        if ( selected.length > 0 ) {
            callDebounce(selected);
        } else {
            callDebounce(false);
            setShowConfirmButton(false);
            setShowPrepareButton(false);
        }
    }, [ selected ] );

    useEffect( () => {
        if (flash.status === HTTP_CREATED || flash.status === HTTP_OK) {
            setShowSnackbar(true);
        }

    }, [flash] );

    useEffect( () => {
        paginate(meta.current_page, meta.per_page, meta.orderBy, meta.order);
    }, [orders] );

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
                    <Tooltip title="Prepare orders." placement="right">
                        <Fab
                            // onClick={() => Inertia.post( route('admin.products.status'), { ids: selected } )}
                            className={`transition duration-200 ${ showPrepareButton ? 'hover:scale-125' : 'scale-0' }`}
                            color="success"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <ShoppingCartCheckout />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Confirm orders." placement="right">
                        <Fab
                            // onClick={() => Inertia.post( route('admin.products.status'), { ids: selected } )}
                            className={`transition duration-200 ${ showConfirmButton ? 'hover:scale-125' : 'scale-0' }`}
                            color="success"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <Check />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Add a new product." placement="right">
                        <Fab
                            // onClick={() => Inertia.visit(route('admin.products.create')) }
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
                    rowsPerPageOptions={ [10, 25, 50, 100] }
                    sortingMode="server"
                />
            </Box>
        </Nav>
    )
}
