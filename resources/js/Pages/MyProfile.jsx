import React, { useEffect, useState }  from 'react';
import { Inertia } from '@inertiajs/inertia';
import Cookies from 'js-cookie'
import Nav from '@/Components/Nav';
import {
    Box,
    Button,
    Card,
    Stack,
    Typography,
} from '@mui/material';

import { Add } from "@mui/icons-material";
import { red } from '@mui/material/colors';

export default function MyProfile ({ shopping_cart, categories, user, addresses }) {

    const [cart, setCart] = useState(shopping_cart);

    useEffect(() => {
        const cookie = Cookies.get('shopping-cart')
        if ( ! cookie ) {
            axios.get(route('cookie'));
        }
    }, [])

    return (
        <Nav navLinks={categories.data}
             selectedCategory={null}
             showUserMenu={true}
             shoppingCart={cart}
             setShoppingCart={setCart}
             user
        >
            <Stack className="w-full">
                <Typography variant="h6" className="ml-3 my-3">My addresses</Typography>
                <Box className="w-full flex flex-wrap pl-3">
                    <Box className="w-full pr-3 pb-3 md:w-1/3">
                        <Card
                            sx={{ minHeight: '250px'}}
                            onClick={() => Inertia.visit(route('addresses.create'))}
                            className="w-full p-2 flex flex-col justify-center items-center border-dashed border-4 hover:cursor-pointer"
                            variant="outlined"
                        >
                            <Add fontSize="large" />
                            <Typography>Add new address</Typography>
                        </Card>
                    </Box>
                {
                    addresses.data.map(({full_name, business_name, address, phone_number})  => (
                        <Box className="w-full pr-3 pb-3 md:w-1/3">
                            <Card
                                sx={{ minHeight: '250px'}}
                                className="w-full flex flex-wrap p-2 "
                                variant="outlined"
                            >
                                <Box className="w-full">
                                <Typography className="font-bold ml-2" gutterBottom={true}>{full_name}</Typography>
                                <Typography className="font-bold ml-2" gutterBottom={true}>{business_name}</Typography>
                                {
                                    address.split('\n')
                                        .filter((element, index, array) => index !== array.length - 1)
                                        .map((line, index) => <Typography className="ml-2" key={'address-line-' + index} variant="body1">{line}</Typography>)
                                }
                                {
                                    address.split('\n')
                                        .filter((element, index, array) => index === array.length - 1)
                                        .map((line) => <Typography className="ml-2" key={'address-last-line'} variant="body1" gutterBottom={true}>{line}</Typography>)
                                }
                                <Typography className="ml-2" gutterBottom={true}>{phone_number}</Typography>
                                </Box>
                                <Button className="self-end" color="error">Remove</Button>
                            </Card>
                        </Box>
                    ))
                }

                </Box>
            </Stack>
        </Nav>
    )

}
