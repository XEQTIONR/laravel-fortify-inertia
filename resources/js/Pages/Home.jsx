import React, {useState}  from 'react';
import Nav from '@/Components/Nav';
import ProductCard from '@/Components/ProductCard';
import { Box } from "@mui/material";

export default function Home ({ categories, category, products }) {

    const [items, setItems] = useState(products.data);

    return (
        <Nav navLinks={categories.data} selectedCategory={category}>
            <Box className="flex flex-wrap justify-start mt-16 pl-4">
                {
                    items.map((item) => <ProductCard product={item} />)
                }
            </Box>
        </Nav>
    );
}
