import React, {useState, useEffect, useRef}  from 'react';
import Nav from '@/Components/Nav';
import ProductCard from '@/Components/ProductCard';
import { Box } from "@mui/material";

import usePaginate from '@/hooks/usePaginate';

export default function Home ({ categories, products }) {

    const [items, setItems] = useState(products.data);
    const [meta, setMeta] = useState(products.meta);
    const [selectedCategory, setSelectedCategory] = useState(products.meta.category);
    const [isLoading, setIsLoading] = useState(false);
    const container = useRef(null);

    // to account for preserveState in LinkTree
    useEffect(() => {
        setItems(products.data);
        setSelectedCategory(products.meta.category);
    }, [ products ]);

    const scrollPercentage = () => {
        const h = document.documentElement,
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';

         return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }

    const setR = (rows) => {
            setItems([...items, ...rows]);
    }

    window.addEventListener('scroll', function() {

       if ( scrollPercentage() > 99 && isLoading === false ) {
           setIsLoading(true);
       }
    });


    const paginate = usePaginate( route('api.home', { slug: selectedCategory.slug }), setIsLoading, setR, setMeta );

    useEffect(() => {
        if (isLoading) {
            paginate(meta.current_page + 1);
        }
    }, [isLoading]);

    return (
        <Nav navLinks={categories.data} selectedCategory={selectedCategory} loading>
            <Box ref={container} className="flex flex-wrap justify-start mt-16 pl-4"
            >
                {
                    items.map((item) => <ProductCard key={item.id} product={item} />)
                }
            </Box>
        </Nav>
    );
}
