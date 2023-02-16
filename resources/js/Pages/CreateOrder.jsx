import React, {useState, useEffect, useRef}  from 'react';
import { useForm, Link } from '@inertiajs/inertia-react';
import Nav from '@/Components/Nav';
import {
    Button,
    Box,
    Card,
    FormControl,
    IconButton,
    InputLabel,
    Stack,
    TextField,
    Typography,
    TableFooter,
    Select,
    MenuItem,
} from '@mui/material';
import * as moment from 'moment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {KeyboardArrowUp, KeyboardArrowDown} from "@mui/icons-material";

function createData(name, calories, fat, carbs) {
    return { name, calories, fat, carbs };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24),
    createData('Ice cream sandwich', 237, 9.0, 37),
    createData('Eclair', 262, 16.0, 24),
    createData('Cupcake', 305, 3.7, 67),
    createData('Gingerbread', 356, 16.0, 49),
];

export default function CreateOrder({categories, shopping_cart, user}) {

    const currentMoment = moment()
    const [date, setDate] = useState(currentMoment);
    const [cart, setCart] = useState(shopping_cart);
    const refValidDate = useRef(true);
    const { data, setData, post, processing } = useForm({
        items: cart,
        address: '',
        business_name: '',
        delivery_date: currentMoment.format('YYYY-MM-DD'),
        time_slot: '',
    })

    const steps = [
        'Confirm items',
        'Select delivery options',
        'Place order',
    ];

    const [activeStep, setActiveStep] = useState(0);

    const subTotal = function() {
         return cart.reduce((total, {qty, product}) => total + qty * product.current_selling_price, 0)
    }

    const qtyTotal = function() {
        return cart.reduce((total, {qty}) => total + qty, 0)
    }

    return (
        <Nav
            navLinks={categories.data}
            selectedCategory={null}
            showUserMenu={true}
            user
        >
            <Stack spacing={3} className="w-full mt-6 px-6">
                <Card className=" py-3" variant="outlined">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step
                            onClick={()=> setActiveStep(index)}
                            key={label}>
                            <StepLabel className="hover:cursor-pointer">{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                </Card>
                {
                    activeStep === 0 &&
                    (
                        <Stack alignItems="flex-start" direction="row" spacing={1} className="w-full flex-wrap lg:flex-nowrap" >
                            <Card className="w-full  lg:w-3/5" variant="outlined">
                                <Typography className="font-bold text-lg mx-4 mt-3">1. Confirm your items.</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Unit Price</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                >
                                                    <TableCell sx={{ width: '50%'}}>
                                                        <Stack spacing={3} direction="row">
                                                            <Box sx={{
                                                                width: 75, height: 75,
                                                                backgroundImage: "url('" + row.product.image + "')"
                                                            }} />
                                                            <Stack>
                                                                <Typography>{row.product.english_name}</Typography>
                                                                <Typography variant="caption">{row.product.amount} {row.product.uom}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ width: '10%'}} align="center">
                                                        <IconButton
                                                            onClick={() => {
                                                                axios.put( route('api.carts.update', {  cart: row.id }), {
                                                                    qty: row.qty+1
                                                                })
                                                                    .then(({data}) => {
                                                                        if (data.action === 'update') {
                                                                            // const update = items.find(({id}) => data.cart.id)
                                                                            const updated = cart.map((anItem) => {
                                                                                if (data.cart.id === anItem.id) {
                                                                                    anItem.qty = data.cart.qty;
                                                                                }
                                                                                return anItem
                                                                            })
                                                                            setCart(updated);
                                                                            //console.log(update);
                                                                        }
                                                                    })
                                                                    .catch((e) => {
                                                                        console.log('err', e)
                                                                    })
                                                            }}
                                                        >
                                                            <KeyboardArrowUp fontSize="inherit" />
                                                        </IconButton>
                                                        <Stack>{row.qty}</Stack>
                                                        <IconButton
                                                            onClick={() => {
                                                                axios.put( route('api.carts.update', { cart: row.id }), {
                                                                    qty: row.qty-1
                                                                })
                                                                    .then(({data}) => {
                                                                        console.log(data);
                                                                        if (data.action === 'update') {
                                                                            // const update = items.find(({id}) => data.cart.id)
                                                                            setCart(cart.map((anItem) => {
                                                                                if (data.cart.id === anItem.id) {
                                                                                    anItem.qty = data.cart.qty;
                                                                                }
                                                                                return anItem
                                                                            }));
                                                                            //console.log(update);
                                                                        } else if ( data.action === 'delete') {
                                                                            setCart(cart.filter( (anItem) => anItem.id !== data.id ))
                                                                        }
                                                                    })
                                                                    .catch((e) => {
                                                                        console.log('err', e)
                                                                    })
                                                            }}
                                                        >
                                                            <KeyboardArrowDown fontSize="inherit" />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{ width: '20%'}} align="right">৳ {row.product.current_selling_price}</TableCell>
                                                    <TableCell sx={{ width: '20%'}} align="right">৳ {(row.qty * row.product.current_selling_price)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell sx={{ width: '50%'}}>
                                                    <Typography className="font-bold" variant="subtitle2">Sub Total</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%'}} align="center">
                                                    <Typography className="font-bold" variant="subtitle2">{qtyTotal()}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '20%'}} align="right"/>
                                                <TableCell sx={{ width: '20%'}} align="right">
                                                    <Typography className="font-bold" variant="subtitle2">৳ {subTotal()}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Card>
                            <Card className="w-full  lg:w-2/5" variant="outlined">
                                <Stack spacing={2} className="p-3">
                                    <Typography align="center" className="text-lg">Subtotal ({qtyTotal()} items)
                                    </Typography>
                                    <Typography align="center" className="font-bold text-2xl">
                                        ৳ {subTotal()}
                                    </Typography>

                                    <Button onClick={() => setActiveStep(1)} variant="contained">Confirm Items</Button>
                                </Stack>
                            </Card>
                        </Stack>
                    )

                }
                {
                    activeStep === 1 &&
                    (
                        <Stack alignItems="flex-start" direction="row" spacing={1} className="w-full flex-wrap lg:flex-nowrap">
                            <Card className="w-full  lg:w-3/5" variant="outlined">
                                <Stack className="px-4 py-3" spacing={2} component="form">
                                    <Typography className="font-bold text-lg">2. Select delivery address and time.</Typography>
                                    <TextField
                                        multiline
                                        rows={4}
                                        size="small"
                                        required
                                        label={trans('labels.Address')}
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                    <TextField
                                        size="small"
                                        value={data.business_name}
                                        onChange={e => setData('business_name', e.target.value)}
                                        label={trans('labels.Business name')}
                                    />
                                    <Stack spacing={2} alignItems="flex-start" direction="row">
                                        <LocalizationProvider
                                            className="flex-grow"
                                            dateAdapter={AdapterMoment}
                                        >
                                            <DesktopDatePicker
                                                className="w-1/2"
                                                label="Delivery Date"
                                                inputFormat="DD/MM/YYYY"
                                                value={date}
                                                onError={() => {
                                                    console.log('error');
                                                }}
                                                onChange={e => {
                                                    if (e && e._isValid) {
                                                        setDate(e)
                                                        setData('delivery_date', e.format('YYYY-MM-DD'));
                                                        refValidDate.current = true;

                                                    } else {
                                                        refValidDate.current = false;
                                                    }

                                                }}
                                                renderInput={(params) =>
                                                    <TextField {...params}
                                                               required={true}
                                                               error={!refValidDate.current}
                                                               helperText={!refValidDate.current && 'Invalid date'}
                                                    />}
                                            />
                                        </LocalizationProvider>
                                        <FormControl  required={true} className="flex-grow">
                                            <InputLabel id="demo-simple-select-helper-label">Time slot</InputLabel>

                                            <Select label="Time slot"
                                                    value={data.time_slot}
                                                    onChange={(e) => setData('time_slot', e.target.value)}
                                            >
                                                <MenuItem value=""> Not Selected </MenuItem>
                                                <MenuItem value={1}>11AM - 1PM</MenuItem>
                                                <MenuItem value={2}>1PM - 4PM</MenuItem>
                                                <MenuItem value={3}>4PM - 7PM</MenuItem>
                                                <MenuItem value={3}>7PM - 10PM</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Button
                                        onClick={() => setActiveStep(2) }
                                        variant="contained"
                                    >Confirm Address</Button>
                                </Stack>
                            </Card>
                            <Card className="w-full  lg:w-2/5" variant="outlined">
                                <Stack spacing={2} className="p-3">
                                    <Typography align="center" className="text-lg">Subtotal ({qtyTotal()} items)
                                    </Typography>
                                    <Typography align="center" className="font-bold text-2xl">
                                        ৳ {subTotal()}
                                    </Typography>

                                    <Button variant="outlined" onClick={() => setActiveStep(1)}>Back to cart</Button>
                                </Stack>
                            </Card>
                        </Stack>
                    )
                }
                {
                    activeStep === 2 && (<h1>SOmething</h1>)
                }
            </Stack>
        </Nav>
    );
}
