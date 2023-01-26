import React from 'react';
import {
    Button,
    Divider,
    FormGroup,
    FormControlLabel,
    LinearProgress,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { useForm } from "@inertiajs/inertia-react";


const FormWrapper = styled( Paper )(({ theme }) => ({
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

export default function SupplierForm ({ action, supplierData }) {

    const { data, setData, post, put, processing, progress, errors } = useForm({
        'contact_name' : supplierData ? supplierData.contact_name : '',
        'business_name' : supplierData ? supplierData.business_name : '',
        'address' : supplierData ? supplierData.address : '',
        'email' : supplierData ? supplierData.email : '',
        'primary_contact_number': supplierData ? supplierData.primary_contact_number : '',
        'secondary_phone_number': supplierData ? supplierData.secondary_contact_number : '',
        'status' : supplierData ? supplierData.status : 'active'
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (action === 'add') {
            post( route('admin.suppliers.store'), {
                onError: (err) => {
                    console.log(err);
                },
            })
        } else if (action === 'edit') {
            put( route('admin.suppliers.update', {
                supplier: supplierData.id
            }), {
                onError: (err) => {
                    console.log(err);
                },
            })
        }

    }

    return(
        <FormWrapper elevation={24}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={1} className="p-10">
                    <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>
                        { action.substring(0,1).toUpperCase() + action.substring(1) + " supplier" }
                    </Typography>
                    <Divider />
                    <TextField
                        value={data.contact_name}
                        onChange={({ target }) => setData('contact_name', target.value)}
                        required
                        label="Contact Name"
                        variant="standard"
                    />
                    <TextField
                        value={data.business_name}
                        onChange={({target}) => setData('business_name', target.value)}
                        label="Business Name"
                        variant="standard"
                    />
                    <TextField
                        value={data.address}
                        onChange={({target}) => setData('address', target.value)}
                        label="Address"
                        multiline
                        rows={2}
                        variant="standard"
                    />
                    <TextField
                        value={data.email}
                        onChange={({target}) => setData('email', target.value)}
                        label="Email Address"
                        variant="standard"
                    />
                    <TextField
                        value={data.primary_contact_number}
                        onChange={({target}) => setData('primary_contact_number', target.value)}
                        required
                        label="Mobile Number"
                        variant="standard"
                    />
                    <TextField
                        value={data.secondary_contact_number}
                        onChange={({target}) => setData('secondary_contact_number', target.value)}
                        label="Secondary Contact Number"
                        variant="standard"
                    />

                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={ data.status === 'active' }
                                    onChange={({target}) =>
                                        setData('status', target.checked ? 'active' : 'inactive')}
                                />
                            }
                            label={ data.status.substring(0,1).toUpperCase() + data.status.substring(1) }
                        />
                    </FormGroup>

                    <Stack className="pt-4">
                        { progress ? ( <LinearProgress variant="determinate" value={progress.percentage} /> ) : null }
                        <Button disabled={processing} type="submit" variant="contained">Submit</Button>
                    </Stack>
                </Stack>
            </form>
        </FormWrapper>
    );
}
