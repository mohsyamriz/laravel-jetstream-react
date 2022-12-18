import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Register() {
    const props = usePage().props;

    const form = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();

        form.post(route("register"), {
            onFinish: () => form.reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

            <AuthenticationCard logo={<AuthenticationCardLogo />}>
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={form.data.name}
                            autoComplete="name"
                            handleChange={(e) =>
                                form.setData("name", e.target.value)
                            }
                            isFocused
                        />
                        <InputError
                            className="mt-2"
                            message={form.errors.name}
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={form.data.email}
                            handleChange={(e) =>
                                form.setData("email", e.target.value)
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={form.errors.email}
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={form.data.password}
                            autoComplete="new-password"
                            handleChange={(e) =>
                                form.setData("password", e.target.value)
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={form.errors.password}
                        />
                    </div>
                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full"
                            value={form.data.password_confirmation}
                            autoComplete="new-password"
                            handleChange={(e) =>
                                form.setData(
                                    "password_confirmation",
                                    e.target.value
                                )
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={form.errors.password_confirmation}
                        />
                    </div>
                    {props.jetstream.hasTermsAndPrivacyPolicyFeature && (
                        <div className="mt-4">
                            <InputLabel htmlFor="terms">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="terms"
                                        name="terms"
                                        value={form.data.terms}
                                        handleChange={(e) =>
                                            form.setData(
                                                "terms",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <div className="ml-2">
                                        I agree to the{" "}
                                        <a
                                            target="_blank"
                                            href={route("terms.show")}
                                            className="underline text-sm text-indigo-600 hover:text-indigo-900"
                                        >Terms of Service</a>
                                        {" "}and{" "}
                                        <a
                                            target="_blank"
                                            href={route("policy.show")}
                                            className="underline text-sm text-indigo-600 hover:text-indigo-900"
                                        >Privacy Policy</a>
                                    </div>
                                </div>
                            </InputLabel>
                            <InputError className="mt-2" message={form.errors.terms} />
                        </div>
                    )}
                    <div className="flex items-center justify-end mt-4">
                        <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                            Already registered?
                        </Link>
                        <PrimaryButton processing={form.processing} className="ml-4">
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </AuthenticationCard>
        </>
    );
}
