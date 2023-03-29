import React, {useState, useEffect, useRef}  from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { useForm, Link } from '@inertiajs/inertia-react';
import Nav from '@/Components/Nav';
import useInput from '@/hooks/useInput';
import * as moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
    Select,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {
    Add,
    ChevronLeft,
    ChevronRight,
    LocalPhone,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Remove,
} from "@mui/icons-material";
import {styled} from "@mui/material/styles";

export default function CreateOrder({addresses, categories, paymentConfig, shopping_cart, user}) {

    const { locale } = usePage().props;

    const currentMoment = moment()
    const [date, setDate] = useState(currentMoment);
    const [cart, setCart] = useState(shopping_cart.data);
    const [existingAddresses, setExistingAddresses] = useState(addresses.data);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [newAddress, setNewAddress, resetNewAddress] = useInput({
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
        address_id: '',
        delivery_date: currentMoment.format('YYYY-MM-DD'),
        time_slot: '',
    })

    const steps = [
        trans('labels.Confirm items'),
        trans('labels.Choose address'),
        trans('labels.Select delivery time'),
    ];

    const [activeStep, setActiveStep] = useState(0);

    const removeError = function(key) {
        const localAddressErrors = newAddressErrors;
        delete localAddressErrors[key];
        setNewAddressErrors(localAddressErrors);
    }

    const validate = (
        Array.isArray(data.items)
        && data.items.length > 0
        && typeof data.address_id === 'number'
        && data.address_id > 0
        && typeof data.delivery_date === 'string'
        && data.delivery_date.length === 10
        && typeof data.time_slot === 'number'
    );

    const subTotal = function() {
         return cart.reduce((total, {qty, product}) => total + qty * product.current_selling_price, 0)
    }

    const serviceCharge = function() {
        switch (paymentConfig.service_charge_type) {
            case 'percentage':
                return ((subTotal() * paymentConfig.service_charge_amount)/100.0)
            case 'amount':
                return paymentConfig.service_charge_amount;
        }
    }

    const qtyTotal = function() {
        return cart.reduce((total, {qty}) => total + qty, 0)
    }

    function name(product) {
        switch(locale) {
            case 'en':
                return product.english_name;
            case 'bn':
                return product.bangla_name;
            default:
                return product.english_name;
        }
    }

    function uom(product) {
        switch(locale) {
            case 'en':
                return product.uom;
            case 'bn':
                return product.uomBangla;
            default:
                return product.uom;
        }
    }

    const SelectedAddress = function() {
        return (
            <Card variant="outlined">
                <Stack spacing={0} className="p-3">
                    <GreenFont className="font-bold" key="deliver-label" variant="button" gutterBottom={true}>{ trans( 'labels.Deliver to' ) }:</GreenFont>
                    <Typography variant="body1" gutterBottom={true}>{selectedAddress.full_name}</Typography>
                    {
                        selectedAddress.business_name && selectedAddress.business_name.length
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
        )
    }
    const NextStep = function ({step}) {

        switch (step) {
            case 0:
                return <Button onClick={() => setActiveStep(1)} variant="contained">{trans('labels.Confirm items')}</Button>
            case 1:
                return <Button onClick={() => setActiveStep(0)} startIcon={<ChevronLeft />} variant="outlined" >
                    { trans('labels.Back to cart') }
                </Button>
            case 2:
                return <Button onClick={() => setActiveStep(1)} startIcon={<ChevronLeft />} variant="outlined" >
                    { trans('labels.Back to address') }
                </Button>
        }
    }
    const GreenFont = styled( (props) => (
        <Typography {...props} />
    ))(({ theme}) =>({
        color: theme.palette.success.main,
        //borderColor: theme.palette.grey[500]
    }));
    const SubtotalCard = function() {
        return (
            <Card className="w-full" variant="outlined">
                <Stack spacing={2} className="py-3 px-5">
                    <Stack justifyContent="space-between" direction="row">
                        <Typography align="center">{trans('labels.Subtotal')} ({ trans( 'labels.N items', { N: qtyTotal() } ) } )
                        </Typography>
                        <Box className="flex justify-end items-center">
                            <GreenFont align="center" className="font-bold mr-1 text-2xl">৳ </GreenFont>
                            <Typography align="center" className="font-bold">
                                {subTotal().toFixed(2)}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack justifyContent="space-between" direction="row">
                        <Typography align="center">
                            { trans('labels.Service charge') }
                        </Typography>
                        <Box className="flex justify-end items-center">
                            <GreenFont align="center" className="font-bold mr-1">৳ </GreenFont>
                            <Typography align="center" className="font-bold">
                                {serviceCharge()}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack space={1} className="border-t-2 pt-2" justifyContent="space-between" direction="row">
                        <Typography align="center" className="font-bold">
                            { trans( 'labels.Total' ) }
                        </Typography>
                        <Box className="flex justify-end items-center">
                            <GreenFont align="center" className="font-bold text-2xl mr-2">৳ </GreenFont>
                            <Typography align="center" className="font-bold text-2xl">
                                {subTotal() + serviceCharge()}
                            </Typography>
                        </Box>
                    </Stack>
                    <NextStep step={activeStep} />
                </Stack>
            </Card>
        );
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
                            onClick={() => {
                                if ( (activeStep === 0 || activeStep === 1) && index === 2) {
                                    if (selectedAddress === null) {
                                        return
                                    }
                                }

                                setActiveStep(index)
                            }}
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
                                <Typography className="font-bold text-lg mx-4 mt-3">1. {trans('labels.Confirm your items')}</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{ trans('labels.Item') }</TableCell>
                                                <TableCell align="right">{trans('labels.Quantity')}</TableCell>
                                                <TableCell align="right">{trans('labels.Unit price')}</TableCell>
                                                <TableCell align="right">{trans('labels.Total')}</TableCell>
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
                                                                <Typography>{ name(row.product) }</Typography>
                                                                <Typography variant="caption">{ row.product.amount } { uom(row.product) }</Typography>
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
                                                    <Typography className="font-bold" variant="subtitle2">{ trans( 'labels.Subtotal' ) }</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%'}} align="center">
                                                    <Typography className="font-bold" variant="subtitle2">{qtyTotal()}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '20%'}} align="right"/>
                                                <TableCell sx={{ width: '20%'}} align="right">
                                                    <Box className=" w-full flex flex-row justify-end items-center">
                                                    <GreenFont align="center" className="font-bold mr-2">৳ </GreenFont>
                                                    <Typography className="font-bold" variant="subtitle2"> {subTotal()}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ width: '50%'}}>
                                                    <Typography className="font-bold" variant="subtitle2">{ trans( 'labels.Service charge' ) }</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%'}} align="center">
                                                    <Typography className="font-bold" variant="subtitle2">{
                                                        paymentConfig.service_charge_type === 'percentage'
                                                            ? (paymentConfig.service_charge_amount + ' %')
                                                            : ('৳ ' + paymentConfig.service_charge_amount)
                                                    }</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '20%'}} align="right"/>
                                                <TableCell sx={{ width: '20%'}} align="right">
                                                    <Box className=" w-full flex flex-row justify-end items-center">
                                                        <GreenFont align="center" className="font-bold mr-2">৳ </GreenFont>
                                                        <Typography className="font-bold" variant="subtitle2"> {serviceCharge()}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ width: '50%'}}>
                                                    <Typography className="font-bold" variant="subtitle2">{ trans('labels.Total') }</Typography>
                                                </TableCell>
                                                <TableCell sx={{ width: '10%'}} align="center">
                                                </TableCell>
                                                <TableCell sx={{ width: '20%'}} align="right"/>
                                                <TableCell sx={{ width: '20%'}} align="right">
                                                    <Box className=" w-full flex flex-row justify-end items-center">
                                                        <GreenFont align="center" className="font-bold mr-2">৳ </GreenFont>
                                                        <Typography className="font-bold" variant="subtitle2"> {subTotal() + serviceCharge()}</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Card>
                            <Stack spacing={1} className="w-full  lg:w-2/5">
                                <SubtotalCard />
                            </Stack>
                        </Box>
                    )
                }
                {
                    activeStep === 1 &&
                    (
                        <Box className="w-full items-start flex flex-wrap lg:flex-nowrap">
                            <Card className="w-full lg:w-3/5 mb-2 lg:mr-2" variant="outlined">
                                <Stack className="px-4 py-3" spacing={2} component="form">
                                    <Typography className="font-bold text-lg">2. {trans('labels.Select your delivery address')}</Typography>
                                    {
                                        ! useNewAddress && (
                                            <FormControl size="small"  required={true}>
                                                <InputLabel id="demo-simple-select-helper-label">{ trans( 'labels.Select an existing address' ) }</InputLabel>
                                                <Select
                                                    label={ trans( 'labels.Select an existing address' ) }
                                                    value={data.address_id}
                                                    onChange={(e) => {
                                                        setData('address_id', e.target.value);
                                                        if (e.target.value === "") {
                                                            setSelectedAddress(null);
                                                        } else {
                                                            setSelectedAddress(existingAddresses.find(({id}) => id === e.target.value))
                                                        }
                                                    }}
                                                >
                                                    <MenuItem key="none" value=""> <em>None</em> </MenuItem>
                                                    {
                                                        existingAddresses.map(({id, full_name, business_name, address}) => <MenuItem
                                                            value={id}
                                                            key={id}
                                                        >
                                                            {full_name} {business_name} - {address}
                                                        </MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                        )
                                    }
                                    <Box className="flex justify-between">
                                        <Button
                                            onClick={() => {
                                                setSelectedAddress(null);
                                                setData('address_id', '');
                                                setUseNewAddress(!useNewAddress);
                                            }}
                                            startIcon={useNewAddress ? <Remove /> : <Add />}
                                        >
                                            { useNewAddress ? trans('labels.Use an existing address' ): trans('labels.Add a new address') }
                                        </Button>
                                        {
                                            selectedAddress &&
                                            <Button
                                                onClick={() => setActiveStep(2)}
                                                endIcon={<ChevronRight/>}
                                                variant="contained"
                                            >
                                                {trans('labels.Select delivery time')}
                                            </Button>
                                        }
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
                                                    axios.post( route('api.addresses.store'), newAddress)
                                                        .then(({data}) => {
                                                            setData('address_id', data.id );
                                                            setExistingAddresses([...existingAddresses, data]);
                                                            setSelectedAddress(data);
                                                            setActiveStep(2);
                                                            resetNewAddress()
                                                            setUseNewAddress(false);
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
                            <Stack spacing={1} className="w-full  lg:w-2/5">
                                <SubtotalCard />
                                {
                                    selectedAddress && (
                                        <SelectedAddress />
                                    )
                                }
                            </Stack>
                        </Box>
                    )
                }
                {
                    activeStep === 2 && (
                        <Box className="w-full items-start flex flex-wrap lg:flex-nowrap">
                            <Card className="w-full lg:w-3/5 mb-2 lg:mr-2 " variant="outlined">
                                <Stack className="px-4 py-3" spacing={2} component="form">
                                    <Typography className="font-bold text-lg">3. {trans('labels.Select delivery time')}</Typography>
                                    <LocalizationProvider className="flex-grow" dateAdapter={AdapterMoment}>
                                        <DesktopDatePicker
                                            className="w-1/2"
                                            label={ trans('labels.Delivery date' ) }
                                            inputFormat="DD/MM/YYYY"
                                            value={date}
                                            disablePast={true}
                                            shouldDisableDate={(date) => {
                                                return false;
                                            }}
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
                                        <InputLabel id="demo-simple-select-helper-label">{ trans( 'labels.Time slot' ) }</InputLabel>

                                        <Select label="Time slot"
                                                value={data.time_slot}
                                                onChange={(e) => setData('time_slot', e.target.value)}
                                        >
                                            <MenuItem value=""> Not Selected </MenuItem>
                                            <MenuItem value={0}>11AM - 1PM</MenuItem>
                                            <MenuItem value={1}>1PM - 4PM</MenuItem>
                                            <MenuItem value={2}>4PM - 7PM</MenuItem>
                                            <MenuItem value={3}>7PM - 10PM</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        color="success"
                                        disabled={!validate}
                                        variant={validate ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            post( route('orders.store'), {
                                                onError: (err) => {
                                                    console.log(err);
                                                }
                                            });
                                        }}
                                    >
                                        { trans('labels.Place order') }
                                    </Button>
                                </Stack>
                            </Card>
                            <Stack spacing={1} className="w-full  lg:w-2/5">
                                <SubtotalCard />
                                <SelectedAddress />
                            </Stack>
                        </Box>
                    )
                }
            </Stack>
        </Nav>
    );
}
