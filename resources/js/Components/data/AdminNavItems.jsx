
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
        link: route('admin.dashboard')
    },
    {
        label: 'Products',
        icon: <ShoppingBag />,
        iconActive: <ShoppingBag color="primary" />,
        link: route('admin.products.index')
    },
    {
        label: 'Categories',
        icon: <LocalOffer />,
        iconActive: <LocalOffer color="primary" />,
        link: route('admin.categories.index')
    },
    {
        label: 'Orders',
        icon: <List />,
        iconActive: <List color="primary" />,
        link: route('admin.orders.index')
    },
    {
        label: 'Customers',
        icon: <Restaurant />,
        iconActive: <Restaurant color="primary" />,
        link: '#'
    },
    {
        label: 'Suppliers',
        icon: <SupervisedUserCircle />,
        iconActive: <SupervisedUserCircle color="primary" />,
        link: route('admin.suppliers.index')
    },
]
