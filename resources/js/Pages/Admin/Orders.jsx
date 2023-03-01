import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState, useCallback } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Alert,
    AlertTitle,
    Box,
    Checkbox,
    Fab,
    FormControl,
    InputLabel,
    MenuItem,
    Snackbar,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import {
    Add,
    Check,
    CalendarMonthOutlined,
    FilterList,
    LocalShipping,
    SyncProblem
} from "@mui/icons-material";

import usePaginate from '@/hooks/usePaginate';

const HTTP_CREATED = 201;
const HTTP_OK = 200;

export default function Orders({ orders, statuses }) {

    const { flash } = usePage().props;

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(orders.data);
    const [meta, setMeta] = useState(orders.meta);
    const [ selected, setSelected ] =  useState([]);
    const [ showSnackbar, setShowSnackbar ] = useState( false );
    const [ showPreparedButton, setShowPreparedButton ] = useState(false);
    const [ showDeliveredButton, setShowDeliveredButton ] = useState(false);
    const [ filters, setFilters ] = useState([])
    const [ filterDate, setFilterDate ] = useState(null);
    const [ filterDateValue, setFilterDateValue ] = useState(null);
    const [ filterStatuses, setFilterStatuses ] = useState([]);

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
            valueGetter: (params) => params.row.delivery_date.split('-').reverse().join('/')
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
            type: 'number',
            valueGetter: (params) => `৳ ${params.row.subtotal.toFixed(2)}`
        },
        {
            field: 'delivery_charge',
            headerName: 'Delivery Charge',
            width: 150,
            type: 'number',
            valueGetter: (params) => `৳ ${params.row.delivery_charge.toFixed(2)}`
        },
        {
            field: 'total',
            headerName: 'Total',
            width: 125,
            type: 'number',
            valueGetter: (params) => `৳ ${params.row.total.toFixed(2)}`
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: true,
            width: 90,
            valueGetter: (params) => params.row.status.charAt(0).toUpperCase() + params.row.status.substring(1)
        },
    ];

    const filterState = (currentFilters) => {
        if ( currentFilters.includes('filters') ) {
            setFilters( currentFilters );
        } else {
            setFilters([]);
            setFilterDate(null);
            setFilterDateValue(null);
            setFilterStatuses([]);
        }
    }

    const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
        return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    function debounce( fn, timeout = 500 ) {
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
                        setShowPreparedButton(true);
                    } else if ( data.data.every(({status}) => status === 'prepared') ) {
                        setShowDeliveredButton(true);
                    }
                })
                .catch((e) => {
                    console.log('error',e);
                });
        }
    }

    const debouncedOrderIndexApiCall = useCallback( debounce( (ids) => {
        callOrderIndexApi(ids);
    }), []);

    const debouncedPaginate = useCallback( debounce( ( currentPage, perPage, orderBy, order, currentFilters ) => {
        paginate(currentPage, perPage, orderBy, order, currentFilters);
    }), []);

    useEffect( () => {
        setShowDeliveredButton(false);
        setShowPreparedButton(false);
        if ( selected.length > 0 ) {
            debouncedOrderIndexApiCall(selected);
        } else {
            debouncedOrderIndexApiCall(false);
            setShowDeliveredButton(false);
            setShowPreparedButton(false);
        }
    }, [ selected ] );

    useEffect( () => {
        if ( flash.status === HTTP_CREATED || flash.status === HTTP_OK ) {
            setShowSnackbar(true);
        }
    }, [flash] );

    useEffect( () => {
        setSelected([]);
        if ( filterStatuses.length > 0 || filterDateValue !== null ) {
            const localFilters = {};
            if ( filterStatuses.length > 0 ) {
                localFilters.statuses = filterStatuses;
            }
            if ( filterDateValue !== null ) {
                localFilters.date = filterDateValue;
            }
            debouncedPaginate(meta.current_page, meta.per_page, meta.orderBy, meta.order, localFilters);
        } else {
            debouncedPaginate(meta.current_page, meta.per_page, meta.orderBy, meta.order);
        }
    }, [orders, filterDateValue, filterStatuses]);

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
                    className="flex flex-col justify-between items-end"
                    sx={{ height: '100%' }}
                >
                    <ToggleButtonGroup
                        orientation="vertical"
                        color="primary"
                        className="mb-1"
                        size="small"
                        value={filters}
                        onChange={(e, value) => filterState(value)}
                    >
                        <ToggleButton value="filters"><FilterList /></ToggleButton>
                        { filters.length && <ToggleButton value="status"><SyncProblem /></ToggleButton> }
                        { filters.length && <ToggleButton value="delivery_date"><CalendarMonthOutlined /></ToggleButton> }
                    </ToggleButtonGroup>
                    <Box className="flex flex-col justify-end">
                        <Tooltip title="Mark orders as delivered." placement="right">
                            <Fab
                                onClick={() => Inertia.post( route('admin.orders.status'), { ids: selected, status: 'delivered' } )}
                                className={`transition duration-200 ${ showDeliveredButton ? 'hover:scale-125' : 'scale-0' }`}
                                color="success"
                                size="medium"
                                aria-label="add"
                                sx={{ ml: 2, mt: 2 }}
                            >
                                <LocalShipping />
                            </Fab>
                        </Tooltip>
                        <Tooltip title="Orders prepared." placement="right">
                            <Fab
                                onClick={() => Inertia.post( route('admin.orders.status'), { ids: selected, status: 'prepared' } )}
                                className={`transition duration-200 ${ showPreparedButton ? 'hover:scale-125' : 'scale-0' }`}
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
                </Box>
                <Box className="w-full h-full flex flex-col">
                    <Box className="flex justify-end gap-3">
                        {
                            filters.length > 1 && <Typography className="mt-2">Filter by :</Typography>
                        }
                        {
                            filters.includes('status') &&
                            <FormControl className="mb-2" size="small" sx={{ minWidth: 200 }}>
                                <InputLabel id="select-label">Select a status</InputLabel>
                                <Select
                                    onChange={(e) => {
                                        setFilterStatuses(e.target.value);
                                    }}
                                    value={filterStatuses}
                                    renderValue={(selected) => selected.map(status => status.charAt(0).toUpperCase() + status.substring(1)).join(', ')}
                                    multiple
                                    labelId="select-label"
                                    label="Select a status"
                                >
                                {
                                    statuses.map((status) =>
                                        <MenuItem key={status} value={status}>
                                            <Checkbox size="small" checked={filterStatuses.indexOf(status) > -1} />
                                            {status.charAt(0).toUpperCase() + status.substring(1)}
                                        </MenuItem>)
                                }
                                </Select>
                            </FormControl>
                        }
                        {
                            filters.includes('delivery_date') &&
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    className="mb-2"
                                    label="Delivery Date"
                                    inputFormat="DD/MM/YYYY"
                                    value={filterDate}
                                    onChange={e => {
                                        if ( e && e._isValid ) {
                                            setFilterDate(e);
                                            setFilterDateValue(e.format('YYYY-MM-DD'));
                                        } else {
                                            setFilterDateValue(null);
                                        }
                                    }}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </LocalizationProvider>
                        }
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
                            if ( filterStatuses.length > 0 || filterDateValue !== null ) {
                                const localFilters = {};
                                if ( filterStatuses.length > 0 ) {
                                    localFilters.statuses = filterStatuses;
                                }
                                    if ( filterDateValue !== null ) {
                                    localFilters.date = filterDateValue;
                                }
                                debouncedPaginate(meta.current_page, newPageSize, meta.orderBy, meta.order, localFilters);
                            } else {
                                debouncedPaginate(meta.current_page, newPageSize, meta.orderBy, meta.order);
                            }
                        }}
                        onPageChange={ (newPage) => {
                            if ( filterStatuses.length > 0 || filterDateValue !== null ) {
                                const localFilters = {};
                                if ( filterStatuses.length > 0 ) {
                                    localFilters.statuses = filterStatuses;
                                }
                                if ( filterDateValue !== null ) {
                                    localFilters.date = filterDateValue;
                                }
                                debouncedPaginate(newPage+1, meta.per_page, meta.orderBy, meta.order, localFilters);
                            } else {
                                debouncedPaginate(newPage+1, meta.per_page, meta.orderBy, meta.order);
                            }
                        }}
                        onSortModelChange={ ([gridSortItem]) => {
                            if ( gridSortItem ) {
                                if ( filterStatuses.length > 0 || filterDateValue !== null ) {
                                    const localFilters = {};
                                    if ( filterStatuses.length > 0 ) {
                                        localFilters.statuses = filterStatuses;
                                    }
                                    if ( filterDateValue !== null ) {
                                        localFilters.date = filterDateValue;
                                    }
                                    debouncedPaginate(meta.current_page, meta.per_page, gridSortItem.field, gridSortItem.sort, localFilters);
                                } else {
                                    debouncedPaginate(meta.current_page, meta.per_page, gridSortItem.field, gridSortItem.sort);
                                }
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
            </Box>
        </Nav>
    )
}
