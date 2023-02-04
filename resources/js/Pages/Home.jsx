import React, {useState}  from 'react';
import Nav from '@/Components/Nav';
import {Box, Button, Typography} from "@mui/material";

export default function Home ({ categories, category, products }) {

    const [items, setItems] = useState(products.data);

    return (
        <Nav navLinks={categories.data} selectedCategory={category}>
            <Box
                className="flex flex-wrap justify-start"
            >
                {
                    items.map(({id, current_selling_price, english_name, uom}) => (
                        <Box
                            key={id}
                            className="p-2 flex flex-col"
                            sx={{
                                width: "200px",
                            }}
                        >
                            <Box
                                className="bg-red-300"

                                sx={{
                                    width: '100%',
                                    paddingTop: '100%',
                                    backgroundImage: `url(' https://via.placeholder.com/500x500.png/009911?text=Eggplant+totam')`,
                                    backgroundSize: 'cover'
                                }}
                            />
                            <Box className="w-full"
                                sx={{ height: '50px', overflowY: 'hidden' }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                >
                                    {english_name}
                                </Typography>
                            </Box>
                            <Typography className="my-2" variant="caption"  align="center">{uom}</Typography>
                            <Typography className="font-bold" variant="body1"  align="center">৳ {current_selling_price}</Typography>
                            <Button className="mt-2" variant="outlined">Add to cart</Button>
                        </Box>
                    ))
                }
            </Box>
        </Nav>
    );
}
