import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { PlaylistAddCheck } from '@mui/icons-material';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {Inertia} from "@inertiajs/inertia";
import { usePage } from '@inertiajs/inertia-react';

export default function AccountMenu() {

    const { user } = usePage().props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const visit = (url, method = 'visit') => {

        setAnchorEl(null);
        switch (method) {
            case 'visit':
                Inertia.visit(url);
                break;
            case 'post':
                Inertia.post(url);
                break;
        }
    };
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title={ trans("labels.Account settings")}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            className="cursor-pointer text-sm font-bold"
                            sx={{ width: 30, height: 30 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >

                <MenuItem onClick={() => {
                    visit(route('account'))
                }}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    {trans('labels.My account and settings')}
                </MenuItem>
                <MenuItem onClick={() => {
                    visit(route('orders.index'));
                }}>
                    <ListItemIcon>
                        <PlaylistAddCheck fontSize="small" />
                    </ListItemIcon>
                    {trans('labels.My orders')}
                </MenuItem>
                <MenuItem onClick={() => {
                    visit(route('logout'), 'post')
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    {trans('labels.Log out')}
                </MenuItem>
            </Menu>
        </>
    );
}
