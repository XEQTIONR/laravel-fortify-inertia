import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';

export default function Dashboard() {
    return (
            <>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            flexGrow: 1,
                        }}
                    >

                    </Box>
                    <Button color="secondary">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            </>

    );
}
