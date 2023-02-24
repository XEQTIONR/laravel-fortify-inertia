import Nav from '@/Components/Admin/Nav';
import DashboardCard from '@/Components/Admin/DashboardCard';

import {Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import navItems from  '@/Components/data/AdminNavItems';
import { FormatListBulleted } from "@mui/icons-material";

export default function Dashboard() {
    return (
        <Nav navLinks={navItems}>
            <DashboardCard />
        </Nav>
    );
}
