import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Delete, Edit, ToggleOn } from "@mui/icons-material";
import { Alert, AlertTitle, Box, Fab, Tooltip, Snackbar } from '@mui/material'

import usePaginate from '@/hooks/usePaginate';

const HTTP_CREATED = 201;
const HTTP_OK = 200;

export default function Products({ products }) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(products.data);
    const [meta, setMeta] = useState(products.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const paginate = usePaginate( route('api.products.index'), setIsLoading, setRows, setMeta );

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90
        },
        {
            field: 'english_name',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'bangla_name',
            headerName: 'Name (Bangla)',
            width: 150,
            editable: true,
        },
        {
            field: 'current_selling_price',
            headerName: 'Current Price',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'uom',
            headerName: 'Unit of Measure',
            width: 160,
            editable: true,
        },
        {
            field: 'in_stock',
            headerName: '# in stock',
            sortable: true,
            width: 110,
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: true,
            width: 100,
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
    }, [products] );

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
                    <Tooltip title="Edit selected product." placement="right">
                        <Fab
                            className={`transition duration-200 ${ selected.length === 1 ? 'hover:scale-125' : 'scale-0' }`}
                            color="warning"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <Edit />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Activate/Deactivate selected products." placement="right">
                        <Fab
                            onClick={() => Inertia.post( route('admin.products.status'), { ids: selected } )}
                            className={`transition duration-200 ${ selected.length ? 'hover:scale-125' : 'scale-0' }`}
                            color="success"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <ToggleOn />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Delete selected products." placement="right">
                        <Fab
                            className={`transition duration-200 ${ selected.length ? 'hover:scale-125' : 'scale-0' }`}
                            color="error"
                            size="medium"
                            aria-label="add"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            <Delete />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Add a new product." placement="right">
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
