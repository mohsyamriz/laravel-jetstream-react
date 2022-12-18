import React, { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        id,
        name,
        value,
        placeholder = "",
        className = "",
        autoComplete,
        required,
        isFocused,
        handleChange,
        disabled,
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <>
            <input 
                type={type}
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                className={`border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ${className}`}
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
                disabled={disabled}
            />
        </>
    )
}) 