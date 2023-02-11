import React from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';


const SearchInput = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //     // marginLeft: theme.spacing(3),
    //     width: 'auto',
    // },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));
export default function NavSearchBar ({onChange, value}) {

    return (
        <SearchInput>
            <Box
                className="h-full absolute pointer-events-none flex justify-center items-center px-4 py-0"
            >
                <SearchIcon />
            </Box>
            <StyledInputBase
                value={value}
                onChange={onChange}
                className="w-full"
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
            />
        </SearchInput>
    )
}
