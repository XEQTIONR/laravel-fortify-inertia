import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { cardWidth } from "@/constants/card";

export default function ProductCard ({product}) {

    const [imgUrl, setImgUrl] = useState('none');
    useEffect(() => {
        const img = new Image();
        img.src = product.image;
        img.onload = () => {
            setImgUrl("url('" + img.src + "')")
        }
    }, []);

    return  imgUrl === 'none'
        ? <ProductCardSkeleton />
        : (
        <Box
            onClick={() => console.log('click')}
            key={product.id}
            className="p-3 mt-2 mb-6 mx-1 flex flex-col border cursor-pointer hover:border-gray-300 hover:shadow-xl "
            sx={{ width: `${cardWidth}px` }}
        >
            <Box
                sx={{
                    width: '100%',
                    paddingTop: '100%',
                    backgroundImage: imgUrl,
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
            <Typography className="my-2" variant="caption"  align="center">{ product.amount } {product.uom}</Typography>
            <Typography className="font-bold" variant="body1"  align="center">৳ {product.current_selling_price}</Typography>

                <Button
                    onClick={ (e) => e.stopPropagation() }
                    className="mt-2 border-gray-300 text-gray-400 hover:text-orange-500 hover:border-orange-500 hover:bg-white"
                    variant="outlined"
                >
                    Add to cart
                </Button>
        </Box>
        )
}
