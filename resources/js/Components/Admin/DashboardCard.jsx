import {Card, CardContent, CardHeader, CardActions, IconButton, Tooltip, Typography} from "@mui/material";

export default function DashboardCard({header, content, footer, button, menuItems}) {
    return (
        <Card
            elevation={5}
            variant="elevation"
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
            <CardContent className="py-0">
                <Typography className="my-3 font-bold" variant="h3">{content}</Typography>
                {
                    footer
                    && <Typography variant="caption">{footer}</Typography>
                }

            </CardContent>
            <CardActions disableSpacing>
                { menuItems &&
                    menuItems.map( ({ icon, label, onClick }, index) => (
                        <Tooltip key={index} title={label}>
                            <IconButton onClick={onClick}>{icon}</IconButton>
                        </Tooltip>
                    ))
                }
            </CardActions>
        </Card>
    );

}
