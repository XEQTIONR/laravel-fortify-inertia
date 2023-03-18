import React, { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    InputAdornment,
    InputLabel,
    LinearProgress,
    ListItemText,
    MenuItem,
    Paper,
    Select,
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

export default function StaffForm () {

    const formData = {
      'name': '',
      'email': '',
      'mobile_number': '',
      'password': '',
      'password_confirmation': '',
    };

    const { data, setData, post, processing, errors } = useForm(formData);

    function handleSubmit(e) {
        e.preventDefault();

        post( route('admin.staff.store'), {
            onError: (err) => {
                console.log(err);
            }
        });
    }

    return (
        <FormWrapper elevation={24}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} className="p-10">
                    <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>Add a new admin user</Typography>
                    <Divider />
                    <TextField
                        value={data.name}
                        onChange={({target}) => setData('name', target.value)}
                        required
                        label="Name"
                        variant="standard"
                        error={!!errors.name}
                        helperText={errors?.name}
                    />
                    <TextField
                        value={data.email}
                        onChange={({target}) => setData('email', target.value)}
                        label="Email"
                        variant="standard"
                        error={!!errors.email}
                        helperText={errors?.email}
                    />
                    <TextField
                        value={data.mobile_number}
                        onChange={({target}) => setData('mobile_number', target.value)}
                        label="Mobile Number"
                        variant="standard"
                        error={!!errors.mobile_number}
                        helperText={errors?.mobile_number}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+88</InputAdornment>
                        }}
                    />
                    <TextField
                        value={data.password}
                        onChange={({target}) => setData('password', target.value)}
                        required
                        type="password"
                        label="Password"
                        variant="standard"
                        error={!!errors.password}
                        helperText={errors?.password}
                    />
                    <TextField
                        value={data.password_confirmation}
                        onChange={({target}) => setData('password_confirmation', target.value)}
                        required
                        type="password"
                        label="Password Confirmation"
                        variant="standard"
                        error={!!errors.password_confirmation}
                        helperText={errors?.password_confirmation}
                    />
                    <Box>
                        <Button
                            disabled={processing}
                            type="submit"
                            className="mt-2 w-full"
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </form>
        </FormWrapper>
    );
}
