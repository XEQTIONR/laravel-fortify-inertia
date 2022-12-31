import React, { useState } from 'react'

export default function useInput(initialState) {

    const [values, setValues] = useState(initialState);

    function handleChange(e) {
        const value = e.target.type === 'checkbox' ? !values[e.target.name] : e.target.value
        setValues(values => ({
            ...values,
            [e.target.name]: value,
        }))
    }

    return [
        values,
        handleChange,
    ]
}
