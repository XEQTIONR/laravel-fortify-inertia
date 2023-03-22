import React, { useState, useEffect, useCallback } from 'react';
import { Inertia } from '@inertiajs/inertia'
import  {styled} from "@mui/material/styles";
import { usePage } from '@inertiajs/inertia-react';
import {
    AppBar,
    Badge,
    Box,
    Button,
    ButtonGroup,
    createTheme,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    Menu,
    MenuItem,
    Stack,
    Typography,
    Toolbar,
} from '@mui/material';
import AppLogo from '@/Components/AppLogo'
import {
    AccountBox,
    Close,
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Menu as MenuIcon,
    Login,
    ShoppingCart,
} from '@mui/icons-material';

import LinkTree from '@/Components/LinkTree'
import NavSearchBar from '@/Components/NavSearchBar'
import CartCard from '@/Components/CartCard';

import useSearch from '@/hooks/useSearch';
import TreeItem from "@mui/lab/TreeItem";



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

const StyledButtonGroupButton = styled((props) => (
    <Button {...props} />
))(({ theme}) =>({
    [`&:hover`]: {
        //color: theme.palette.secondary.dark,
        fontWeight: 'bold',
    }
}));

function debounce( fn, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn(...args); }, timeout);
    };
}


export default function Nav({
    children,
    navLinks,
    selectedCategory,
    setIsSearching,
    setSearchItems,
    user,
    shoppingCart = null,
    setShoppingCart,
    showUserMenu = true,
}) {
    const [ show, setShow ] = useState(window.outerWidth <= 767
        ? false
        : (JSON.parse(window.localStorage.getItem('showSidebar')) ?? false)
    );
    const [ cartAnchor, setCartAnchor ] = useState(null);
    const [ cartMenuOpen, setCartMenuOpen ] = useState(false);
    const [ mainWidth, setMainWidth ] = useState(window.outerWidth);
    const [ menuType, setMenuType ] = useState((window.outerWidth > 767) ? 'persistent' : 'temporary');
    const [ menuAnchor, setMenuAnchor ] = useState(null);
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ userMenuOpen, setUserMenuOpen ] = useState(false);

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

    const { locale } = usePage().props;

    return (
        <>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
            <AppBar color="secondary" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="flex-start">
                    <Toolbar className="px-1">
                        <Box className="flex items-center justify-start"
                             sx={{ width: show ? drawerWidth : '50px' }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color={show ? "primary" : "gray"}
                                onClick={() => { setShow( !show )}}
                            >
                                <MenuIcon />
                            </IconButton>

                            <AppLogo
                                color="#868686"
                                show={show}
                            />
                        </Box>
                    </Toolbar>
                    <AppLogo
                        color="#868686"
                        className="relative -left-2 mr-4"
                        show={(!show) && window.innerWidth > 600 }
                    />
                    <Toolbar className="w-full px-0">
                        {   setSearchItems
                            ? <NavSearchBar
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
                            : null
                        }

                    </Toolbar>
                    <Toolbar className="pl-0 pr-4">
                        {
                            showUserMenu ?
                                (<>
                                <IconButton
                                    color="gray"
                                    className="mr-2"
                                    onMouseEnter={(e) => {
                                        setMenuAnchor(e.currentTarget);
                                    }}
                                    onClick={(e) => {
                                        if (!user) {
                                            Inertia.visit(route('login'));
                                        } else {
                                            // setMenuAnchor(e.currentTarget);
                                            setUserMenuOpen(!userMenuOpen);
                                        }
                                    }}>
                                    {user ? <AccountBox/> : <Login/>}
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
                                    <MenuItem onClick={() => {
                                        setShow(false);
                                        setUserMenuOpen(false)
                                        Inertia.visit(route('account'))
                                    }} >{trans('labels.My account')}</MenuItem>
                                    <MenuItem onClick={() => {
                                        setShow(false);
                                        setUserMenuOpen(false)
                                        Inertia.visit(route('orders.index'))
                                    }}
                                    >{trans('labels.My orders')}</MenuItem>
                                    <MenuItem onClick={() => {
                                        setUserMenuOpen(false)
                                        Inertia.post(route('logout') )

                                    }} >{trans('labels.Log out')}</MenuItem>
                                </Menu>
                                </>) : null
                        }
                        {
                            shoppingCart
                                ? <>
                                    <IconButton
                                        color="gray"
                                                onMouseEnter={(e) => {
                                                    setCartAnchor(e.currentTarget);
                                                }}
                                                onClick={() => setCartMenuOpen(!cartMenuOpen)}
                                    >
                                        <Badge badgeContent={<strong>{shoppingCart.reduce( ((total, {qty}) => total+qty ), 0)}</strong>}
                                               invisible={shoppingCart.reduce( ((total, {qty}) => total+qty ), 0) === 0}
                                               color="primary" className="font-bold"
                                        >
                                            <ShoppingCart />
                                        </Badge>
                                    </IconButton>
                                    <CartCard
                                        user={user}
                                        open={cartMenuOpen}
                                        setOpen={setCartMenuOpen}
                                        anchor={cartAnchor}
                                        items={shoppingCart}
                                        setItems={setShoppingCart}
                                    />
                                </> : null
                        }
                        {/*<IconButton>*/}
                        {/*    /!*<Typography className="px-1 text-white">En</Typography>*!/*/}
                        {/*    <Typography className="px-1 text-white">বা</Typography>*/}
                        {/*</IconButton>*/}
                        <ButtonGroup className="mx-3" color="primary" size="small" variant="text">
                            <StyledButtonGroupButton onClick={() => {
                                    window.location.href = route('forget',  { locale: 'bn' });
                                }}
                                color={locale === 'bn' ? "primary" : "disabled"}
                                className={locale === 'bn' ? "font-bold" : null}
                            >বা</StyledButtonGroupButton>
                            <StyledButtonGroupButton
                                onClick={() => {
                                    window.location.href = route('forget', { locale: 'en' })
                                }}
                                color={locale === 'en' ? "primary" : "disabled"}
                                className={locale === 'en' ? "font-bold" : null}
                            >En</StyledButtonGroupButton>
                        </ButtonGroup>
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
                                if(setSearchItems) {
                                    setSearchQuery('')
                                    setSearchItems([])
                                }
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
