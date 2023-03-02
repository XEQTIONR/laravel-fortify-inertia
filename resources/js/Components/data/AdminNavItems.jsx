
import {
    AccountTree,
    AccountTreeOutlined,
    Ballot,
    BallotOutlined,
    Dashboard,
    DashboardOutlined,
    Restaurant,
    ShoppingBag,
    ShoppingBagOutlined,
    SupervisedUserCircle,
    ViewList,
    ViewListOutlined,

} from '@mui/icons-material';

export default [
    {
        label: 'Dashboard',
        icon: <DashboardOutlined />,
        iconActive: <Dashboard color="primary" />,
        route: 'admin.dashboard'
    },
    {
        label: 'Products',
        icon: <ShoppingBagOutlined />,
        iconActive: <ShoppingBag color="primary" />,
        route: 'admin.products.index'
    },
    {
        label: 'Categories',
        icon: <AccountTreeOutlined />,
        iconActive: <AccountTree color="primary" />,
        route: 'admin.categories.index'
    },
    {
        label: 'Orders',
        icon: <ViewListOutlined />,
        iconActive: <ViewList color="primary" />,
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
