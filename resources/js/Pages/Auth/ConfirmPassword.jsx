import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/inertia-react";
import React, { useRef } from "react";

export default function ConfirmPassword() {
    const form = useForm({
        password: "",
    });

    const passwordInput = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        form.post(route('password.confirm'), {
            onFinish: () => {
                form.reset();

                passwordInput.current.focus();
            },
        });
    };

    return (
        <>
            <Head title="Secure Area" />

            <AuthenticationCard logo={<AuthenticationCardLogo />}>
                <div className="mb-4 text-sm text-gray-600">
                    This is a secure area of the application. Please confirm your password before continuing.
                </div>

                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={form.data.password}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            isFocused
                            handleChange={(e) => form.setData("password", e.target.value)}
                        />
                        <InputError message={form.errors.password} className="mt-2" />
                    </div>
                    <div className="flex justify-end mt-4">
                        <PrimaryButton processing={form.processing} className="ml-4">
                            Confirm
                        </PrimaryButton>
                    </div>
                </form>
            </AuthenticationCard>
        </>
    );
}
