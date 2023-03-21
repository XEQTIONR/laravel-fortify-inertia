import React, { useEffect, useState }  from 'react';
import { Link } from '@inertiajs/inertia-react'
import Cookies from 'js-cookie'
import Nav from '@/Components/Nav';
import AccountCard from '@/Components/AccountCard';
import {
    Box,
    Typography,
} from '@mui/material';

import {
    HeadsetMicTwoTone,
    HomeTwoTone,
    PaymentsTwoTone,
    AdminPanelSettingsTwoTone,
    ViewListTwoTone,
} from '@mui/icons-material';

export default function MyAccount ({ shopping_cart, categories }) {

    const [cart, setCart] = useState(shopping_cart.data);

    useEffect(() => {
        const cookie = Cookies.get('shopping-cart')
        if ( ! cookie ) {
            axios.get(route('cookie'));
        }
    }, [])

    return (
        <Nav navLinks={categories.data}
             selectedCategory={null}
             showUserMenu={true}
             shoppingCart={cart}
             setShoppingCart={setCart}
             user
        >

            <Box className="w-full flex flex-wrap pt-3 pl-3">
                <Box className="w-full mb-3">
                    <Typography variant="h6">{ trans('labels.My account')}</Typography>
                </Box>
                <AccountCard
                    link={route('addresses.index')}
                    icon={<HomeTwoTone className="mr-3" color="secondary" sx={{ fontSize: 50 }} />}
                    title={trans('labels.My addresses')}
                    subtitle={trans('labels.View or add your delivery addresses')}
                />
                <AccountCard
                    link={route('orders.index')}
                    icon={<ViewListTwoTone className="mr-3" color="secondary" sx={{ fontSize: 50 }} />}
                    title={trans('labels.My orders')}
                    subtitle={trans('labels.View your past orders')}
                />
                <AccountCard
                    link={route('security.index')}
                    icon={<AdminPanelSettingsTwoTone className="mr-3" color="secondary" sx={{ fontSize: 50 }} />}
                    title={trans('labels.Log in and security')}
                    subtitle={trans('labels.Manage your login information and password')}
                />
                <AccountCard
                    link={route('orders.index')}
                    icon={<PaymentsTwoTone className="mr-3" color="secondary" sx={{ fontSize: 50 }} />}
                    title={trans('labels.My payments')}
                    subtitle={trans('labels.View your payments')}
                />
                <AccountCard
                    link={route('orders.index')}
                    icon={<HeadsetMicTwoTone className="mr-3" color="secondary" sx={{ fontSize: 50 }} />}
                    title={trans('labels.Customer service')}
                    subtitle={trans('labels.Contact us')}
                />
            </Box>
        </Nav>
    )

}
