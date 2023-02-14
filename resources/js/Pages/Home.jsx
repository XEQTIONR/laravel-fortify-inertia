import React, {useState, useEffect, useRef}  from 'react';
import Cookies from 'js-cookie'
import Nav from '@/Components/Nav';
import CategoryCard from '@/Components/CategoryCard';
import ProductCard from '@/Components/ProductCard';
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import { Box, CircularProgress } from "@mui/material";
import flatten from "@/functions/flatten";
import { cardWidth } from "@/constants/card";


import usePaginate from '@/hooks/usePaginate';

export default function Home ({ categories, products, shopping_cart, user }) {

    const [items, setItems] = useState(products.data ?? []);
    const [meta, setMeta] = useState(products.meta);
    const [selectedCategory, setSelectedCategory] = useState(products.meta.category);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchItems, setSearchItems] = useState([]);
    const [cart, setCart] = useState(shopping_cart);
    const container = useRef(null);

    const setRows = (rows) => {
        setItems([...items, ...rows]);
    }

    const paginate = usePaginate( route('api.home', { slug: selectedCategory ? selectedCategory.slug : null }),
        setIsLoading, setRows, setMeta );

    const addToCart = ( product_id, user_id ) => {
        axios.post( route('api.carts.store'), {
            'product_id': product_id,
            'user_id': user_id,
        }).then((res) => {
            console.log('api.carts.store', res)
            const found = cart.find(({ id }) => id === res.data.id);

            if ( found ) {
                setCart(cart.map((item) => (item.id === found.id) ? res.data : item ));
            } else {
                setCart([...cart, res.data]);
            }

           console.log('add to cart response', res);
        }).catch(err => {
            console.log('ERROR:', err);
        });

    }

    const scrollPercentage = () => {
        const h = document.documentElement,
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';

         return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }

    const displayNSkeletonsWhileLoading = () => {
        const perRow = Math.floor(container.current.offsetWidth/cardWidth);
        const numItems = items.length;
        const mod = numItems % perRow;

        return perRow - mod;
    }

    const onScroll = () => {
        if ( scrollPercentage() > 85 && isLoading === false ) {
            setIsLoading(true);
        }
    }

    useEffect( () => setCart(shopping_cart), [shopping_cart]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll );

        return () => { window.removeEventListener('scroll', onScroll ); }
    }, [])

    useEffect(() => {
        const cookie = Cookies.get('shopping-cart')
        if ( ! cookie ) {
            axios.get(route('cookie'));
        }
    }, [])

    // to account for preserveState in LinkTree
    useEffect(() => {
        setItems(products.data);
        setMeta(products.meta);
        setSelectedCategory(products.meta.category);
    }, [ products ]);

    useEffect(() => {
        if (isLoading) {
            if (meta.current_page < meta.last_page) {
                paginate(meta.current_page + 1);
            } else {
                setIsLoading(false);
            }

        }
    }, [ isLoading ]);

    return (
        <Nav navLinks={categories.data}
             user={user}
             selectedCategory={selectedCategory}
             setIsSearching={setIsSearching}
             setSearchItems={setSearchItems}
             shoppingCart={cart}
             setShoppingCart={setCart}
        >
            <Box ref={container} className="flex flex-wrap justify-start mt-16 pl-4">
                {
                    ( selectedCategory && searchItems.length === 0 && !isSearching )
                        ? flatten(categories.data)
                            .filter((children) => children.parent_id === selectedCategory.id)
                            .map(item => <CategoryCard key={item.id} category={item} />)
                        : null
                }
                {
                    isSearching ?
                        <CircularProgress sx={{ mt: '33vh' }} />
                        : ( searchItems.length > 0 )
                            ? searchItems.map((item) =>
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    cbAdd={() => {
                                        addToCart(item.id, user ? user.id : null)
                                    }}
                                />)
                            : items.map((item) =>
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    cbAdd={() => {
                                        addToCart(item.id, user ? user.id : null)
                                    }}
                                />)
                }
                {

                }
                {/*{*/}
                {/*    (isLoading && (meta.current_page < meta.last_page))*/}
                {/*        ? ([...Array(displayNSkeletonsWhileLoading())].map((e, i) =>*/}
                {/*            <ProductCardSkeleton key={'skeleton' + i} />))*/}
                {/*        : null*/}
                {/*}*/}
            </Box>
        </Nav>
    );
}
