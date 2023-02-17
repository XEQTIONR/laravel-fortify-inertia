import React, {useState, useEffect, useRef}  from 'react';
import { useForm, Link } from '@inertiajs/inertia-react';
import Nav from '@/Components/Nav';
import useInput from '@/hooks/useInput';

import {
    Button,
    Box,
    Card,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Stack,
    TextField,
    Typography,
    TableFooter,
    Select,
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
import {KeyboardArrowUp, KeyboardArrowDown, LocalPhone, Add, Remove} from "@mui/icons-material";

export default function CreateOrder({addresses, categories, shopping_cart, user}) {

    const currentMoment = moment()
    const [date, setDate] = useState(currentMoment);
    const [cart, setCart] = useState(shopping_cart);
    const [existingAddresses, setExistingAddresses] = useState(addresses.data);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useInput({
        'full_name': '',
        'business_name': '',
        'address': '',
        'phone_number': user.primary_contact_number,
    });
    const [newAddressErrors, setNewAddressErrors] = useState({});
    const [selectedAddress, setSelectedAddress] = useState(null);

    const refValidDate = useRef(true);
    const { data, setData, post, processing } = useForm({
        items: cart,
        address: null,
        delivery_date: currentMoment.format('YYYY-MM-DD'),
        time_slot: '',
    })

    const steps = [
        'Confirm items',
        'Choose Address',
        'Select delivery time',
    ];

    const [activeStep, setActiveStep] = useState(0);

    const removeError = function(key) {
        const localAddressErrors = newAddressErrors;
        delete localAddressErrors[key];
        setNewAddressErrors(localAddressErrors);
    }

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
                        <Box className="w-full items-start flex flex-wrap lg:flex-nowrap">
                            <Card className="w-full lg:w-3/5 mb-2 lg:mr-2" variant="outlined">
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
                            <Card className="w-full lg:w-2/5" variant="outlined">
                                <Stack spacing={2} className="p-3">
                                    <Typography align="center" className="text-lg">Subtotal ({qtyTotal()} items)
                                    </Typography>
                                    <Typography align="center" className="font-bold text-2xl">
                                        ৳ {subTotal()}
                                    </Typography>

                                    <Button onClick={() => setActiveStep(1)} variant="contained">Confirm Items</Button>
                                </Stack>
                            </Card>
                        </Box>
                    )

                }
                {
                    activeStep === 1 &&
                    (
                        <Box className="w-full items-start flex flex-wrap lg:flex-nowrap">
                            <Card className="w-full lg:w-3/5 mb-2 lg:mr-2" variant="outlined">
                                <Stack className="px-4 py-3" spacing={2} component="form">
                                    <Typography className="font-bold text-lg">2. Select delivery address.</Typography>
                                    {
                                        ! useNewAddress && (
                                            <FormControl size="small"  required={true}>
                                                <InputLabel id="demo-simple-select-helper-label">Select Existing Address</InputLabel>
                                                <Select
                                                    label="Select Existing Address"
                                                    // value={data.time_slot}
                                                    onChange={(e) => {
                                                        console.log('select address', e.target.value)
                                                    }}
                                                >
                                                    <MenuItem value=""> <em>None</em> </MenuItem>
                                                    {
                                                        existingAddresses.map(({id, full_name, business_name, address}) => <MenuItem value={id}>
                                                            {full_name} {business_name} - {address}
                                                        </MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        )
                                    }
                                    <Box>
                                        <Button
                                            onClick={() => setUseNewAddress(!useNewAddress)}
                                            startIcon={useNewAddress ? <Remove /> : <Add />}
                                        >
                                            { useNewAddress ? 'Use an existing address' : 'Add a new address' }
                                        </Button>
                                    </Box>
                                    { useNewAddress && (
                                        <>
                                            <TextField
                                                required
                                                size="small"
                                                name="full_name"
                                                value={newAddress.full_name}
                                                onChange={(e) => {
                                                    removeError('full_name');
                                                    setNewAddress(e);
                                                }}
                                                error={newAddressErrors.hasOwnProperty('full_name')}
                                                label={trans('labels.Full name')}
                                                helperText={newAddressErrors.hasOwnProperty('full_name') && newAddressErrors['full_name'][0]}
                                            />
                                            <TextField
                                                size="small"
                                                name="business_name"
                                                value={newAddress.business_name}
                                                onChange={(e) => {
                                                removeError('business_name');
                                                    setNewAddress(e)
                                                }}
                                                error={newAddressErrors.hasOwnProperty('business_name')}
                                                label={trans('labels.Business name')}
                                                helperText={newAddressErrors.hasOwnProperty('business_name') && newAddressErrors['business_name'][0]}
                                            />
                                            <TextField
                                                multiline
                                                rows={4}
                                                size="small"
                                                required
                                                name="address"
                                                label={trans('labels.Address')}
                                                value={newAddress.address}
                                                error={newAddressErrors.hasOwnProperty('address')}
                                                onChange={(e) => {
                                                    removeError('address');
                                                    setNewAddress(e)
                                                }}
                                                helperText={newAddressErrors.hasOwnProperty('address') && newAddressErrors['address'][0]}
                                            />
                                            <TextField
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">+88</InputAdornment>
                                                }}
                                                name="phone_number"
                                                label={trans('labels.Phone number')}
                                                value={newAddress.phone_number}
                                                error={newAddressErrors.hasOwnProperty('phone_number')}
                                                onChange={(e) => {
                                                    removeError('phone_number');
                                                    setNewAddress(e)
                                                }}
                                                helperText={newAddressErrors.hasOwnProperty('phone_number') && newAddressErrors['phone_number'][0]}
                                            />
                                            <Button
                                                onClick={() => {
                                                    axios.post( route('api.users.addresses.store', { user: user.id }), newAddress)
                                                        .then(({data}) => {
                                                        setData('address', data.id );
                                                        setSelectedAddress(data);
                                                        setActiveStep(2)
                                                    }).catch(({ response }) => {
                                                        setNewAddressErrors(response.data.errors);
                                                    })
                                                }}
                                                variant="contained"
                                            >
                                                {trans('labels.Save new address')}
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </Card>
                            <Card className="w-full  lg:w-2/5" variant="outlined">
                                <Stack spacing={2} className="p-3">
                                    <Typography align="center" className="text-lg">Subtotal ({qtyTotal()} items)
                                    </Typography>
                                    <Typography align="center" className="font-bold text-2xl">
                                        ৳ {subTotal()}
                                    </Typography>

                                    <Button variant="outlined" onClick={() => setActiveStep(0)}>Back to cart</Button>
                                </Stack>
                            </Card>
                        </Box>
                    )
                }
                {
                    activeStep === 2 && (
                        <Box className="w-full items-start flex flex-wrap lg:flex-nowrap">
                            <Card className="w-full lg:w-3/5 mb-2 lg:mr-2 " variant="outlined">
                                <Stack className="px-4 py-3" spacing={2} component="form">
                                    <Typography className="font-bold text-lg">3. Select delivery window.</Typography>
                                    <LocalizationProvider className="flex-grow" dateAdapter={AdapterMoment}>
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
                                    <FormControl  required={true}>
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
                                    <Button variant="contained">Place order</Button>
                                </Stack>
                            </Card>
                            <Stack spacing={2} className="w-full  lg:w-2/5">
                            <Card variant="outlined">
                                <Stack spacing={2} className="p-3">
                                    <Typography align="center" className="text-lg">Subtotal ({qtyTotal()} items)
                                    </Typography>
                                    <Typography align="center" className="font-bold text-2xl">
                                        ৳ {subTotal()}
                                    </Typography>

                                    <Button variant="outlined" onClick={() => setActiveStep(0)}>Back to cart</Button>
                                </Stack>
                            </Card>
                            <Card variant="outlined">
                                <Stack spacing={0} className="p-3">
                                    <Typography key="deliver-label" variant="caption" gutterBottom={true}>Deliver To:</Typography>
                                    <Typography variant="body1" gutterBottom={true}>{selectedAddress.full_name}</Typography>
                                    {
                                        selectedAddress.business_name.length
                                        && <Typography key="business-name" variant="body1" gutterBottom={true}>
                                            {selectedAddress.business_name}
                                        </Typography>
                                    }
                                    {
                                        selectedAddress.address.split('\n')
                                            .filter((element, index, array) => index !== array.length - 1)
                                            .map((line, index) => <Typography key={'address-line-' + index} variant="body1">{line}</Typography>)
                                    }
                                    {
                                        selectedAddress.address.split('\n')
                                            .filter((element, index, array) => index === array.length - 1)
                                            .map((line) => <Typography key={'address-last-line'} variant="body1" gutterBottom={true}>{line}</Typography>)
                                    }
                                    <Typography key="phone-number" variant="body1">
                                        <LocalPhone className="mr-2" fontSize="small" />
                                        {selectedAddress.phone_number}
                                    </Typography>
                                </Stack>
                            </Card>
                            </Stack>
                        </Box>
                    )
                }
            </Stack>
        </Nav>
    );
}
