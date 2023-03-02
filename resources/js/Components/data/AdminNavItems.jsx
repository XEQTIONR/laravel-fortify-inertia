
import {
    AccountTree,
    AccountTreeOutlined,
    Dashboard,
    DashboardOutlined,
    FoodBank,
    FoodBankOutlined,
    Kitchen,
    KitchenOutlined,
    Restaurant,
    Store,
    StoreOutlined,
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
        icon: <KitchenOutlined />,
        iconActive: <Kitchen color="primary" />,
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
        icon: <FoodBankOutlined />,
        iconActive: <FoodBank color="primary" />,
        route: 'admin.customers.index'
    },
    {
        label: 'Suppliers',
        icon: <StoreOutlined />,
        iconActive: <Store color="primary" />,
        route: 'admin.suppliers.index'
    },
]
