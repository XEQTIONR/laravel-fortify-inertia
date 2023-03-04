import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { Link } from "@inertiajs/inertia-react";

export default function AccountCard({link, icon, title, subtitle}) {
    return (
        <Link href={link}
              className="w-full md:w-1/2 lg:w-1/3 pb-2 pr-2"
        >
            <Card
                variant="outlined"
                className="w-full p-3 flex items-center hover:cursor-pointer"
                sx={{ minHeight: 100}}
            >
                {icon}
                <Box>
                    <Typography className="font-bold">{title}</Typography>
                    <Typography>{subtitle}</Typography>
                </Box>
            </Card>
        </Link>
    )
}
