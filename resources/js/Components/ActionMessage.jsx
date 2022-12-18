import { Transition } from "@headlessui/react";
import React from "react";

export default function ActionMessage({ on, className = "", children }) {
    return (
        <>
            <div className={className}>
                <Transition 
                    show={on}
                    enterFrom="opacity-0"
                    leaveTo="opacity-0"
                    className="transition ease-in-out duration-1000"
                >
                    {on && <div className="text-sm text-gray-600">{children}</div>}
                </Transition>
            </div>
        </>
    )
}