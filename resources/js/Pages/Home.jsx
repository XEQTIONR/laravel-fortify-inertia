import React, { useState } from 'react';
import Nav from '@/Components/Nav';

export default function Home ({ categories }) {

    const [menuItems, setMenuItems] = useState(categories.data);
    return (
        <Nav navLinks={categories.data}>
            <div>We are home!</div>
        </Nav>
    );
}
