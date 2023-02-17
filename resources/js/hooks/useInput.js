import React, { useState, useRef } from 'react'

export default function useInput(initialState) {

    const [values, setValues] = useState(initialState);
    const initialValues = useRef(initialState);

    function handleChange(e) {
        const value = e.target.type === 'checkbox' ? !values[e.target.name] : e.target.value
        setValues(values => ({
            ...values,
            [e.target.name]: value,
        }))
    }

    function reset() {
        setValues(initialValues.current)
    }

    return [
        values,
        handleChange,
        reset,
    ]
}
