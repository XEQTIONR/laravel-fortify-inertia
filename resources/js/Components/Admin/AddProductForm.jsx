import React, { useState } from 'react';
import { grey, red } from '@mui/material/colors';
import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
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

export default function AddProductForm ({ uom }) {

    const [ uploadedImageUrl, setUploadedImageUrl ] = useState(null);

    const { data, setData, post, processing, progress, errors } = useForm({
        'english_name' : '',
        'bangla_name' : '',
        'uom' : '',
        'current_selling_price' : '',
        'image' : null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post( route('admin.products.store'), {
            onError: (err) => {
                console.log(err);
            },
        })
    }

    return(
        <FormWrapper elevation={24}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={1} className="p-10">
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
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: errors.current_selling_price ? 'center' : 'flex-end', width: "50%" }}>
                            <Typography className="mr-1">৳</Typography>
                            <TextField
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
