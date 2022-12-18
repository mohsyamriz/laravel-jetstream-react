import { Link, useForm, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import React, { useRef, useState } from "react";
import ActionMessage from "@/Components/ActionMessage";
import FormSection from "@/Components/FormSection";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";

export default function UpdateProfileInformationForm({ user }) {
    const props = usePage().props;

    const form = useForm({
        _method: "PUT",
        name: user.name,
        email: user.email,
        photo: null,
    });

    const [verificationLinkSent, setVerificationLinkSent] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const photoInput = useRef(null);

    const updatePhotoPreview = () => {
        const photo = photoInput.current.files[0];

        if (!photo) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };

        reader.readAsDataURL(photo);
    };

    const updateProfileInformation = (e) => {
        e.preventDefault();

        if (photoInput.current) {
            form.data.photo = photoInput.current.files[0];
        }

        form.post(route("user-profile-information.update"), {
            errorBag: "updateProfileInformation",
            preserveScroll: true,
            onSuccess: () => clearPhotoFileInput(),
        });
    };

    const sendEmailVerification = () => {
        Inertia.post(route("verification.send"), {
            preserveScroll: true,
            onSuccess: () => {
                setVerificationLinkSent(true);
            },
        });
    };

    const selectNewPhoto = () => {
        photoInput.current.click();
    };

    const deletePhoto = () => {
        Inertia.delete(route("current-user-photo.destroy"), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);
                clearPhotoFileInput();
            },
        });
    };

    const clearPhotoFileInput = () => {
        if (photoInput.current?.value) {
            photoInput.current.value = null;
        }
    };

    return (
        <>
            <FormSection
                submitted={updateProfileInformation}
                title={"Profile Information"}
                description={
                    "Update your account's profile information and email address."
                }
                actions={
                    <>
                        <ActionMessage
                            on={form.recentlySuccessful}
                            className="mr-3"
                        >
                            Saved.
                        </ActionMessage>
                        <PrimaryButton processing={form.processing}>
                            Save
                        </PrimaryButton>
                    </>
                }
            >
                {/* Profile Photo */}
                {props.jetstream.managesProfilePhotos && (
                    <div className="col-span-6 sm:col-span-4">
                        {/* Profile Photo File Input */}
                        <input
                            ref={photoInput}
                            type="file"
                            className="hidden"
                            onChange={updatePhotoPreview}
                        />
                        <InputLabel htmlFor="photo" value="Photo" />
                        {!photoPreview ? (
                            <div className="mt-2">
                                <img
                                    src={user.profile_photo_url}
                                    alt={user.name}
                                    className="rounded-full h-20 w-20 object-cover"
                                />
                            </div>
                        ) : (
                            <div className="mt-2">
                                <span
                                    className={`block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center`}
                                    style={{
                                        backgroundImage:
                                            `url("` + photoPreview + `")`,
                                    }}
                                />
                            </div>
                        )}

                        <SecondaryButton
                            className="mt-2 mr-2"
                            type="button"
                            onClick={selectNewPhoto}
                        >
                            Select A New Photo
                        </SecondaryButton>
                        {user.profile_photo_path && (
                            <SecondaryButton
                                className="mt-2"
                                type="button"
                                onClick={deletePhoto}
                            >
                                Remove Photo
                            </SecondaryButton>
                        )}
                        <InputError
                            message={form.errors.photo}
                            className="mt-2"
                        />
                    </div>
                )}

                {/* Name */}
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        autoComplete="name"
                        value={form.data.name}
                        handleChange={(e) =>
                            form.setData("name", e.target.value)
                        }
                    />
                    <InputError message={form.errors.name} className="mt-2" />
                </div>

                {/* Email */}
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        autoComplete="email"
                        value={form.data.email}
                        handleChange={(e) =>
                            form.setData("email", e.target.value)
                        }
                    />
                    <InputError message={form.errors.email} className="mt-2" />

                    {props.jetstream.hasEmailVerification &&
                        user.email_verified_at === null && (
                            <div>
                                <p className="text-sm mt-2">
                                    Your email address is unverified.{" "}
                                    <Link
                                        as="button"
                                        className="underline text-indigo-600 hover:text-indigo-900"
                                        onClick={sendEmailVerification}
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </Link>
                                </p>
                                {verificationLinkSent && (
                                    <div className="mt-2 font-medium text-sm text-green-600">
                                        A new verification link has been sent to
                                        your email address.
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </FormSection>
        </>
    );
}
