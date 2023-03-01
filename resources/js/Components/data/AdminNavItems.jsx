
import {
    Dashboard,
    List,
    LocalOffer,
    Restaurant,
    ShoppingBag,
    SupervisedUserCircle,

} from '@mui/icons-material';

export default [
    {
        label: 'Dashboard',
        icon: <Dashboard />,
        iconActive: <Dashboard color="primary" />,
        route: 'admin.dashboard'
    },
    {
        label: 'Products',
        icon: <ShoppingBag />,
        iconActive: <ShoppingBag color="primary" />,
        route: 'admin.products.index'
    },
    {
        label: 'Categories',
        icon: <LocalOffer />,
        iconActive: <LocalOffer color="primary" />,
        route: 'admin.categories.index'
    },
    {
        label: 'Orders',
        icon: <List />,
        iconActive: <List color="primary" />,
        route: 'admin.orders.index'
    },
    {
        label: 'Customers',
        icon: <Restaurant />,
        iconActive: <Restaurant color="primary" />,
        route: 'admin.customers.index'
    },
    {
        label: 'Suppliers',
        icon: <SupervisedUserCircle />,
        iconActive: <SupervisedUserCircle color="primary" />,
        route: 'admin.suppliers.index'
    },
]
