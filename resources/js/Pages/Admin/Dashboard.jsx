import Nav from '@/Components/Admin/Nav';
import DashboardCard from '@/Components/Admin/DashboardCard';

import {Box, IconButton, Typography} from "@mui/material";
import navItems from  '@/Components/data/AdminNavItems';
import { FormatListBulleted } from "@mui/icons-material";

export default function Dashboard() {
    return (
        <Nav navLinks={navItems}>
            <Box className="flex flex-row items-start w-full h-full">
                <DashboardCard
                    button={
                        <IconButton size="small" className="mr-1">
                            <FormatListBulleted fontSize="inherit" />
                        </IconButton>
                    }
                    header="New orders"
                    content="16"
                    footer="Orders to be processed"
                />
                <DashboardCard
                    button={
                        <IconButton size="small" className="mr-1">
                            <FormatListBulleted fontSize="inherit" />
                        </IconButton>
                    }
                    header="Outstanding deliveries"
                    content="10"
                    footer="Orders to be delivered"
                />
            </Box>
        </Nav>
    );
}
