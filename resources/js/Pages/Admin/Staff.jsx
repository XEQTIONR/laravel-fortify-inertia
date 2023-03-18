import React, { useEffect, useState } from 'react';
import navItems from  '@/Components/data/AdminNavItems';
import Nav from "@/Components/Admin/Nav";
import { Inertia } from "@inertiajs/inertia";
import { Add, CheckCircle, Cancel, ToggleOn, ToggleOff } from "@mui/icons-material";
import { Alert, AlertTitle, Box, Fab, Tooltip, Snackbar } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import * as moment from 'moment';

import usePaginate from '@/hooks/usePaginate';
import { usePage } from "@inertiajs/inertia-react";

const HTTP_CREATED = 201;
const HTTP_OK = 200;

export default function Staff({ staff }) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(staff.data);
    const [meta, setMeta] = useState(staff.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );

    const paginate = usePaginate( route('api.staff.index'), setIsLoading, setRows, setMeta );

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 225,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'mobile_number',
            headerName: 'Mobile Number',
            width: 150,
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 200,
            valueGetter: (params) => moment(params.row.created_at).format("DD/MM/YYYY h:mm:ss a")
        },
        {
            field: 'is_active',
            headerName: 'Active?',
            width: 75,
            sortable: false,
            renderCell: (params) => params.row.is_active ? <CheckCircle color="success" /> : <Cancel color="error" />
        }
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
    }, [staff] );

    useEffect(() => {
        setTimeout(() => {
            const addButton = document.querySelector('#addButton');
            addButton.classList.remove('scale-0');
        }, 125);
    });

    function toggleButton() {
        if (selected.length === 1) {
            const item = rows.find(({id}) => id === selected[0]);
            if ( ! item.is_active ) {
                return false;
            }
        }
        return true;
    }

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

                     <Tooltip title={(toggleButton() ? "Disable" :"Enable") + " staff user"} placement="right">
                        <Fab
                            className={`transition duration-200 ${ selected.length === 1 ? 'hover:scale-125' : 'scale-0' }`}
                            color={toggleButton() ? 'error' : 'success'}
                            size="medium"
                            sx={{ ml: 2, mt: 2 }}
                        >
                            { toggleButton() ? <ToggleOff /> : <ToggleOn />}
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Add a new admin user." placement="right">
                        <Fab
                          onClick={() => Inertia.visit(route('admin.staff.create')) }
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
                    pageSize={ meta.per_page }
                    rows={ rows }
                    rowCount={ meta.total }
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
                    rowsPerPageOptions={ [5, 10, 25, 50, 100] }
                    paginationMode="server"
                    sortingMode="server"
                />
            </Box>
        </Nav>
    );
}
