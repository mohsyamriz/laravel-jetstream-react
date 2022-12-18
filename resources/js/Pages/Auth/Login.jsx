import { Head, Link, useForm } from "@inertiajs/inertia-react";
import React, { useRef } from "react";
import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Login({ canResetPassword, status }) {
    const emailInput = useRef("");
    const passwordInput = useRef("");

    const form = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        form.post(route("login"));
    };

    return (
        <>
            <Head title="Log in" />

            <AuthenticationCard logo={<AuthenticationCardLogo />}>
                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={form.data.email}
                            isFocused
                            ref={emailInput}
                            handleChange={(e) =>
                                form.setData("email", e.target.value)
                            }
                        />
                        <InputError
                            message={form.errors.email}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={form.data.password}
                            autoComplete="current-password"
                            ref={passwordInput}
                            handleChange={(e) =>
                                form.setData("password", e.target.value)
                            }
                        />
                        <InputError
                            message={form.errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                value={form.data.remember}
                                handleChange={(e) =>
                                    form.setData("remember", e.target.checked)
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-gray-600 hover:text-gray-900"
                            >
                                Forgot your password
                            </Link>
                        )}
                        <PrimaryButton
                            className="ml-4"
                            processing={form.processing}
                        >
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </AuthenticationCard>
        </>
    );
}
