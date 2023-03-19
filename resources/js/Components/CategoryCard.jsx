import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { Box, Typography } from "@mui/material";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { cardWidth } from "@/constants/card";

export default function CategoryCard ({category}) {

    const { locale } = usePage().props;

    const [imgUrl, setImgUrl] = useState('none');
    useEffect(() => {
        const img = new Image();
        img.src = category.image;
        img.onload = () => {
            setImgUrl("url('" + img.src + "')")
        }
    }, []);

    function name() {
        switch(locale) {
            case 'en':
                return category.english_name;
            case 'bn':
                return category.bangla_name;
            default:
                return category.english_name;
        }
    }

    return  imgUrl === 'none'
        ? <ProductCardSkeleton />
        : (
        <Box
            onClick={() => Inertia.visit(category.link, { preserveState: true })}
            key={'category' + category.id}
            className="cursor-pointer p-3 mt-2 mx-1 mb-6 flex flex-col hover:border hover:shadow-xl"
            sx={{ width: `${cardWidth}px`, alignSelf: "flex-start" }}
        >
            <Box
                sx={{
                    width: '100%',
                    paddingTop: '100%',
                    backgroundImage: imgUrl,
                    backgroundSize: 'cover'
                }}
            />
                <Typography className="mt-1" variant="body1" align="center">
                    { name() }
                </Typography>
        </Box>
        )
}
