import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Collapse,
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
    Toolbar
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';

import LinkTree from '@/Components/LinkTree'

const drawerWidth = 240;

const theme = createTheme({
    transitions: {
        easing: {
            // The sharp curve is used by objects that may return to the screen at any time.
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
        duration: {
            // recommended when something is leaving screen
            leavingScreen: 195,
        },
    },
});

export default function Nav({ children, navLinks, selectedCategory }) {

    const [ show, setShow ] = useState(window.outerWidth <= 800
        ? false
        : (JSON.parse(window.localStorage.getItem('showSidebar')) ?? false)
    );
    const [ mainWidth, setMainWidth ] = useState(window.outerWidth);
    const [ menuType, setMenuType ] = useState((window.outerWidth > 800) ? 'persistent' : 'temporary');
    useEffect(() => {
        function handleResize() {
            setMainWidth(window.outerWidth);
            if (window.outerWidth <= 800 && menuType === 'persistent' ) {
                setShow(false)
                setMenuType('temporary');
            } else if (window.outerWidth > 800 && menuType === 'temporary' ) {
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
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
                    <Typography variant="h6" noWrap component="div">
                        Clipped drawer
                    </Typography>
                </Toolbar>
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
                    <List>
                        <LinkTree links={navLinks} selectedCategory={selectedCategory ? selectedCategory.data : null} />
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box
                sx={{ flexGrow: 1}}
                className="flex justify-center px-0"
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
                    pt: 8,
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
