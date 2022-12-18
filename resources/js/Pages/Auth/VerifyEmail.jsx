import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import PrimaryButton from "@/Components/PrimaryButton";

export default function VerifyEmail({ status }) {
    const form = useForm();

    const submit = (e) => {
        e.preventDefault();

        form.post(route("verification.send"));
    }

    return (
        <>
            <Head title="Email Verification" />

            <AuthenticationCard logo={<AuthenticationCardLogo />}>
                <div className="mb-4 text-sm text-gray-600">
                    Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                </div>

                {status === "verification-link-sent" && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        A new verification link has been sent to the email address you provided in your profile settings.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex items-center justify-between">
                        <PrimaryButton processing={form.processing}>
                            Resend Verification Email
                        </PrimaryButton>

                        <div>
                            <Link href={route("profile.show")} className="underline text-sm text-gray-600 hover:text-gray-900">
                                Edit Profile
                            </Link>
                            <Link 
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="underline text-sm text-red-600 hover:text-red-900 ml-2"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </form>
            </AuthenticationCard>
        </>
    );
}