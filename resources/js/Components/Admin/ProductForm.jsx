import React, { useState } from 'react';
import { grey, red } from '@mui/material/colors';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
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

export default function ProductForm ({ action, productData, uom }) {

    const [ uploadedImageUrl, setUploadedImageUrl ] = useState( productData ? productData.image : null );

    const formData = {
        'english_name' : productData ? productData.english_name : '',
        'bangla_name' : productData ? productData.bangla_name : '',
        'uom' : productData ? productData.uom : '',
        'current_selling_price' : productData ? productData.current_selling_price.toFixed(2) : '',
        'image' : null,
        'status' : productData ? productData.status : 'inactive',
    };

    if ( action === 'edit') {
        formData._method = 'put'
    }

    const { data, setData, post, processing, progress, errors } = useForm(formData);

    function handleSubmit(e) {
        e.preventDefault();

        if ( action === 'add' ) {
            post(route('admin.products.store'), {
                onError: (err) => {
                    console.log(err);
                },
            });
        } else if ( action === 'edit') {
            // actually PUT request.
            post(route('admin.products.update', { product: productData.id }), {
                onError: (err) => {
                    console.log(err);
                },
            });
        }
    }

    return(
        <FormWrapper elevation={24}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={1} className="p-10">
                    <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>Add a new product</Typography>
                    <Divider />
                    <TextField
                        value={data.english_name}
                        onChange={({ target }) => setData('english_name', target.value)}
                        required
                        id="outlined-required"
                        label="Name"
                        variant="standard"
                    />
                    <TextField
                        value={data.bangla_name}
                        onChange={({target}) => setData('bangla_name', target.value)}
                        required
                        id="outlined-required"
                        label="Name (Bangla)"
                        variant="standard"
                    />
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: errors.current_selling_price ? 'center' : 'flex-end', width: "50%" }}>
                            <Typography className="mr-1">৳</Typography>
                            <TextField
                                value={data.current_selling_price}
                                error={!!errors.current_selling_price}
                                helperText={errors?.current_selling_price}
                                onChange={({target}) => setData('current_selling_price', target.value)}
                                required
                                id="outlined-required"
                                label="Current Selling Price"
                                variant="standard"
                            />
                        </Box>
                        <FormControl required variant="standard" className="w-1/2">
                            <InputLabel id="demo-simple-select-standard-label">Unit Of Measure</InputLabel>
                            <Select
                                onChange={ ({target}) => setData('uom', target.value) }
                                id="select-input-id"
                                value={data.uom}
                                label="Age"
                            >
                                <MenuItem value="" key={'None'}>
                                    <em>None</em>
                                </MenuItem>
                                { Object.keys(uom).map( (key) =>
                                    <MenuItem value={key} key={key}>
                                        {uom[key]}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <FormGroup className="justify-end">
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={data.status === 'active'}
                                        onChange={({target}) =>
                                            setData('status', target.checked ? 'active' : 'inactive')}
                                    />
                                }
                                label={ data.status.substring(0,1).toUpperCase() + data.status.substring(1) }
                            />
                        </FormGroup>
                    </Stack>
                    <Box  className="flex justify-between h-1/4">
                        <Stack spacing={2} className="w-1/2 h-1/2">
                            <Typography color={grey[700]}>Product Image</Typography>
                            <Box className="w-full">
                                {   uploadedImageUrl
                                    ? (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setUploadedImageUrl(null);
                                                setData('image', null);
                                            }}
                                        >
                                            Remove Image
                                        </Button>
                                    )
                                    : (
                                        <Button variant="outlined" component="label">
                                            Select Image
                                            <input hidden accept="image/*" type="file" onChange={(e) => {
                                                setData('image', e.target.files[0])
                                                setUploadedImageUrl(URL.createObjectURL(e.target.files[0]))
                                            }} />
                                        </Button>
                                    )
                                }
                            </Box>
                            {errors.image ? (<Typography color={red[500]}>{errors.image}</Typography>) : null }
                        </Stack>
                        <Box sx={{ width: 1/2 }}>
                            <Box
                                className="bg-center bg-cover w-full h-0 relative"
                                sx={{
                                backgroundColor: uploadedImageUrl ? "transparent" : grey[300],
                                paddingTop: "100%",
                                backgroundImage: uploadedImageUrl ? `url(${uploadedImageUrl})` : 'none',
                            }}>

                                { uploadedImageUrl
                                    ? null
                                    : (
                                        <Box
                                            sx={{transform: "translate(-50%, -50%)",}}
                                            className="absolute top-1/2 left-1/2 flex flex-col justify-center items-center"
                                        >
                                            <InsertPhotoIcon
                                                className="text-5xl"
                                                sx={{ color: grey[500] }}
                                            />
                                            <Typography color={grey[500]} align="center" variant="button">
                                                No Image Selected
                                            </Typography>
                                        </Box>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Stack className="pt-4">
                        { progress ? ( <LinearProgress variant="determinate" value={progress.percentage} /> ) : null }
                        <Button disabled={processing} type="submit" variant="contained">Submit</Button>
                    </Stack>
                </Stack>
            </form>
        </FormWrapper>
    );
}
