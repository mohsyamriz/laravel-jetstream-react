import { Head } from "@inertiajs/inertia-react";
import React from "react";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import parse from "html-react-parser";

export default function PrivacyPolicy({ terms }) {
    return (
        <>
            <Head title="Terms Of Service" />

            <div className="font-sans text-gray-900 antialiased">
                <div className="pt-4 bg-gray-100">
                    <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
                        <div>
                            <AuthenticationCardLogo />
                        </div>

                        <div className="w-full sm:max-w-2xl mt-6 p-6 bg-white shadow-md overflow-hidden sm:rounded-lg prose">
                            {parse(terms)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
