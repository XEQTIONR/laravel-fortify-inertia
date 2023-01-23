import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Chip, Fab, Tooltip, Snackbar, Stack, Typography } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
const HTTP_CREATED = 201;

export default function SupplierProducts({supplier, products}) {

    const { flash } = usePage().props;

    const [ currentProducts, setCurrentProducts ] = useState(supplier.products);
    // const [isLoading, setIsLoading] = useState(false);
    //  const [ selected, setSelected ] =  useState([]);
    // const [ showAddForm, setShowAddForm ] = useState(false);
    // const [ working, setWorking ] = useState(false);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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
        },
        {
            field: 'bangla_name',
            headerName: 'Name (Bangla)',
            width: 150,
        },
        {
            field: 'uom',
            headerName: 'Unit of Measure',
            width: 160,
        },
    ];

    useEffect( () => {
        if (flash.status === HTTP_CREATED) {
            setShowSnackbar(true);
        }
    }, [flash] );


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
                <Stack className="h-full w-full">
                    <Stack className="w-full h-1/3" direction="row">
                        <Box className="w-1/2 h-full">
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
                            <br />
                            <Typography variant="caption">{supplier.secondary_contact_number}</Typography>
                        </Box>
                        <Box className="w-1/2 h-full flex flex-wrap items-start justify-start content-start overflow-y-scroll">
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
                    <Box className="w-full h-2/3">
                        <DataGrid
                            className="w-full"
                            keepNonExistentRowsSelected
                            checkboxSelection
                            columns={ columns }
                            disableSelectionOnClick
                            selectionModel={currentProducts.map( item => item.id )}
                            onSelectionModelChange={ (newModel) => {
                                const itemsToAdd = []
                                setCurrentProducts(
                                    currentProducts.filter( elem => newModel.some( (id) => id === elem.id ))
                                )
                                newModel.forEach( id => {
                                    if( currentProducts.find( element => element.id === id ) === undefined ) {
                                        itemsToAdd.push( products.find( elem => elem.id === id ) )
                                    }
                                });
                                if( itemsToAdd.length > 0 ) {
                                    setCurrentProducts([...currentProducts, ...itemsToAdd])
                                }
                            }}
                            rows={products}
                            rowsPerPageOptions={ [5, 10, 25, 50, 100] }
                        />
                    </Box>
                </Stack>
            </Box>
        </Nav>
    )
}
