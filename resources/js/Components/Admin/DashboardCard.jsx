import {Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import { FormatListBulleted } from "@mui/icons-material";

export default function DashboardCard() {
    return (
        <Card className="md:w-1/3 lg:w-1/4" sx={{ maxWidth: '225px' }}>
            <CardHeader
                action={
                    <IconButton size="small" className="mr-1">
                        <FormatListBulleted fontSize="inherit" />
                    </IconButton>
                }
                title="New Orders"
                titleTypographyProps={{
                    variant: 'subtitle1',
                    className: 'font-bold'
                }}
                subheader="Orders to be processed"
                subheaderTypographyProps={{ variant: 'caption' }}
            >
            </CardHeader>
            <CardContent className="pt-0">
                <Typography variant="h3">16</Typography>
            </CardContent>
        </Card>
    );

}
