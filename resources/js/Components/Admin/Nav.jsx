import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react';
import { blue, purple, indigo, grey } from '@mui/material/colors';
import {
    AppBar,
    Avatar,
    Box,
    createTheme,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar
} from '@mui/material';
import AppLogo from '@/Components/AppLogo';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import {Logout, Face} from '@mui/icons-material';




const drawerWidth = 240;

export default function Nav({ children, navLinks }) {

    const { user } = usePage().props;

    const [ show, setShow ] = useState(window.innerWidth <= 800
        ? false
        : (JSON.parse(window.localStorage.getItem('showSidebar')) ?? false)
    );
    const [ mainWidth, setMainWidth ] = useState(window.innerWidth);
    const [ menuType, setMenuType ] = useState((window.innerWidth > 800) ? 'persistent' : 'temporary');
    useEffect(() => {
        function handleResize() {
            setMainWidth(window.innerWidth);
            if (window.innerWidth <= 800 && menuType === 'persistent' ) {
                setShow(false)
                setMenuType('temporary');
            } else if (window.innerWidth > 800 && menuType === 'temporary' ) {
                setShow(true)
                setMenuType('persistent');
            }
        }
        window.addEventListener('resize', handleResize)
    });

    useEffect( () => {
        window.localStorage.setItem('showSidebar', show);
    }, [show]);

    return (
        <>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
            <AppBar color="disabled" position="fixed" sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Toolbar className="px-1">
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() => { setShow( !show )}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <AppLogo show={true} />
                    <Typography> Admin </Typography>
                </Toolbar>
                <Toolbar>
                    <Avatar
                        className="cursor-pointer text-sm font-bold"
                        onClick={() => Inertia.post( route('logout') )}
                        sx={{ width: 30, height: 30, bgcolor: blue[300] }}>
                        { user.name.charAt(0) }
                    </Avatar>
                </Toolbar>
                </Stack>
            </AppBar>

            <Drawer
                open={show}
                variant={menuType}
                onClose={() => (mainWidth < 800) && setShow(false)}
                sx={{
                    width: show ? drawerWidth : 0,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List style={{ bgcolor: 'background.paper'}}>
                        {navLinks.map((item, index) => (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton
                                    selected={
                                        route().current(item.route.split('.', 2).join('.') +'.*')
                                        || route().current(item.route) // for admin.dashboard
                                    }
                                    onClick={ () => setTimeout( () => Inertia.get(route(item.route)), 300) }
                                >

                                        <ListItemIcon>
                                            {
                                                ( route().current(item.route.split('.', 2).join('.') +'.*')
                                                || route().current(item.route) )
                                                ?item.iconActive
                                                :item.icon
                                            }
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={
                                                ( route().current(item.route.split('.', 2).join('.') +'.*')
                                                || route().current(item.route) )
                                                    ? {
                                                className: 'font-bold',
                                                color: 'primary'
                                            } : {}}
                                        />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box
                style={{
                    // may choose to remove this transition.
                    // transition: theme.transitions.create("all", {
                    //     easing: theme.transitions.easing.sharp,
                    //     duration: theme.transitions.duration.leavingScreen }),
                    width: (show && menuType === 'persistent') ? mainWidth - drawerWidth : mainWidth,
                }}
                component="main"
                sx={{
                     //flexShrink: 0, if using transition
                    height: '100vh',
                    pt: 10,
                    px: 2,
                    pb: 2,
                }}
            >
                { children }
            </Box>
        </Box>
        </>
    );
}
