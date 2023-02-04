import React, {useState}  from 'react';
import Nav from '@/Components/Nav';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export default function Home ({ categories, category }) {

    const [items, setItems] = useState([
        '🦊','🦊','🦊','🦊','🦊','🦊',
        '🦊','🦊','🦊','🦊','🦊','🦊','🦊','🦊',
        '🦊','🦊','🦊','🦊','🦊','🦊','🦊','🦊',
    ]);

    return (
        <Nav navLinks={categories.data} selectedCategory={category}>
            <Grid
                className="bg-amber-500 flex-wrap content-start"
                spacing={2}
                container
            >
                {
                    items.map((thing) => (
                        <Grid
                            className="text-center"
                            item
                            xs={12} sm={6} md={4} lg={3}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    paddingTop: '100%'
                                }}
                                className="bg-blue-500"
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                    }}
                                >
                                    {thing}
                                </span>
                            </div>
                        </Grid>
                    ))
                }
            </Grid>
        </Nav>
    );
}
