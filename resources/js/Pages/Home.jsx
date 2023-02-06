import React, {useState, useEffect, useRef}  from 'react';
import Nav from '@/Components/Nav';
import ProductCard from '@/Components/ProductCard';
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import { Box } from "@mui/material";

import usePaginate from '@/hooks/usePaginate';

export default function Home ({ categories, products }) {

    const [items, setItems] = useState(products.data);
    const [meta, setMeta] = useState(products.meta);
    const [selectedCategory, setSelectedCategory] = useState(products.meta.category);
    const [isLoading, setIsLoading] = useState(false);
    const container = useRef(null);

    const setR = (rows) => {
        setItems([...items, ...rows]);
    }

    const paginate = usePaginate( route('api.home', { slug: selectedCategory.slug }), setIsLoading, setR, setMeta );

    const scrollPercentage = () => {
        const h = document.documentElement,
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';

         return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }

    const displayNSkeletonsWhileLoading = () => {
        const perRow = Math.floor(container.current.offsetWidth/250);
        const numItems = items.length;
        const mod = numItems % perRow;
        const fill = perRow - mod;

        return fill === 0 ? perRow : fill
    }

    window.addEventListener('scroll', function() {

       if ( scrollPercentage() > 99 && isLoading === false ) {
           setIsLoading(true);
       }
    });

    // to account for preserveState in LinkTree
    useEffect(() => {
        setItems(products.data);
        setMeta(products.meta);
        setSelectedCategory(products.meta.category);
    }, [ products ]);

    useEffect(() => {
        if (isLoading) {
            if (meta.current_page < meta.last_page) {
                displayNSkeletonsWhileLoading();
                paginate(meta.current_page + 1);
            } else {
                setIsLoading(false);
            }

        }
    }, [ isLoading ]);

    return (
        <Nav navLinks={categories.data} selectedCategory={selectedCategory} loading>
            <Box ref={container} className="flex flex-wrap justify-start mt-16 pl-4">
                {
                    items.map((item) => <ProductCard key={item.id} product={item} />)
                }
                {
                    isLoading
                        ? ([...Array(displayNSkeletonsWhileLoading())].map((e, i) =>
                            <ProductCardSkeleton key={'skeleton' + i} />))
                        : null
                }
            </Box>
        </Nav>
    );
}
