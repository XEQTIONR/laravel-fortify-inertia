import React, { useState, useEffect, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia'
import {
    AppBar,
    Badge,
    Box,
    createTheme,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography,
    Toolbar, MenuList, ListItemText, Popover
} from '@mui/material';

import {
    AccountBox,
    Close,
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Login,
    ShoppingCart,
} from '@mui/icons-material';
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


export default function Nav({ children, navLinks, selectedCategory, setIsSearching, setSearchItems, user, shoppingCart }) {

    const [ show, setShow ] = useState(window.outerWidth <= 767
        ? false
        : (JSON.parse(window.localStorage.getItem('showSidebar')) ?? false)
    );
    const [ mainWidth, setMainWidth ] = useState(window.outerWidth);
    const [ menuType, setMenuType ] = useState((window.outerWidth > 767) ? 'persistent' : 'temporary');
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ userMenuOpen, setUserMenuOpen ] = useState(false);
    const [ cartMenuOpen, setCartMenuOpen ] = useState(false);
    const [ menuAnchor, setMenuAnchor ] = useState(null);
    const [ cartAnchor, setCartAnchor ] = useState(null);

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
                <Stack spacing={1} direction="row" justifyContent="flex-start">
                <Toolbar className="pl-1 pr-0">
                    <Box className="flex items-center"
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
                </Toolbar>
                <Toolbar className="w-full px-0">
                    <NavSearchBar
                        value={searchQuery}
                        onChange={({target}) => {
                            setSearchQuery(target.value);
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
                <Toolbar className="pl-0 pr-4">

                    <IconButton
                        className="mr-2"
                        color="inherit"
                                onMouseEnter={(e) => {
                                    setMenuAnchor(e.currentTarget);
                                }}
                                onClick={(e) => {
                        if ( !user ) {
                            Inertia.visit( route('login') );
                        } else {
                            // setMenuAnchor(e.currentTarget);
                            setUserMenuOpen( ! userMenuOpen );
                        }
                    }}>
                        { user ? <AccountBox /> : <Login /> }
                    </IconButton>
                    <Menu
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        className="mr-2"
                        id="user-menu"
                        anchorEl={menuAnchor}
                        open={userMenuOpen}
                        onClose={() => setUserMenuOpen(false)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => setUserMenuOpen(false)} >Profile</MenuItem>
                        <MenuItem onClick={() => setUserMenuOpen(false)} >My account</MenuItem>
                        <MenuItem onClick={() => {
                            setUserMenuOpen(false)
                            Inertia.post(route('logout') )

                        }} >Logout</MenuItem>
                    </Menu>
                    <IconButton color="inherit"
                        onMouseEnter={(e) => {
                            setCartAnchor(e.currentTarget);
                        }}
                        onClick={() => setCartMenuOpen(!cartMenuOpen)}
                    >
                        <Badge badgeContent={shoppingCart.reduce( ((total, {qty}) => total+qty ), 0)}
                               color="error"
                        >
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {/*<Paper sx={{ width: 320, maxWidth: '100%' }}>*/}
                    <Popover
                        open={cartMenuOpen}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={cartAnchor}
                    >
                        <Typography variant="subtitlle1"
                            sx={{
                                display: 'block',
                                fontWeight: 'bold',
                                mt: 2,
                                mb: 1,
                                textAlign: 'center',
                            }}
                        >Shopping Cart (5 Items) </Typography>

                        <List sx={{ minWidth: 375, padding: 1 }}>
                            { shoppingCart.map(item =>
                                <>
                                <Divider variant="middle" />
                                <ListItem
                                    sx={{ my: 1 }}
                                    secondaryAction={

                                        <Box alignItems="center"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Stack sx={{ mr: 1 }} spacing={0} alignItems="center">

                                                <IconButton size="small">
                                                    <KeyboardArrowUp fontSize="inherit" />
                                                </IconButton>
                                                <Typography variant="caption">{item.qty}</Typography>
                                                <IconButton size="small">
                                                    <KeyboardArrowDown fontSize="inherit" />
                                                </IconButton>

                                            </Stack>
                                            <Typography
                                                variant="caption"
                                                sx={{ ml: 2 }}
                                            >
                                                ৳ 240
                                            </Typography>
                                            <IconButton size="large" variant="outlined" color="error" sx={{ marginLeft: 1 }}>
                                                <DeleteForever fontSize="inherit" />
                                            </IconButton>

                                        </Box>
                                    }
                                >
                                    <Box width={50} height={50}
                                        sx={{
                                            backgroundImage: "url('" + item.product.image + "')",
                                            backgroundSize: 'cover'
                                        }}
                                    >

                                    </Box>
                                    <Stack
                                        sx={{
                                            marginLeft: 2,
                                            marginY: 0,
                                            width: '33%'
                                        }}
                                    >
                                        <Typography variant="body2">{item.product.english_name}</Typography>
                                        <Typography variant="subtitle2">{item.product.amount} {item.product.uom}</Typography>
                                    </Stack>
                                </ListItem>
                                </>
                            )}
                            <Divider variant="middle" />
                            <ListItem>
                                <ListItemText sx={{ width: '60%', ml: 2}}>Subtotal</ListItemText>
                                <ListItemText sx={{ width: '40%', mr: 4, textAlign: 'right' }}>৳ 1000 /-</ListItemText>
                            </ListItem>
                        </List>
                    </Popover>
                    {/*</Paper>*/}
                </Toolbar>
                </Stack>
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
                        <LinkTree
                            links={navLinks}
                            selectedCategory={selectedCategory}
                            onSelect={() => {
                                setSearchQuery('')
                                setSearchItems([])
                            }}
                        />
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box
                className="flex justify-center px-0"
                sx={{
                    flewGrow: 1,
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
