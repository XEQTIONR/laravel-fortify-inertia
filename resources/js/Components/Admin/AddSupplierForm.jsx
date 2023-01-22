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

export default function AddSupplierForm () {

    const { data, setData, post, processing, progress, errors } = useForm({
        'contact_name' : '',
        'business_name' : '',
        'address' : '',
        'email' : '',
        'primary_contact_number': '',
        'secondary_phone_number': '',
        'status' : 'inactive'
    });

    function handleSubmit(e) {
        e.preventDefault();
        post( route('admin.suppliers.store'), {
            onError: (err) => {
                console.log(err);
            },
        })
    }

    return(
        <FormWrapper elevation={24}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={1} className="p-10">
                    <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>Add a new supplier</Typography>
                    <Divider />
                    <TextField
                        onChange={({ target }) => setData('contact_name', target.value)}
                        required
                        label="Contact Name"
                        variant="standard"
                    />
                    <TextField
                        onChange={({target}) => setData('business_name', target.value)}
                        label="Business Name"
                        variant="standard"
                    />
                    <TextField
                        onChange={({target}) => setData('address', target.value)}
                        label="Address"
                        multiline
                        rows={2}
                        variant="standard"
                    />
                    <TextField
                        onChange={({target}) => setData('email', target.value)}
                        label="Email Address"
                        variant="standard"
                    />
                    <TextField
                        onChange={({target}) => setData('primary_contact_number', target.value)}
                        required
                        label="Mobile Number"
                        variant="standard"
                    />
                    <TextField
                        onChange={({target}) => setData('secondary_contact_number', target.value)}
                        label="Secondary Contact Number"
                        variant="standard"
                    />

                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
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
