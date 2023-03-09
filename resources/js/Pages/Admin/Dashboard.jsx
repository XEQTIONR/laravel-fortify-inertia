import React from "react";
import Nav from '@/Components/Admin/Nav';
import DashboardCard from '@/Components/Admin/DashboardCard';

import { Box, Stack, Typography } from "@mui/material";
import navItems from  '@/Components/data/AdminNavItems';
import {
    CalendarMonthTwoTone,
    LocalShippingTwoTone,
    PlaylistAddCheckOutlined,
    PlaylistAddOutlined,
    PlaylistPlayOutlined,
    ShoppingCartTwoTone,
    Visibility,
} from "@mui/icons-material";

export default function Dashboard({today, tomorrowString, past, future}) {
    return (
        <Nav navLinks={navItems}>
            <Stack spacing={3} className="w-full">
                <Typography className="w-full mb-2 font-bold">Highlights</Typography>
                <DashboardCard
                    button={

                        <CalendarMonthTwoTone color="primary" className="mt-2 mr-3" fontSize="large"/>

                    }
                    footer={today.month + ' ' + today.year}
                    content={today.day}
                    header={today.dayOfWeek}
                />
                {
                    Object.entries(future).map(([key, value]) => (
                        <Box key={key} className="flex flex-row flex-wrap items-start">
                            <Typography className="w-full mb-2 font-bold">
                                {
                                    key === today.date
                                        ? 'Today'
                                        : key === tomorrowString
                                            ? 'Tomorrow'
                                            : key
                                }
                            </Typography>
                            <DashboardCard
                                button={<ShoppingCartTwoTone color="primary" className="mt-2 mr-3" fontSize="large"/>}
                                menuItems={[
                                    { icon: <Visibility fontSize="small" />, label: 'View orders', onClick: () => window.open( route('admin.orders.index', { filters: { delivery_date: key } }), '_blank' ) },
                                   { icon: <PlaylistAddCheckOutlined />, label: 'Generate shopping list', onClick: () => window.open( route('admin.shopping-list', { date: key }), '_blank') },
                                   { icon: <PlaylistAddOutlined />, label: 'Generate supplier list', onClick: () => window.open( route('admin.supplier-list', { date: key }), '_blank') }
                                ]}
                                header="Not started"
                                content={value.filter(val => val.status === 'created').length}
                                footer="Process and deliver."
                            />
                            <DashboardCard
                                button={<LocalShippingTwoTone color="primary" className="mt-2 mr-3" fontSize="large"/>}
                                menuItems={[
                                    { icon: <Visibility fontSize="small" />, label: 'View outstanding deliveries', onClick: () => console.log('view orders') },
                                    { icon: <PlaylistPlayOutlined />, label: 'Generate delivery list', onClick: () => window.open( route('admin.delivery-list', { date: key }), '_blank') }
                                ]}
                                header="Outstanding deliveries"
                                content={value.filter(val => val.status === 'prepared').length}
                                footer="Ready to be delivered"
                            />
                        </Box>
                    ))
                }
            </Stack>
        </Nav>
    );
}
