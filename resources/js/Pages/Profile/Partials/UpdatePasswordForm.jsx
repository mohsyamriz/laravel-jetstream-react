import { Link, useForm, usePage } from "@inertiajs/inertia-react";
import React, { useRef } from "react";
import ActionMessage from "@/Components/ActionMessage";
import FormSection from "@/Components/FormSection";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        
        form.put(route('user-password.update'), {
            errorBag: 'updatePassword',
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: () => {
                if (form.errors.password) {
                    form.reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (form.errors.current_password) {
                    form.reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <>
            <FormSection
                submitted={updatePassword}
                title={"Update Password"}
                description={
                    "Ensure your account is using a long, random password to stay secure."
                }
                actions={
                    <>
                        <ActionMessage on={form.recentlySuccessful} className="mr-3">
                            Saved.
                        </ActionMessage>
                        <PrimaryButton processing={form.processing}>
                            Save
                        </PrimaryButton>
                    </>
                }
                className={className}
            >
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="current_password" value="Current Password" />
                    <TextInput
                        id="current_password"
                        type="password"
                        ref={currentPasswordInput}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        value={form.data.current_password}
                        handleChange={(e) => form.setData("current_password", e.target.value)}
                    />
                    <InputError message={form.errors.current_password} className="mt-2" />
                </div>
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="password" value="New Password" />
                    <TextInput
                        id="password"
                        type="password"
                        ref={passwordInput}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        value={form.data.password}
                        handleChange={(e) => form.setData("password", e.target.value)}
                    />
                    <InputError message={form.errors.password} className="mt-2" />
                </div>
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        ref={passwordInput}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        value={form.data.password_confirmation}
                        handleChange={(e) => form.setData("password_confirmation", e.target.value)}
                    />
                    <InputError message={form.errors.password_confirmation} className="mt-2" />
                </div>
            </FormSection>
        </>
    );
}
