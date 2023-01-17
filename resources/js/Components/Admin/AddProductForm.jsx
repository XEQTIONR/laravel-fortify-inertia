import React, { useState } from 'react';
import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
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

    const { data, setData, post, processing, errors } = useForm({
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
                console.log('submit error');
                console.log(err);
            }
        })
    }

    return(
        <FormWrapper elevation={24}>
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
                        <Typography sx={{ mr: 1 }}>৳</Typography>
                        <TextField
                            onChange={({target}) => setData('current_selling_price', target.value)}
                            required
                            id="outlined-required"
                            label="Current Selling Price"
                            variant="standard"
                        />
                    </Box>
                    <FormControl variant="standard" sx={{ m: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Unit Of Measure</InputLabel>
                        <Select
                            onChange={ ({target}) => setData('uom', target.value) }
                            id="select-input-id"
                            value={data.uom}
                            label="Age"
                        >
                            <MenuItem value="" key={'None'}>None</MenuItem>
                            { Object.keys(uom).map( (key) => {
                                return <MenuItem value={key} key={key}>{uom[key]}</MenuItem>
                            } ) }
                        </Select>
                    </FormControl>

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
                        <Button type="submit" variant="contained">Submit</Button>
                    </Stack>
                </Stack>
            </form>
        </FormWrapper>
    );
}
