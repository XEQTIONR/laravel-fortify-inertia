import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { cardWidth } from "@/constants/card";
import { Add, Remove, InsertPhoto } from '@mui/icons-material/';
import  { styled } from "@mui/material/styles";

const StyledPaper = styled((props) => (
    <Paper {...props} />
))(({ theme}) =>({
    backgroundColor: theme.palette.grey[100],
    borderWidth: '1px',
    borderColor: theme.palette.grey[300],
    [`&:hover`]: {
        borderWidth: '1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: '#fff'
    },
}));

const StyledButton = styled( (props) => (
    <Button {...props} />
))(({ theme}) =>({
    color: theme.palette.grey[500],
    borderColor: theme.palette.grey[500]
}));

const TakaSymbol = styled( (props) => (
    <Typography {...props} />
))(({ theme}) =>({
    color: theme.palette.success.main,
    //borderColor: theme.palette.grey[500]
}));

const TakaAmount = styled( (props) => (
    <Typography {...props} />
))(({ theme}) =>({
    color: theme.palette.gray.main,
    //borderColor: theme.palette.grey[500]
}));

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
        <StyledPaper
            elevation={0}
            key={product.id}
            className="p-3 mt-2 mb-6 mx-1 flex flex-col hover:shadow-2xl "
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
            <Box className="flex justify-center">
                <TakaSymbol  className="font-bold mr-1 text-lg" variant="body1"  align="center">৳</TakaSymbol>
                <TakaAmount className="font-bold text-lg" variant="body1"  align="center">{product.current_selling_price}</TakaAmount>
            </Box>
            {
                cartItem
                    ? (<ButtonGroup color="primary" className="mt-2 font-bold" variant="contained">
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
                    : (<StyledButton
                        onClick={ (e) => {
                            e.stopPropagation()
                            cbAdd();
                        }}
                        className="buy-button mt-2 font-bold hover:border-orange-400 hover:text-orange-400 hover:bg-orange-50"
                        variant="outlined"
                    >
                        { trans('labels.Add to cart') }
                    </StyledButton>)
            }


        </StyledPaper>
        )
}
