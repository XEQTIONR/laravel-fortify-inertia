
import {
    AccountTree,
    AccountTreeOutlined,
    Badge,
    BadgeOutlined,
    Dashboard,
    DashboardOutlined,
    FoodBank,
    FoodBankOutlined,
    Kitchen,
    KitchenOutlined,
    Payments,
    PaymentsOutlined,
    Store,
    StoreOutlined,
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
        label: 'Payments',
        icon: <PaymentsOutlined />,
        iconActive: <Payments color="primary" />,
        route: 'admin.payments.index'
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
    {
        label: 'Staff',
        icon: <BadgeOutlined />,
        iconActive: <Badge color="primary" />,
        route: 'admin.staff.index'
    },
]
