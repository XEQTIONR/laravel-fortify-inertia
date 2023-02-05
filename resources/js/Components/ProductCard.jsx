import React from 'react';
import { Box, Button, Typography } from "@mui/material";


export default function ProductCard ({product}) {
    return (
        <Box
            key={product.id}
            className="p-3 mt-2 mb-6 flex flex-col hover:border   hover:shadow-xl "
            sx={{ width: "250px" }}
        >
            <Box
                sx={{
                    width: '100%',
                    paddingTop: '100%',
                    backgroundImage: `url(' https://via.placeholder.com/500x500.png/009911?text=Eggplant+totam')`,
                    backgroundSize: 'cover'
                }}
            />
            <Box className="w-full mt-1"
                 sx={{ height: '50px', overflowY: 'hidden' }}
            >
                <Typography
                    variant="body1"
                    align="center"
                >
                    {product.english_name}
                </Typography>
            </Box>
            <Typography className="my-2" variant="caption"  align="center">{product.uom}</Typography>
            <Typography className="font-bold" variant="body1"  align="center">৳ {product.current_selling_price}</Typography>

                <Button
                    className="mt-2 border-gray-300 text-gray-400 hover:text-orange-500 hover:border-orange-500 hover:bg-white"
                    variant="outlined"
                >
                    Add to cart
                </Button>
        </Box>
    )
}
