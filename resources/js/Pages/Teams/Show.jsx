import SectionBorder from "@/Components/SectionBorder";
import AppLayout from "@/Layouts/AppLayout";
import React from "react";
import DeleteTeamForm from "./Partials/DeleteTeamForm";
import TeamMemberManager from "./Partials/TeamMemberManager";
import UpdateTeamNameForm from "./Partials/UpdateTeamNameForm";

export default function Show({ team, availableRoles, permissions }) {
    return (
        <>
            <AppLayout
                title="Team Settings"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Team Settings
                    </h2>
                }
            >
                <div>
                    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                        <UpdateTeamNameForm team={team} permissions={permissions} />

                        <TeamMemberManager
                            className="mt-10 sm:mt-0"
                            team={team}
                            availableRoles={availableRoles}
                            userPermissions={permissions}
                        />

                        {permissions.canDeleteTeam && !team.personal_team && (
                            <>
                                <SectionBorder />

                                <DeleteTeamForm className="mt-10 sm:mt-0" team={team} />
                            </>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
