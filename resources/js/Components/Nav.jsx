import React, { useState, useEffect, useCallback } from 'react';
import {
    AppBar,
    Box,
    createTheme,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    Typography,
    Toolbar
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import LinkTree from '@/Components/LinkTree'
import NavSearchBar from '@/Components/NavSearchBar'

import useSearch from '@/hooks/useSearch';



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

function debounce( fn, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn(...args); }, timeout);
    };
}


export default function Nav({ children, navLinks, selectedCategory, setIsSearching, setSearchItems }) {

    const [ show, setShow ] = useState(window.outerWidth <= 767
        ? false
        : (JSON.parse(window.localStorage.getItem('showSidebar')) ?? false)
    );
    const [ mainWidth, setMainWidth ] = useState(window.outerWidth);
    const [ menuType, setMenuType ] = useState((window.outerWidth > 767) ? 'persistent' : 'temporary');
    //const [ isSearching, setIsSearching ] = useState(false);

    const searchFunc = useSearch();
    const search = useCallback( debounce((q) => {
        searchFunc(q, setIsSearching, setSearchItems)
    }), [] );

    useEffect(() => {
        function handleResize() {
            setMainWidth(window.outerWidth);
            if (window.outerWidth <= 767 && menuType === 'persistent' ) {
                setShow(false)
                setMenuType('temporary');
            } else if (window.outerWidth > 767 && menuType === 'temporary' ) {
                setShow(true)
                setMenuType('persistent');
            }
        }
        window.addEventListener('resize', handleResize)
    }, [window.outerWidth]);

    useEffect( () => {
        window.localStorage.setItem('showSidebar', show);
    }, [show]);

    return (
        <>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar className="px-1">
                    <Box className="flex items-center flex-shrink-0"
                        sx={{ width: show ? drawerWidth : '50px' }}
                    >
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
                        <Typography
                            className={'flex-shrink-0 ' + (show ? '' : 'hidden') }
                            variant="h6"
                            noWrap component="div"
                        >
                            Clipped drawer
                        </Typography>
                    </Box>
                    <NavSearchBar
                        onChange={({target}) => {
                            setIsSearching(true);
                            if (target.value.length > 0) {
                                search(target.value);
                            } else {
                                setIsSearching(false);
                                setSearchItems([]);
                            }
                        }}
                    />

                </Toolbar>
            </AppBar>

            <Drawer
                open={show}
                variant={menuType}
                onClose={() => (mainWidth < 767) && setShow(false)}
                sx={{
                    width: show ? drawerWidth : 0,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <LinkTree links={navLinks} selectedCategory={selectedCategory} />
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box
                sx={{ flexGrow: 1}}
                className="flex justify-center px-0"
                style={{
                    pt: 8,
                    px: 2,
                    pb: 2,
                    // may choose to remove this transition.
                    // transition: theme.transitions.create("all", {
                    //     easing: theme.transitions.easing.sharp,
                    //     duration: theme.transitions.duration.leavingScreen }),
                    width: (show && menuType === 'persistent') ? mainWidth - drawerWidth : mainWidth,
                }}
                component="main"
            >
                { children }
            </Box>
        </Box>
        </>
    );
}
