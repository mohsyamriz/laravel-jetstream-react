import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/inertia-react";
import React, { useRef, useState } from "react";

export default function TwoFactorChallenge() {
    const [recovery, setRecovery] = useState(false);

    const form = useForm({
        code: "",
        recovery_code: "",
    });

    const recoveryCodeInput = useRef(null);
    const codeInput = useRef(null);

    const toggleRecovery = async () => {
        setRecovery((recovery != true));

        if (recovery) {
            recoveryCodeInput.current.focus();
            form.data.code = "";
        } else {
            codeInput.current.focus();
            form.data.recovery_code = "";
        }
    };

    const submit = (e) => {
        e.preventDefault();

        form.post(route("two-factor.login"));
    };

    return (
        <>
            <Head title="Two-factor Confirmation" />

            <AuthenticationCard
                logo={<AuthenticationCardLogo />}
            >
                <div className="mb-4 text-sm text-gray-600">
                    {!recovery 
                        ? "Please confirm access to your account by entering the authentication code provided by your authenticator application."
                        : "Please confirm access to your account by entering one of your emergency recovery codes."
                    }
                </div>

                <form onSubmit={submit}>
                    {!recovery ? (
                        <div>
                            <InputLabel htmlFor="code" value="Code" />
                            <TextInput
                                id="code"
                                ref={codeInput}
                                value={form.data.code}
                                className="mt-1 block w-full"
                                isFocused
                                autoComplete="one-time-code"
                                handleChange={(e) => form.setData("code", e.target.value)}
                            />
                            <InputError message={form.errors.code} className="mt-2" />
                        </div>
                    ) : (
                        <div>
                            <InputLabel htmlFor="recovery_code" value="Recovery Code" />
                            <TextInput
                                id="recovery_code"
                                ref={recoveryCodeInput}
                                value={form.data.recovery_code}
                                className="mt-1 block w-full"
                                autoComplete="one-time-code"
                                handleChange={(e) => form.setData("recovery_code", e.target.value)}
                            />
                            <InputError message={form.errors.recovery_code} className="mt-2" />
                        </div>
                    )}
                    <div className="flex items-center justify-end mt-4">
                        <button 
                            type="button"
                            className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"
                            onClick={toggleRecovery}
                        >
                            {!recovery 
                                ? "Use a recovery code"
                                : "Use an authentication code"
                            }
                        </button>
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
