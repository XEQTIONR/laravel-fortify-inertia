import React, { useState } from 'react';
import Nav from '@/Components/Nav';

export default function Home ({ categories, category }) {

    const [menuItems, setMenuItems] = useState(categories.data);
    return (
        <Nav navLinks={categories.data} selectedCategory={category}>

            <div>{category ? category.data.english_name : 'We are home!'}</div>
        </Nav>
    );
}
