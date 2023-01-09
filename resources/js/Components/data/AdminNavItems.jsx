import FastfoodIcon from "@mui/icons-material/Fastfood";
import ListIcon from "@mui/icons-material/List";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

export default [
    {
        label: 'Products',
        icon: <FastfoodIcon />,
        link: '/admin/dashboard'
    },
    {
        label: 'Orders',
        icon: <ListIcon />,
        link: '/admin/second'
    },
    {
        label: 'Customers',
        icon: <RestaurantIcon />,
        link: '#'
    },
    {
        label: 'Suppliers',
        icon: <SupervisedUserCircleIcon />,
        link: '#'
    },
]
