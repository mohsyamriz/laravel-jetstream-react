import ActionMessage from "@/Components/ActionMessage";
import ActionSection from "@/Components/ActionSection";
import ConfirmationModal from "@/Components/ConfirmationModal";
import DangerButton from "@/Components/DangerButton";
import DialogModal from "@/Components/DialogModal";
import FormSection from "@/Components/FormSection";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SectionBorder from "@/Components/SectionBorder";
import TextInput from "@/Components/TextInput";
import { Inertia } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import React, { useState } from "react";

export default function TeamMemberManager({
    team,
    availableRoles,
    userPermissions,
    className = "",
}) {
    const props = usePage().props;

    const addTeamMemberForm = useForm({
        email: "",
        role: null,
    });

    const updateRoleForm = useForm({
        role: null,
    });

    const leaveTeamForm = useForm();
    const removeTeamMemberForm = useForm();

    const [currentlyManagingRole, setCurrentlyManagingRole] = useState(false);
    const [managingRoleFor, setManagingRoleFor] = useState(null);
    const [confirmingLeavingTeam, setConfirmingLeavingTeam] = useState(false);
    const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] = useState(null);

    const addTeamMember = (e) => {
        e.preventDefault();

        addTeamMemberForm.post(route('team-members.store', team), {
            errorBag: 'addTeamMember',
            preserveScroll: true,
            onSuccess: () => addTeamMemberForm.reset(),
        });
    };

    const cancelTeamInvitation = (invitation) => {
        Inertia.delete(route('team-invitations.destroy', invitation), {
            preserveScroll: true,
        });
    };

    const manageRole = (teamMember) => {
        setManagingRoleFor(teamMember);
        updateRoleForm.data.role = teamMember.membership.role;
        setCurrentlyManagingRole(true);
    };

    const updateRole = (e) => {
        e.preventDefault();

        updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
            preserveScroll: true,
            onSuccess: () => setCurrentlyManagingRole(false),
        });
    };

    const confirmLeavingTeam = () => {
        setConfirmingLeavingTeam(true);
    };

    const leaveTeam = (e) => {
        e.preventDefault();

        leaveTeamForm.delete(route('team-members.destroy', [team, usePage().props.user]));
    };

    const confirmTeamMemberRemoval = (teamMember) => {
        setTeamMemberBeingRemoved(teamMember);
    };

    const removeTeamMember = (e) => {
        e.preventDefault();

        removeTeamMemberForm.delete(route('team-members.destroy', [team, teamMemberBeingRemoved]), {
            errorBag: 'removeTeamMember',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setTeamMemberBeingRemoved(null),
        });
    };

    const displayableRole = (role) => {
        return availableRoles.find(r => r.key === role).name;
    };

    function buttonManageTeamMemberRole(user) {
        if (userPermissions.canAddTeamMembers && availableRoles.length) {
            return (
                <button 
                    className="ml-2 text-sm text-gray-400 underline"
                    onClick={() => manageRole(user)}
                >
                    {displayableRole(user.membership.role)}
                </button>
            );
        }
        else if (availableRoles.length) {
            return (
                <div className="ml-2 text-sm text-gray-400">
                    {displayableRole(user.membership.role)}
                </div>
            );
        }
    }

    function buttonLeaveAndRemoveTeam(user) {
        if (props.user.id === user.id) {
            return (
                <button 
                    className="cursor-pointer ml-6 text-sm text-red-500"
                    onClick={confirmLeavingTeam}
                >
                    Leave
                </button>
            );
        }
        else if (userPermissions.canRemoveTeamMembers) {
            return (
                <button
                    className="cursor-pointer ml-6 text-sm text-red-500"
                    onClick={() => confirmTeamMemberRemoval(user)}
                >
                    Remove
                </button>
            )
        }
    }

    return (
        <>
            <div className={className}>
                {userPermissions.canAddTeamMembers && (
                    <div>
                        <SectionBorder />

                        {/* Add Team Member */}
                        <FormSection 
                            title="Add Team Member"
                            description="Add a new team member to your team, allowing them to collaborate with you."
                            actions={
                                <>
                                    <ActionMessage on={addTeamMemberForm.recentlySuccessful} className="mr-3">
                                        Added.
                                    </ActionMessage>
                                    <PrimaryButton processing={addTeamMemberForm.processing}>
                                        Add
                                    </PrimaryButton>
                                </>
                            }
                            submitted={addTeamMember}
                        >
                            <div className="col-span-6">
                                <div className="max-w-xl text-sm text-gray-600">
                                    Please provide the email address of the person you would like to add to this team.
                                </div>
                            </div>

                            {/* Member Email */}
                            <div className="col-span-6 sm:col-span-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    value={addTeamMemberForm.data.email}
                                    type="email"
                                    className="mt-1 block w-full"
                                    handleChange={(e) => addTeamMemberForm.setData("email", e.target.value)}
                                />
                                <InputError message={addTeamMemberForm.errors.email} className="mt-2" />
                            </div>

                            {/* Role */}
                            {availableRoles.length > 0 && (
                                <div className="col-span-6 lg:col-span-4">
                                    <InputLabel htmlFor="roles" value="Role" />
                                    <InputError message={addTeamMemberForm.errors.role} className="mt-2" />

                                    <div className="relative z-0 mt-1 border border-gray-200 rounded-lg cursor-pointer">
                                        {availableRoles.map((role, i) => (
                                            <button
                                                key={role.key}
                                                type="button"
                                                className={`relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 
                                                    ${i > 0 && "border-t border-gray-200 rounded-t-none"} ${i != Object.keys(availableRoles).length - 1 && "rounded-b-none"}`}
                                                onClick={() => addTeamMemberForm.setData("role", role.key)}
                                            >
                                                    <div className={`${addTeamMemberForm.data.role && addTeamMemberForm.data.role != role.key && "opacity-50"}`}>
                                                        {/* Role Name */}
                                                        <div className="flex items-center">
                                                            <div className={`text-sm text-gray-600 ${addTeamMemberForm.data.role == role.key && "font-semibold"}`}>
                                                                {role.name}
                                                            </div>
                                                            {addTeamMemberForm.data.role == role.key && (
                                                                <svg
                                                                    className="ml-2 h-5 w-5 text-green-400"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {/* Role Description */}
                                                        <div className="mt-2 text-xs text-gray-600 text-left">
                                                            {role.description}
                                                        </div>
                                                    </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </FormSection>
                    </div>
                )}

                {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers && (
                    <div>
                        <SectionBorder />

                        {/* Team Member Invitations */}
                        <ActionSection 
                            title="Pending Team Invitations"
                            description="These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation."
                        >
                            <div className="space-y-6">
                                {team.team_invitations.map((invitation) => (
                                    <div key={invitation.id} className="flex items-center justify-between">
                                        <div className="text-gray-600">
                                            {invitation.email}
                                        </div>
                                        <div className="flex items-center">
                                            {userPermissions.canRemoveTeamMembers && (
                                                <button
                                                    className="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none"
                                                    onClick={() => cancelTeamInvitation(invitation)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ActionSection>
                    </div>
                )}

                {team.users.length > 0 && (
                    <div>
                        <SectionBorder />

                        {/* Manage Team Members */}
                        <ActionSection
                            title="Team Members"
                            description="All of the people that are part of this team."
                        >
                            <div className="space-y-6">
                                {team.users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img className="w-8 h-8 rounded-full" src={user.profile_photo_url} alt={user.name} />
                                            <div className="ml-4">
                                                {user.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {/* Manage Team Member Role */}
                                            {buttonManageTeamMemberRole(user)}

                                            {/* Leave Team */}
                                            {buttonLeaveAndRemoveTeam(user)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ActionSection>
                    </div>
                )}

                {/* Role Management Modal */}
                <DialogModal 
                    title="Manage Role"
                    show={currentlyManagingRole} 
                    onClose={() => setCurrentlyManagingRole(false)}
                    footer={
                        <>
                            <SecondaryButton onClick={() => setCurrentlyManagingRole(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                className="ml-3"
                                processing={updateRoleForm.processing}
                                onClick={updateRole}
                            >
                                Save
                            </PrimaryButton>
                        </>
                    }
                >
                    {managingRoleFor && (
                        <div>
                            <div className="relative z-0 mt-1 border border-gray-200 rounded-lg cursor-pointer">
                                {availableRoles.map((role, i) => (
                                    <button 
                                        key={role.key} 
                                        type="button"
                                        className={
                                            `relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 
                                            ${i > 0 && "border-t border-gray-200 rounded-t-none"} 
                                            ${i !== Object.keys(availableRoles).length - 1 && "rounded-b-none"}`
                                        }
                                        onClick={() => updateRoleForm.setData("role", role.key)}
                                    >
                                        <div className={`${updateRoleForm.data.role && updateRoleForm.data.role !== role.key && "opacity-50"}`}>
                                            {/* Role Name */}
                                            <div className="flex items-center">
                                                <div className={`text-sm text-gray-600 ${updateRoleForm.data.role === role.key && "font-semibold"}`}>
                                                    {role.name}
                                                </div>
                                                {updateRoleForm.data.role === role.key && (
                                                    <svg
                                                        className="ml-2 h-5 w-5 text-green-400"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            {/* Role Description */}
                                            <div className="mt-2 text-xs text-gray-600">
                                                {role.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogModal>

                {/* Leave Team Confirmation Modal */}
                <ConfirmationModal 
                    show={confirmingLeavingTeam} 
                    onClose={() => setConfirmingLeavingTeam(false)}
                    title="Leave Team"
                    content="Are you sure you would like to leave this team?"
                    footer={
                        <>
                            <SecondaryButton onClick={() => setConfirmingLeavingTeam(false)}>
                                Cancel
                            </SecondaryButton>
                            <DangerButton
                                className="ml-3"
                                processing={leaveTeamForm.processing}
                                onClick={leaveTeam}
                            >
                                Leave
                            </DangerButton>
                        </>
                    }
                />

                {/* Remove Team Member Confirmation Modal */}
                <ConfirmationModal
                    show={teamMemberBeingRemoved != null}
                    onClose={() => setTeamMemberBeingRemoved(null)}
                    title="Remove Team Member"
                    content="Are you sure you would like to remove this person from the team?"
                    footer={
                        <>
                            <SecondaryButton onClick={() => setTeamMemberBeingRemoved(null)}>
                                Cancel
                            </SecondaryButton>
                            <DangerButton
                                className="ml-3"
                                processing={removeTeamMemberForm.processing}
                                onClick={removeTeamMember}
                            >
                                Remove
                            </DangerButton>
                        </>
                    }
                />
            </div>
        </>
    );
}
