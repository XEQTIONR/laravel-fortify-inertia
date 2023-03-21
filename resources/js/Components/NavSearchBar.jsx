import React, { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import SearchIcon from '@mui/icons-material/Search';


const SearchInput = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,

    //borderColor: theme.palette.secondary,
    //backgroundColor: theme.palette.common.white, 0.15),
    //backgroundColor: theme.palette.secondary.light,
    //borderWidth: '2px',
   // borderColor: theme.palette.common.black,
    // '&:hover': {
    //     borderColor: theme.palette.secondary.main,
    // },
    marginRight: 0,
    marginLeft: 0,
    width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //     // marginLeft: theme.spacing(3),
    //     width: 'auto',
    // },
    '& .MuiInputBase-root.Mui-focused': {
        borderColor: theme.palette.secondary.main,
    },
    '& .MuiInputBase-root': {
        borderWidth: '2px',
        borderRadius: theme.shape.borderRadius,
        //backgroundColor: theme.palette.common.white

    }

}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));
export default function NavSearchBar ({onChange, value}) {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <SearchInput>

            <Box
                className="h-full absolute pointer-events-none flex justify-center items-center px-4 py-0"
            >
                <SearchIcon color={ isFocused ? "secondary" : "disabled"} />
            </Box>
            <StyledInputBase
                value={value}
                onChange={onChange}
                onFocus={() => { setIsFocused(true) }}
                onBlur={() => { setIsFocused(false) }}
                className="w-full"
                placeholder={ trans('labels.Search') }
                inputProps={{ 'aria-label': 'search' }}
            />
        </SearchInput>
    )
}
