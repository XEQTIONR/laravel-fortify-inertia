import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Chip, Divider, Fab, Tooltip, Snackbar, Stack, Typography } from '@mui/material'
import MuiAlert from '@mui/material/Alert';

import usePaginate from '@/hooks/usePaginate';

const HTTP_CREATED = 201;

export default function SupplierProducts({supplier}) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});

    const [ currentProducts, setCurrentProducts ] = useState(supplier.products);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const paginate = usePaginate( route('api.products.index'), setIsLoading, setRows, setMeta );

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 75
        },
        {
            field: 'english_name',
            headerName: 'Name',
            width: 150,
        },
        {
            field: 'bangla_name',
            headerName: 'Name (Bangla)',
            width: 150,
        },
        {
            field: 'uom',
            headerName: 'Unit of Measure',
            width: 120,
        },
    ];

    useEffect( () => {
        if (flash.status === HTTP_CREATED) {
            setShowSnackbar(true);
        }
    }, [flash] );

    useEffect( () => {
        paginate(1);
    }, []); // once


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
                <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {flash.message}
                </Alert>
            </Snackbar>
            <Box className="flex flex-row-reverse justify-between items-end h-full">
                <Box className="flex flex-col justify-end h-full">
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
                <Stack className="h-full w-full" direction="row">
                    <Stack className="w-2/5 h-full mr-2">
                        <Typography variant="overline">{supplier.business_name}</Typography>
                        <Typography variant="subtitle2">{supplier.contact_name}</Typography>
                        <p>{
                            supplier.address.split('\n').map( (line) =>
                                <span className="text-xs leading-none" style={{ lineHeight: "normal"}}>
                                    {line}
                                    <br />
                                </span>
                            )
                        }</p>
                        <Typography variant="caption">{supplier.primary_contact_number}</Typography>
                        <Typography variant="caption">{supplier.secondary_contact_number}</Typography>
                        <Divider className="my-2" />
                        <Box className="w-full h-full flex flex-wrap items-start justify-start content-start overflow-y-scroll">
                            {
                                [...currentProducts].map( product =>
                                    <Chip
                                        color="info"
                                        onDelete={() => setCurrentProducts(currentProducts.filter((item) => item !== product))}
                                        className="mr-1 mb-1"
                                        clickable={true}
                                        key={product.id}
                                        label={product.english_name + '/' + product.bangla_name}
                                    />
                                )
                            }
                        </Box>
                    </Stack>
                    <Box className="w-3/5 h-full flex flex-wrap items-start justify-start content-start overflow-y-scroll">
                        <DataGrid
                            keepNonExistentRowsSelected
                            checkboxSelection
                            columns={ columns }
                            disableColumnMenu
                            disableSelectionOnClick
                            loading={ isLoading }
                            selectionModel={currentProducts.map( item => item.id )}
                            onSelectionModelChange={ (newModel) => {
                                const itemsToAdd = []
                                setCurrentProducts(
                                    currentProducts.filter( elem => newModel.some( (id) => id === elem.id ))
                                )
                                newModel.forEach( id => {
                                    if( currentProducts.find( element => element.id === id ) === undefined ) {
                                        itemsToAdd.push( rows.find( elem => elem.id === id ) )
                                    }
                                });
                                if( itemsToAdd.length > 0 ) {
                                    setCurrentProducts([...currentProducts, ...itemsToAdd])
                                }
                            }}
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
                </Stack>
            </Box>
        </Nav>
    )
}
