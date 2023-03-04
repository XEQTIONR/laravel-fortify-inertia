import React, { useState } from 'react';

import Nav from '@/Components/Nav';

import { Box, Button, Card, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';

export default function Security({shopping_cart, categories, user}) {

    const [cart, setCart] = useState(shopping_cart);

    return (
        <Nav navLinks={categories.data}
             selectedCategory={null}
             showUserMenu={true}
             shoppingCart={cart}
             setShoppingCart={setCart}
             user
        >
            <Box className="w-full mt-3 mx-3 md:w-3/4 lg:w-1/2">
                <Typography variant="h6" className="mb-2">Login & Security</Typography>
                <Card className="w-full flex flex-col" variant="outlined">
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={trans('labels.Full name')}
                                secondary={user.name}

                            />
                            <Button variant="contained">Edit</Button>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={trans('labels.Email')}
                                secondary={user.email}
                            />
                            <Button variant="contained">Edit</Button>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={trans('labels.Mobile number')}
                                secondary={'+88'+user.primary_contact_number}
                            />
                            <Button variant="contained">Edit</Button>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={trans('labels.Password')}
                                secondary="*************"
                            />
                            <Button variant="contained">Edit</Button>
                        </ListItem>
                    </List>
                </Card>
                <Button className="mt-4" variant="contained">Done</Button>
            </Box>
        </Nav>
    )

}
