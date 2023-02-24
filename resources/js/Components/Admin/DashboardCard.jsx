import {Card, CardContent, CardHeader, CardActions, IconButton, Typography} from "@mui/material";
import { FormatListBulleted } from "@mui/icons-material";

export default function DashboardCard({header, content, footer, button}) {
    return (
        <Card
            className="md:w-1/3 lg:w-1/4 mr-5 mb-5"
            sx={{ maxWidth: '225px' }}
        >
            <CardHeader
                action={button}
                title={header}
                titleTypographyProps={{
                    variant: 'subtitle2',
                    className: 'font-bold'
                }}
            >
            </CardHeader>
            <CardContent className="pt-0">
                <Typography className="my-3 font-bold" variant="h3">{content}</Typography>
                {
                    footer
                    && <Typography variant="caption">{footer}</Typography>
                }

            </CardContent>
        </Card>
    );

}
