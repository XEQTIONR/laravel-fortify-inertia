import React from 'react';
import { Box, Button, Typography, Skeleton } from "@mui/material";


export default function ProductCardSkeleton () {
    return (
        <Box
            className="p-3 mt-2 mb-6 flex flex-col hover:border   hover:shadow-xl "
            sx={{ width: "250px" }}
        >
            <Skeleton variant="rectangular" width={225} height={225} />
            <Skeleton className="mt-2 mb-7" variant="rectangular" width={225} height={20} />
            <Skeleton className="mb-3" variant="rectangular" width={225} height={55} />
            <Skeleton variant="rounded" width={225} height={35} />
        </Box>
    )
}
