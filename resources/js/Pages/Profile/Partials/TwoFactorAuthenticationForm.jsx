import { Inertia } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import axios from "axios";
import React, { useState } from "react";
import ActionSection from "@/Components/ActionSection";
import parse from "html-react-parser";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ConfirmsPassword from "@/Components/ConfirmsPassword";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

export default function TwoFactorAuthenticationForm({ requiresConfirmation, className = "" }) {
    const props = usePage().props;

    const [enabling, setEnabling] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [setupKey, setSetupKey] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    const confirmationForm = useForm({
        code: "",
    });

    const twoFactorEnabled = !enabling && props.user?.two_factor_enabled;

    const enableTwoFactorAuthentication = () => {
        setEnabling(true);

        Inertia.post('/user/two-factor-authentication', {}, {
            preserveScroll: true,
            onSuccess: () => Promise.all([
                showQrCode(),
                showSetupKey(),
                showRecoveryCodes(),
            ]),
            onFinish: () => {
                setEnabling(false);
                setConfirming(props.requiresConfirmation);
            },
        });
    };

    const showQrCode = async () => {
        const response = await axios.get('/user/two-factor-qr-code');
        setQrCode(response.data.svg);
    };

    const showSetupKey = async () => {
        const response = await axios.get('/user/two-factor-secret-key');
        setSetupKey(response.data.secretKey);
    }

    const showRecoveryCodes = async () => {
        const response = await axios.get('/user/two-factor-recovery-codes');
        setRecoveryCodes(response.data);
    };

    const confirmTwoFactorAuthentication = () => {
        confirmationForm.post('/user/confirmed-two-factor-authentication', {
            errorBag: "confirmTwoFactorAuthentication",
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setConfirming(false);
                setQrCode(null);
                setSetupKey(null);
            },
        });
    };

    const regenerateRecoveryCodes = () => {
        axios
            .post('/user/two-factor-recovery-codes')
            .then(() => showRecoveryCodes());
    };

    const disableTwoFactorAuthentication = () => {
        setDisabling(true);

        Inertia.delete('/user/two-factor-authentication', {
            preserveScroll: true,
            onSuccess: () => {
                setDisabling(false);
                setConfirming(false);
            },
        });
    };

    let heading3;
    if (twoFactorEnabled && !confirming) {
        heading3 = "You have enabled two factor authentication.";
    }
    else if (twoFactorEnabled && confirming) {
        heading3 = "Finish enabling two factor authentication.";
    }
    else {
        heading3 = "You have not enabled two factor authentication."
    }

    return (
        <>
            <ActionSection 
                title={"Two Factor Authentication"} 
                description={"Add additional security to your account using two factor authentication."} 
                className={className}
            >
                <h3 className="text-lg font-medium text-gray-900">{heading3}</h3>

                <div className="mt-3 max-w-xl text-sm text-gray-600">
                    <p>When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.</p>
                </div>

                {twoFactorEnabled && (
                    <div>
                        {qrCode && (
                            <div>
                                <div className="mt-4 max-w-xl text-sm text-gray-600">
                                    {confirming 
                                        ? <p className="font-semibold">To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.</p>
                                        : <p>Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key.</p>
                                    }
                                </div>
                                <div className="mt-4">
                                    {parse(qrCode)}
                                </div>

                                {setupKey && (
                                    <div className="mt-4 max-w-xl text-sm text-gray-600">
                                        <p className="font-semibold">
                                            Setup Key: <span>{parse(setupKey)}</span>
                                        </p>
                                    </div>
                                )}

                                {confirming && (
                                    <div className="mt-4">
                                        <InputLabel htmlFor="code" value="Code" />
                                        <TextInput
                                            id="code"
                                            name="code"
                                            className="block mt-1 w-1/2"
                                            isFocused
                                            autoComplete="one-time-code"
                                            value={confirmationForm.data.code}
                                            handleChange={(e) => confirmationForm.setData("code", e.target.value)}
                                        />
                                        <InputError message={confirmationForm.errors.code} className="mt-2" />
                                    </div>
                                )}
                            </div>
                        )}
                        {recoveryCodes.length > 0 && !confirming && (
                            <div>
                                <div className="mt-4 max-w-xl text-sm text-gray-600">
                                    <p className="font-semibold">
                                        Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.
                                    </p>
                                </div>
                                <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 rounded-lg">
                                    {recoveryCodes.map((code) => (
                                        <div key={code}>
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-5">
                    {!twoFactorEnabled ? (
                        <div>
                            <ConfirmsPassword confirmed={enableTwoFactorAuthentication}>
                                <PrimaryButton type="button" processing={enabling}>
                                    Enable
                                </PrimaryButton>
                            </ConfirmsPassword>
                        </div>
                    ) : (
                        <div>
                            <ConfirmsPassword confirmed={confirmTwoFactorAuthentication}>
                                {confirming && (
                                    <PrimaryButton
                                        type="button"
                                        className="mr-3"
                                        processing={enabling}
                                    >
                                        Confirm
                                    </PrimaryButton>
                                )}
                            </ConfirmsPassword>

                            <ConfirmsPassword confirmed={regenerateRecoveryCodes}>
                                {recoveryCodes.length > 0 && !confirming && (
                                    <SecondaryButton className="mr-3">
                                        Regenerate Recovery Codes
                                    </SecondaryButton>
                                )}
                            </ConfirmsPassword>

                            <ConfirmsPassword confirmed={showRecoveryCodes}>
                                {recoveryCodes.length === 0 && !confirming && (
                                    <SecondaryButton className="mr-3">
                                        Show Recovery Codes
                                    </SecondaryButton>
                                )}
                            </ConfirmsPassword>

                            <ConfirmsPassword confirmed={disableTwoFactorAuthentication}>
                                {confirming && (
                                    <SecondaryButton processing={disabling}>
                                        Cancel
                                    </SecondaryButton>
                                )}
                            </ConfirmsPassword>

                            <ConfirmsPassword confirmed={disableTwoFactorAuthentication}>
                                {!confirming && (
                                    <DangerButton processing={disabling}>
                                        Disable
                                    </DangerButton>
                                )}
                            </ConfirmsPassword>
                        </div>
                    )}
                </div>
            </ActionSection>
        </>
    );
}