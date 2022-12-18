import { usePage } from "@inertiajs/inertia-react";
import React from "react";
import SectionBorder from "@/Components/SectionBorder";
import AppLayout from "@/Layouts/AppLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import LogoutOtherBrowserSessionsForm from "./Partials/LogoutOtherBrowserSessionsForm";
import TwoFactorAuthenticationForm from "./Partials/TwoFactorAuthenticationForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Show({ confirmsTwoFactorAuthentication, sessions }) {
    const props = usePage().props;

    return (
        <>
            <AppLayout
                title="Profile"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Profile
                    </h2>
                }
            >
                <div>
                    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                        {props.jetstream.canUpdateProfileInformation && (
                            <>
                                <UpdateProfileInformationForm user={props.user} />

                                <SectionBorder />
                            </>
                        )}
                        {props.jetstream.canUpdatePassword && (
                            <>
                                <UpdatePasswordForm className="mt-10 sm:mt-0" />

                                <SectionBorder />
                            </>
                        )}
                        {props.jetstream.canManageTwoFactorAuthentication && (
                            <>
                                <TwoFactorAuthenticationForm
                                    requiresConfirmation={confirmsTwoFactorAuthentication}
                                    className="mt-10 sm:mt-0"
                                />

                                <SectionBorder />
                            </>
                        )}

                        <LogoutOtherBrowserSessionsForm sessions={sessions} className="mt-10 sm:mt-0" />

                        {props.jetstream.hasAccountDeletionFeatures && (
                            <>
                                <SectionBorder />

                                <DeleteUserForm className="mt-10 sm:mt-0" />
                            </>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
