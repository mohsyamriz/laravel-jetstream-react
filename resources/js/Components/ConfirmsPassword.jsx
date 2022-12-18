import React, { useRef, useState } from "react";
import DialogModal from "./DialogModal";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import axios from "axios";
import TextInput from "./TextInput";
import InputError from "./InputError";

export default function ConfirmsPassword({
    title = "Confirm Password",
    content = "For your security, please confirm your password to continue.",
    button = "Confirm",
    children,
    confirmed = () => {},
}) {
    const [confirmingPassword, setConfirmingPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const passwordInput = useRef(null);

    const startConfirmingPassword = () => {
        axios.get(route("password.confirmation")).then((response) => {
            if (response.data.confirmed) {
                confirmed();
            } else {
                setConfirmingPassword(true);

                setTimeout(() => passwordInput.current.focus(), 250);
            }
        });
    };

    const confirmPassword = () => {
        setProcessing(true);

        axios.post(route("password.confirm"), {
            password: password,
        })
        .then(() => {
            setProcessing(false);

            closeModal();
            confirmed();
        })
        .catch((error) => {
            setProcessing(false);
            setError(error.response.data.errors.password[0]);
            passwordInput.current.focus();
        });
    };

    const closeModal = () => {
        setConfirmingPassword(false);
        setPassword("");
        setError("");
    };

    return (
        <>
            <span>
                <span onClick={startConfirmingPassword}>
                    {children}
                </span>
                
                <DialogModal show={confirmingPassword} onClose={closeModal} title={title} footer={
                    <>
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3"
                            processing={processing}
                            onClick={confirmPassword}
                        >
                            {button}
                        </PrimaryButton>
                    </>
                }>
                    {content}

                    <div className="mt-4">
                        <TextInput
                            type="password"
                            ref={passwordInput}
                            className="mt-1 block w-3/4"
                            value={password}
                            placeholder="Password"
                            handleChange={(e) => setPassword(e.target.value)}
                        />
                        <InputError message={error} className="mt-2" />
                    </div>
                </DialogModal>
            </span>
        </>
    );
}
