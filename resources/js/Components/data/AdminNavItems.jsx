
import {
    ShoppingBag,
    List,
    Restaurant,
    SupervisedUserCircle,
    LocalOffer,

} from '@mui/icons-material';

export default [
    {
        label: 'Products',
        icon: <ShoppingBag />,
        link: route('admin.products.index')
    },
    {
        label: 'Categories',
        icon: <LocalOffer />,
        link: route('admin.products.index')
    },
    {
        label: 'Orders',
        icon: <List />,
        link: '/admin/second'
    },
    {
        label: 'Customers',
        icon: <Restaurant />,
        link: '#'
    },
    {
        label: 'Suppliers',
        icon: <SupervisedUserCircle />,
        link: route('admin.suppliers.index')
    },
]
