import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { cardWidth } from "@/constants/card";
import {Add, Remove, InsertPhoto} from '@mui/icons-material/';

export default function ProductCard ({product, cartItem, cbAdd, cbSubtract }) {

    const { locale } = usePage().props;

    const [imgUrl, setImgUrl] = useState('none');
    const [ imgUnavailable, setImgUnavailable ] = useState(false)
    useEffect(() => {
        const img = new Image();
        img.src = product.image;
        img.onload = () => {
            setImgUrl("url('" + img.src + "')")
        }
        img.onerror = () => {
            console.log('image loading errored');
            setImgUnavailable(true);
            setImgUrl("url('/image-unavailable.jpeg')");
        }
    }, []);

    function name() {
        switch(locale) {
            case 'en':
                return product.english_name;
            case 'bn':
                return product.bangla_name;
            default:
                return product.english_name;
        }
    }

    function uom() {
        switch(locale) {
            case 'en':
                return product.uom;
            case 'bn':
                return product.uomBangla;
            default:
                return product.uom;
        }
    }

    return  imgUrl === 'none'
        ? <ProductCardSkeleton />
        : (
        <Paper
            key={product.id}
            className="p-3 mt-2 mb-6 mx-1 flex flex-col border hover:bg-white hover:border-gray-300 hover:shadow-xl "
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
                    {name()}
                </Typography>
            </Box>
            <Typography className="my-2" variant="caption"  align="center">{ product.amount } { uom() }</Typography>
            <Typography className="font-bold" variant="body1"  align="center">৳ {product.current_selling_price}</Typography>
            {
                cartItem
                    ? (<ButtonGroup color="secondary" className="mt-2 font-bold" variant="contained">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cbSubtract();
                                }}
                                className="p-0"
                            >
                                <Remove fontSize="small" />
                            </Button>
                            <Button
                                className="lowercase font-bold flex-grow"
                                onClick={ (e) => {
                                    e.stopPropagation();
                                    cbAdd();
                                }}
                            >
                                { trans('labels.N in cart', { N: cartItem.qty }) }
                            </Button>
                            <Button
                                onClick={ (e) => {
                                    e.stopPropagation();
                                    cbAdd();
                                } }
                            >
                                <Add fontSize="small" />
                            </Button>
                        </ButtonGroup>)
                    : (<Button
                        onClick={ (e) => {
                            e.stopPropagation()
                            cbAdd();
                        }}
                        className="mt-2 font-bold border-gray-300 text-gray-400 hover:text-orange-500 hover:border-orange-500 hover:bg-white"
                        variant="outlined"
                    >
                        { trans('labels.Add to cart') }
                    </Button>)
            }


        </Paper>
        )
}
