import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import ActionMessage from "@/Components/ActionMessage";
import Checkbox from "@/Components/Checkbox";
import FormSection from "@/Components/FormSection";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Capitalize } from "@/helpers";
import SectionBorder from "@/Components/SectionBorder";
import ActionSection from "@/Components/ActionSection";
import DialogModal from "@/Components/DialogModal";
import SecondaryButton from "@/Components/SecondaryButton";
import ConfirmationModal from "@/Components/ConfirmationModal";
import DangerButton from "@/Components/DangerButton";

export default function ApiTokenManager({
    tokens,
    availablePermissions,
    defaultPermissions,
}) {
    const props = usePage().props;

    const createApiTokenForm = useForm({
        name: "",
        permissions: defaultPermissions,
    });

    const updateApiTokenForm = useForm({
        permissions: [],
    });

    const deleteApiTokenForm = useForm();

    const [displayingToken, setDisplayingToken] = useState(false);
    const [managingPermissionsFor, setManagingPermissionsFor] = useState(null);
    const [apiTokenBeingDeleted, setApiTokenBeingDeleted] = useState(null);

    const createApiToken = (e) => {
        e.preventDefault();

        createApiTokenForm.post(route('api-tokens.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setDisplayingToken(true);
                createApiTokenForm.reset();
            },
        });
    };

    const manageApiTokenPermissions = (e, token) => {
        updateApiTokenForm.data.permissions = token.abilities;
        setManagingPermissionsFor(token);
    };

    const updateApiToken = () => {
        updateApiTokenForm.put(route('api-tokens.update', managingPermissionsFor), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => (setManagingPermissionsFor(null)),
        });
    };

    const confirmApiTokenDeletion = (e, token) => {
        setApiTokenBeingDeleted(token);
    };

    const deleteApiToken = () => {
        deleteApiTokenForm.delete(route('api-tokens.destroy', apiTokenBeingDeleted), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => (setApiTokenBeingDeleted(null)),
        });
    };

    const handleCheckboxCreate = (e) => {
        const valueCopy = createApiTokenForm.data.permissions;
        if (e.target.checked) {
            valueCopy.push(e.target.value);
        } else {
            const index = valueCopy.indexOf(e.target.value);
            valueCopy.splice(index, 1);
        }
    };

    const handleCheckboxUpdate = (e) => {
        const valueCopy = updateApiTokenForm.data.permissions;
        if (e.target.checked) {
            valueCopy.push(e.target.value);
        } else {
            const index = valueCopy.indexOf(e.target.value);
            valueCopy.splice(index, 1);
        }
    };

    return (
        <>
            <div>
                {/* Generate API Token */}
                <FormSection 
                    submitted={createApiToken} 
                    title="Create API Token" 
                    description="API tokens allow third-party services to authenticate with our application on your behalf."
                    actions={
                        <>
                            <ActionMessage on={createApiTokenForm.recentlySuccessful} className="mr-3">
                                Created.
                            </ActionMessage>
                            <PrimaryButton processing={createApiTokenForm.processing}>
                                Create
                            </PrimaryButton>
                        </>
                    }
                >
                    {/* Token Name */}
                    <div className="col-span-6 sm:col-span-4">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={createApiTokenForm.data.name}
                            handleChange={(e) => createApiTokenForm.setData("name", e.target.value)}
                            isFocused
                        />
                        <InputError message={createApiTokenForm.errors.name} className="mt-2" />
                    </div>

                    {/* Token Permissions */}
                    {availablePermissions.length > 0 && (
                        <div className="col-span-6">
                            <InputLabel htmlFor="permissions" value="Permissions" />
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availablePermissions.map((permission) => (
                                    <div key={permission}>
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="permission" 
                                                value={permission}
                                                handleChange={handleCheckboxCreate}
                                                checked={createApiTokenForm.data.permissions.includes(
                                                    permission
                                                )}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                                {Capitalize(permission)}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </FormSection>

                {tokens.length > 0 && (
                    <div>
                        <SectionBorder />

                        {/* Manage API Tokens */}
                        <div className="mt-10 sm:mt-0">
                            <ActionSection
                                title="Manage API Tokens"
                                description="You may delete any of your existing tokens if they are no longer needed."
                            >
                                <div className="space-y-6">
                                    {tokens.map((token) => (
                                        <div key={token} className="flex items-center justify-between">
                                            <div>
                                                {token.name}
                                            </div>
                                            <div className="flex items-center">
                                                {token.last_used_ago && (
                                                    <div className="text-sm text-gray-400">
                                                        Last used {token.last_used_ago}
                                                    </div>
                                                )}
                                                {availablePermissions.length > 0 && (
                                                    <button 
                                                        className="cursor-pointer ml-6 text-sm text-gray-400 underline"
                                                        onClick={(e) => manageApiTokenPermissions(e, token)}
                                                    >
                                                        Permissions
                                                    </button>
                                                )}
                                                <button
                                                    className="cursor-pointer ml-6 text-sm text-red-500"
                                                    onClick={(e) => confirmApiTokenDeletion(e, token)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ActionSection>
                        </div>
                    </div>
                )}

                {/* Token Value Modal */}
                <DialogModal 
                    show={displayingToken} 
                    onClose={() => setDisplayingToken(false)}
                    title="API Token"
                    footer={
                        <>
                            <SecondaryButton onClick={() => setDisplayingToken(false)}>
                                Close
                            </SecondaryButton>
                        </>
                    }
                >
                    <div>
                        Please copy your new API token. For your security, it won't be shown again.
                    </div>
                    {props.jetstream.flash.token && (
                        <div className="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500">
                            {props.jetstream.flash.token}
                        </div>
                    )}
                </DialogModal>

                {/* API Token Permissions Modal */}
                <DialogModal 
                    show={managingPermissionsFor != null}
                    onClose={() => setManagingPermissionsFor(null)}
                    title="API Token Permissions"
                    footer={
                        <>
                            <SecondaryButton onClick={() => setManagingPermissionsFor(null)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                className="ml-3"
                                processing={updateApiTokenForm.processing}
                                onClick={updateApiToken}
                            >
                                Save
                            </PrimaryButton>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availablePermissions.map((permission) => (
                            <div key={permission}>
                                <label className="flex items-center">
                                    <Checkbox
                                        name="permission" 
                                        value={permission}
                                        handleChange={handleCheckboxUpdate}
                                        checked={updateApiTokenForm.data.permissions.includes(
                                            permission
                                        )}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        {Capitalize(permission)}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </DialogModal>

                {/* Delete Token Confirmation Modal */}
                <ConfirmationModal 
                    show={apiTokenBeingDeleted != null} 
                    onClose={() => setApiTokenBeingDeleted(null)}
                    title="Delete API Token"
                    content="Are you sure you would like to delete this API token?"
                    footer={
                        <>
                            <SecondaryButton onClick={() => setApiTokenBeingDeleted(null)}>
                                Cancel
                            </SecondaryButton>
                            <DangerButton
                                className="ml-3"
                                processing={deleteApiTokenForm.processing}
                                onClick={deleteApiToken}
                            >
                                Delete
                            </DangerButton>
                        </>
                    }
                />
            </div>
        </>
    );
}
