import Nav from '@/Components/Admin/Nav';
import {Typography} from "@mui/material";
import navItems from  '@/Components/data/AdminNavItems';

export default function Dashboard() {
    return (
        <Nav navLinks={navItems}>
            <Typography paragraph>
                This is another page.
            </Typography>
        </Nav>
    );
}
