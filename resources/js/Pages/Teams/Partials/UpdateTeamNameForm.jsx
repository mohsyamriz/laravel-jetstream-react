import ActionMessage from "@/Components/ActionMessage";
import FormSection from "@/Components/FormSection";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/inertia-react";
import React from "react";

export default function UpdateTeamNameForm({ team, permissions }) {
    const form = useForm({
        name: team.name,
    });

    const updateTeamName = (e) => {
        e.preventDefault();

        form.put(route("teams.update", team), {
            errorBag: "updateTeamName",
            preserveScroll: true,
        });
    };

    return (
        <>
            <FormSection
                title="Team Name"
                description="The team's name and owner information."
                actions={
                    permissions.canUpdateTeam && (
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
                    )
                }
                submitted={updateTeamName}
            >
                {/* Team Owner Information */}
                <div className="col-span-6">
                    <InputLabel value="Team Owner" />
                    <div className="flex items-center mt-2">
                        <img className="w-12 h-12 rounded-full object-cover" src={team.owner.profile_photo_url} alt={team.owner.name} />

                        <div className="ml-4 leading-tight">
                            <div>{team.owner.name}</div>
                            <div className="text-gray-700 text-sm">
                                {team.owner.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Name */}
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="name" value="Team Name" />
                    <TextInput
                        id="name"
                        value={form.data.name}
                        className="mt-1 block w-full"
                        disabled={!permissions.canUpdateTeam}
                        handleChange={(e) => form.setData("name", e.target.value)}
                    />
                    <InputError message={form.errors.name} className="mt-2" />
                </div>
            </FormSection>
        </>
    );
}
