import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/inertia-react";
import React from "react";

export default function ResetPassword({ email, token }) {
    const form = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        form.post(route('password.update'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <AuthenticationCard
                logo={<AuthenticationCardLogo />}
            >
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            value={form.data.email}
                            type="email"
                            className="mt-1 block w-full"
                            isFocused
                            handleChange={(e) => form.setData("email", e.target.value)}
                        />
                        <InputError message={form.errors.email} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            value={form.data.password}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            handleChange={(e) => form.setData("password", e.target.value)}
                        />
                        <InputError message={form.errors.password} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            value={form.data.password_confirmation}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            handleChange={(e) => form.setData("password_confirmation", e.target.value)}
                        />
                        <InputError message={form.errors.password_confirmation} className="mt-2" />
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton processing={form.processing}>
                            Reset Password
                        </PrimaryButton>
                    </div>
                </form>
            </AuthenticationCard>
        </>
    );
}
