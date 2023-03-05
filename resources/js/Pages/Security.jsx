import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Nav from '@/Components/Nav';
import {Verified} from '@mui/icons-material';

import { Box, Button, Card, Divider, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';

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
                            <Button onClick={() => Inertia.visit(route('security.edit', { field: 'name' }))} variant="contained">Edit</Button>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={trans('labels.Email')}
                                secondary={
                                    <>
                                        {user.email}

                                    </>
                                }
                            />
                            <Button onClick={() => Inertia.visit(route('security.edit', { field: 'email' }))} variant="contained">Edit</Button>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary={trans('labels.Mobile number')}
                                secondary={
                                    <>
                                        {'+88'+user.primary_contact_number}
                                        {
                                            user.sms_verified_at && (<Tooltip title="Verified">
                                                <Verified color="success" fontSize="small" className="ml-2" />
                                            </Tooltip>)
                                        }
                                    </>
                                }
                            />
                            <Button onClick={() => Inertia.visit(route('security.edit', { field: 'primary_contact_number' }))} variant="contained">Edit</Button>
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
                <Button
                    onClick={() => { Inertia.visit( route('account') ) }}
                    className="mt-4"
                    variant="contained"
                >
                    Done
                </Button>
            </Box>
        </Nav>
    )

}
