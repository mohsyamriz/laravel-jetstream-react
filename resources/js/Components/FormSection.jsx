import React from "react";
import SectionTitle from "./SectionTitle";

export default function FormSection({
    title,
    description,
    actions,
    className = "",
    submitted = () => {},
    children,
}) {
    const hasActions = Boolean(actions);

    return (
        <>
            <div className={`md:grid md:grid-cols-3 md:gap-6 ${className}`}>
                <SectionTitle
                    title={title}
                    description={description}
                />

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={submitted}>
                        <div className={`px-4 py-5 bg-white sm:p-6 shadow ${hasActions ? "sm:rounded-tl-md sm:rounded-tr-md" : "sm:rounded-md"}`}>
                            <div className="grid grid-cols-6 gap-6">
                                {children}
                            </div>
                        </div>
                        {hasActions && (
                            <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md">
                                {actions}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
