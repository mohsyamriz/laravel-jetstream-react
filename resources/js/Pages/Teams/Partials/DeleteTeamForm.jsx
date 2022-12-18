import ActionSection from "@/Components/ActionSection";
import ConfirmationModal from "@/Components/ConfirmationModal";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm, usePage } from "@inertiajs/inertia-react";
import React, { useState } from "react";

export default function DeleteTeamForm({ team, className }) {
    const [confirmingTeamDeletion, setConfirmingTeamDeletion] = useState(false);
    const form = useForm();

    const confirmTeamDeletion = () => {
        setConfirmingTeamDeletion(true);
    };

    const deleteTeam = (e) => {
        e.preventDefault();

        form.delete(route("teams.destroy", team), {
            errorBag: "deleteTeam",
        });
    };

    return (
        <>
            <ActionSection
                title="Delete Team"
                description="Permanently delete this team."
                className={className}
            >
                <div className="max-w-xl text-sm text-gray-600">
                    Once a team is deleted, all of its resources and data will
                    be permanently deleted. Before deleting this team, please
                    download any data or information regarding this team that
                    you wish to retain.
                </div>

                <div className="mt-5">
                    <DangerButton onClick={confirmTeamDeletion}>
                        Delete Team
                    </DangerButton>
                </div>

                {/* Delete Team Confirmation Modal */}
                <ConfirmationModal
                    show={confirmingTeamDeletion}
                    onClose={() => setConfirmingTeamDeletion(false)}
                    title="Delete Team"
                    content="Are you sure you want to delete this team? Once a team is deleted, all of its resources and data will be permanently deleted."
                    footer={
                        <>
                            <SecondaryButton onClick={() => setConfirmingTeamDeletion(false)}>
                                Cancel
                            </SecondaryButton>
                            <DangerButton
                                className="ml-3"
                                processing={form.processing}
                                onClick={deleteTeam}
                            >
                                Delete Team
                            </DangerButton>
                        </>
                    }
                />
            </ActionSection>
        </>
    );
}
