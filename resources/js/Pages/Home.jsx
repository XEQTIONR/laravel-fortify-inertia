import React, {useState, useEffect, useRef}  from 'react';
import Nav from '@/Components/Nav';
import ProductCard from '@/Components/ProductCard';
import { Box } from "@mui/material";

export default function Home ({ categories, category, products }) {

    const [items, setItems] = useState(products.data);
    useEffect(() => {
        setItems(products.data)
    },[products])

    return (
        <Nav navLinks={categories.data} selectedCategory={category ? category.data : null} loading>
            <Box className="flex flex-wrap justify-start mt-16 pl-4">
                {
                    items.map((item) => <ProductCard key={item.id} product={item} />)
                }
            </Box>
        </Nav>
    );
}
