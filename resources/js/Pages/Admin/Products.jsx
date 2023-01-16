import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

import { Add, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    Tooltip,
    Modal,
    Paper,
    Select,
    Stack,
    Typography,
    TextField,
    useMediaQuery,
} from '@mui/material'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

//import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

const AddProductForm = styled( Paper )(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        mx: 2
    },
    [theme.breakpoints.down('md')]: {
        minWidth: '50vw',
        maxWidth: 450
    },
    [theme.breakpoints.up('md')]: {
        width: 450
    },
}));

export default function Products({ products }) {


    const [isLoading, setIsLoading] = useState(false)
    const [rows, setRows] = useState(products);
    const [ selected, setSelected ] =  useState([]);
    const [ showAddForm, setShowAddForm ] = useState(false);
    const [ uploadedImageUrl, setUploadedImageUrl ] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        'english_name' : null,
        'bangla_name' : null,
        'uom' : null,
        'current_selling_price' : null,
        'image' : null,
    })

    function handleSubmit(e) {
        e.preventDefault();
        post( route('admin.products.store'), {
            //forceFormData: true,
            onError: (err) => {
                console.log('submit error');
                console.log(err);
            }
        })
    }


    const blockButtonQuery = useMediaQuery('(max-width:600px)');

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
    useEffect(() => {

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
                onClose={()=> setShowAddForm(false)}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <AddProductForm elevation={24}>
                    <form onSubmit={handleSubmit}>
                    <Stack spacing={2}
                           sx={{ p: 5, backgroundColor: 'white', borderRadius: 1 }}
                    >
                        <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>Add a new product</Typography>
                        <Divider />
                        <TextField
                            onChange={({ target }) => setData('english_name', target.value)}
                            required
                            id="outlined-required"
                            label="Name"
                            variant="standard"
                        />
                        <TextField
                            onChange={({target}) => setData('bangla_name', target.value)}
                            required
                            id="outlined-required"
                            label="Name (Bangla)"
                            variant="standard"
                        />
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Current Selling Price</InputLabel>
                            <Input
                                onChange={({target}) => setData('current_selling_price', target.value)}
                                type="number"
                                inputProps={{min: 0, step: 0.01, style: { textAlign: 'right' }}}
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">৳</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                        {/*<FormControl variant="standard" sx={{ m: 1 }}>*/}
                        {/*    <InputLabel id="demo-simple-select-standard-label">Unit Of Measure</InputLabel>*/}
                        {/*    <Select*/}
                        {/*        onChange={ ({target}) => setData('uom', target.value) }*/}
                        {/*        id="select-input-id"*/}
                        {/*        label="Age"*/}
                        {/*    >*/}
                        {/*        <MenuItem value="none">None</MenuItem>*/}
                        {/*        <MenuItem value="ten">Ten</MenuItem>*/}
                        {/*        <MenuItem value="twenty">Twenty</MenuItem>*/}
                        {/*        <MenuItem value="thirty">Thirty</MenuItem>*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}

                        <Stack spacing={2} sx={{ height: 1/3}}>
                            <Typography>Product Image</Typography>
                            <Stack direction="row" sx={{ height: 1/2 }}>
                                <Box sx={{ width: 1/2 }}>
                                    {   uploadedImageUrl
                                        ? (
                                            <Button
                                                variant="outlined"
                                                onClick={() => setUploadedImageUrl(null)}
                                            >
                                                Remove Image
                                            </Button>
                                        )
                                        : (
                                            <Button sx={{ mr: 2 }} variant="outlined" component="label">
                                                Select Image
                                                <input hidden accept="image/*" type="file" onChange={(e) => {
                                                    setData('image', e.target.files[0])
                                                    setUploadedImageUrl(URL.createObjectURL(e.target.files[0]))
                                                }} />
                                            </Button>
                                        )
                                    }
                                </Box>
                                <Box style={{
                                    width: "50%",
                                }}>
                                    <Box sx={{
                                        backgroundColor: "#eee",
                                        width: "100%",
                                        height: "0",
                                        paddingTop: "100%",
                                        position: "relative"
                                    }}>
                                        {   uploadedImageUrl
                                            ? <img
                                                style={{
                                                    position: 'absolute',
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                }}
                                                src={uploadedImageUrl}
                                            /> :
                                            (<Box sx={{
                                            position: 'absolute',
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            }}>
                                                <InsertPhotoIcon sx={{
                                                    fontSize: '3rem',
                                                    color: '#999',
                                                }} />
                                                <Typography color="#888" align="center" variant="button">No Image Selected</Typography>
                                            </Box>)
                                        }
                                    </Box>
                                </Box>
                            </Stack>
                        </Stack>
                        <Stack sx={{ pt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Submit
                        </Button>
                        </Stack>
                    </Stack>
                    </form>
                </AddProductForm>
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
                        <Tooltip title="Add a new product." placement="right"
                        >
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
