import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import AddProductForm from '@/Components/Admin/AddProductForm';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Fab, Tooltip, Modal } from '@mui/material'

const HTTP_CREATED = 201;

export default function Products({ products, uom }) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false)
    const [rows, setRows] = useState(products);
    const [ selected, setSelected ] =  useState([]);
    const [ showAddForm, setShowAddForm ] = useState(false);
    const [ working, setWorking ] = useState(false);

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
            field: 'in_stock',
            headerName: '# in stock',
            sortable: true,
            width: 160,
        },
    ];

    useEffect( () => {
        if (flash.status === HTTP_CREATED && showAddForm === true ) {
            setShowAddForm(false);
            setWorking(false);
        }
    }, [flash])
    useEffect(() => {
        console.log('useEffect called')
        setTimeout(() => {
            const addButton = document.querySelector('#addButton');
            addButton.classList.remove('scale-0');
        }, 125)



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



    function paginate(page, perPage = null, orderBy = null, order = null) {
        setIsLoading(true);
        const params = {
            page,
            perPage,
            orderBy,
            order
        }
        axios.get( route('api.products.index'), {
            headers: {
              Authorization: 'Bearer ' + window.localStorage.getItem('api-token'),
            },
            params
        })
        .then( ({data, status}) => {
            if ( status === 200 ) {
                setRows(data);
            }
        })
        .catch( (e) => {
            console.log('pagination exception');
            console.log(e);
        })
        .finally(() => setIsLoading(false));

    }

    return (
        <Nav navLinks={ navItems }>
            <Modal
                open={showAddForm}
                onClose={()=> ! working && setShowAddForm(false) }
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box sx={{ my: 2 }}>
                    <AddProductForm uom={uom} amWorking={setWorking} />
                </Box>
            </Modal>
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
                            onClick={() => setShowAddForm(true)}
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
                        paginate(rows.meta.current_page, newPageSize, rows.meta.orderBy, rows.meta.order)
                    }
                    onPageChange={ (newPage) =>
                        paginate(newPage+1, rows.meta.per_page, rows.meta.orderBy, rows.meta.order)
                    }
                    onSortModelChange={ ([gridSortItem]) => {
                        if(gridSortItem) {
                            paginate(rows.meta.current_page, rows.meta.per_page, gridSortItem.field, gridSortItem.sort)
                        }
                    }}
                    pageSize={ rows.meta.per_page }
                    paginationMode="server"
                    rows={ rows.data }
                    rowCount={ rows.meta.total }
                    rowsPerPageOptions={ [5, 10, 25, 50, 100].filter((perPage) => rows.meta.total >= perPage) }
                    sortingMode="server"
                />
            </Box>
        </Nav>
    )
}
