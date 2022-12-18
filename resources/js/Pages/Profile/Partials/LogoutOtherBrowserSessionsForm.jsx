import { useForm } from "@inertiajs/inertia-react";
import React, { useRef, useState } from "react";
import ActionMessage from "@/Components/ActionMessage";
import ActionSection from "@/Components/ActionSection";
import DialogModal from "@/Components/DialogModal";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";

export default function LogoutOtherBrowserSessionsForm({
    sessions,
    className = "",
}) {
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const passwordInput = useRef(null);

    const form = useForm({
        password: "",
    });

    const confirmLogout = () => {
        setConfirmingLogout(true);

        setTimeout(() => passwordInput.current.focus(), 250);
    };

    const logoutOtherBrowserSessions = (e) => {
        e.preventDefault();

        form.delete(route('other-browser-sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => form.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingLogout(false);

        form.reset();
    };

    return (
        <>
            <ActionSection
                title="Browser Sessions"
                description="Manage and log out your active sessions on other browsers and devices."
                className={className}
            >
                <div className="max-w-xl text-sm text-gray-600">
                    If necessary, you may log out of all of your other browser
                    sessions across all of your devices. Some of your recent
                    sessions are listed below; however, this list may not be
                    exhaustive. If you feel your account has been compromised,
                    you should also update your password.
                </div>

                {/* Other Browser Sessions */}
                {sessions.length > 0 && (
                    <div className="mt-5 space-y-6">
                        {sessions.map((session, i) => (
                            <div className="flex items-center" key={i}>
                                <div>
                                    {session.agent.is_desktop ? (
                                        <svg
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-8 h-8 text-gray-500"
                                        >
                                            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-8 h-8 text-gray-500"
                                        >
                                            <path d="M0 0h24v24H0z" stroke="none" />
                                            <rect x="7" y="4" width="10" height="16" rx="1" />
                                            <path d="M11 5h2M12 17v.01" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm text-gray-600">
                                        {session.agent.platform ? session.agent.platform : "Unknown"}{" - "}{session.agent.browser ? session.agent.browser : "Unknown"}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">
                                            {session.ip_address + " - "}
                                            {session.is_current_device ? (
                                                <span className="text-green-500 font-semibold">This device</span>
                                            ) : (
                                                <span>Last active {session.last_active}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center mt-5">
                    <PrimaryButton onClick={confirmLogout}>
                        Log Out Other Browser Sessions
                    </PrimaryButton>
                    <ActionMessage on={form.recentlySuccessful} className="ml-3">
                        Done.
                    </ActionMessage>
                </div>

                {/* Log Out Other Devices Confirmation Modal */}
                <DialogModal 
                    show={confirmingLogout} 
                    onClose={closeModal}
                    title="Log Out Other Browser Sessions"
                    footer={
                        <>
                            <SecondaryButton onClick={closeModal}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                className="ml-3"
                                processing={form.processing}
                                onClick={logoutOtherBrowserSessions}
                            >
                                Log Out Other Browser Sessions
                            </PrimaryButton>
                        </>
                    }
                >
                    Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.

                    <div className="mt-4">
                        <TextInput
                            ref={passwordInput}
                            type="password"
                            className="mt-1 block w-3/4"
                            placeholder="Password"
                            value={form.data.password}
                            handleChange={(e) => form.setData("password", e.target.value)}
                        />
                        <InputError message={form.errors.password} className="mt-2" />
                    </div>
                </DialogModal>
            </ActionSection>
        </>
    );
}
