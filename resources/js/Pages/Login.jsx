import { Inertia } from '@inertiajs/inertia'
import React, { useState } from 'react'
import useInput from "../hooks/useInput";

export default function Login ({errors}) {

    const [values, handleChange] = useInput({
        email: "",
        password: "",
        remember: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        Inertia.post(route('login'), values);
    }
    return (
        <>
            { errors.email && <div>{ errors.email }</div> }
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        name="email"
                        required
                        autoFocus
                        value={values.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        value={values.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="block mt-4">
                    <label htmlFor="remember">
                    <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        checked={values.remember}
                        onChange={handleChange}
                    />
                    Remember me
                    </label>
                </div>



                <div>
                    <button type="submit">
                        Log In
                    </button>
                </div>
            </form>
        </>
    );
}
