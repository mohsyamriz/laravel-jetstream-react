import { useForm } from "@inertiajs/inertia-react";
import React, { useRef, useState } from "react";
import ActionSection from "@/Components/ActionSection";
import DangerButton from "@/Components/DangerButton";
import DialogModal from "@/Components/DialogModal";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);

    const form = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);

        setTimeout(() => passwordInput.current.focus(), 250);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        form.delete(route("current-user.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => form.reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        form.reset();
    };

    return (
        <>
            <ActionSection
                title="Delete Account"
                description="Permanently delete your account."
                className={className}
            >
                <div className="max-w-xl text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </div>

                <div className="mt-5">
                    <DangerButton onClick={confirmUserDeletion}>
                        Delete Account
                    </DangerButton>
                </div>

                {/* Delete Account Confirmation Modal */}
                <DialogModal 
                    show={confirmingUserDeletion} 
                    onClose={closeModal}
                    title="Delete Account"
                    footer={
                        <>
                            <SecondaryButton onClick={closeModal}>
                                Cancel
                            </SecondaryButton>
                            <DangerButton
                                className="ml-3"
                                processing={form.processing}
                                onClick={deleteUser}
                            >
                                Delete Account
                            </DangerButton>
                        </>
                    }
                >
                    Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.

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
