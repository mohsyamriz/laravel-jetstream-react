import FormSection from "@/Components/FormSection";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/inertia-react";
import React from "react";

export default function CreateTeamForm() {
    const props = usePage().props;

    const form = useForm({
        name: "",
    });

    const createTeam = (e) => {
        e.preventDefault();
        
        form.post(route("teams.store"), {
            errorBag: "createTeam",
            preserveScroll: true,
        });
    };

    return (
        <>
            <FormSection 
                submitted={createTeam}
                title="Team Details"
                description="Create a new team to collaborate with others on projects."
                actions={
                    <>
                        <PrimaryButton processing={form.processing}>
                            Create
                        </PrimaryButton>
                    </>
                }
            >
                <div className="col-span-6">
                    <InputLabel value="Team Owner" />
                    <div className="flex items-center mt-2">
                        <img className="object-cover w-12 h-12 rounded-full" src={props.user.profile_photo_url} alt={props.user.name} />
                        <div className="ml-4 leading-tight">
                            <div>{props.user.name}</div>
                            <div className="text-sm text-gray-700">
                                {props.user.email}
                            </div>
                        </div>
                    </div>
                </div>   
                <div className="col-span-6 sm:col-span-4">
                    <InputLabel htmlFor="name" value="Team Name" />
                    <TextInput
                        id="name"
                        value={form.data.name}
                        className="mt-1 block w-full"
                        isFocused
                        handleChange={(e) => form.setData("name", e.target.value)}
                    />
                    <InputError message={form.errors.name} className="mt-2" />
                </div>         
            </FormSection>
        </>
    );
}
