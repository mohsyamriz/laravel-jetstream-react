import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import ApplicationMark from "@/Components/ApplicationMark";
import Banner from "@/Components/Banner";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";

export default function AppLayout({ title, header, children }) {
    const props = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const switchToTeam = (e, team) => {
        e.preventDefault();

        Inertia.put(route("current-team.update"), {
                team_id: team.id,
            }, {
                preserveState: false,
            }
        );
    };

    return (
        <>
            <div>
                <Head title={title} />

                <Banner />

                <div className="min-h-screen bg-gray-100">
                    <nav className="bg-white border-b border-gray-100">
                        {/* Primary Navigation Menu */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    {/* Logo */}
                                    <div className="shrink-0 flex items-center">
                                        <Link href={route('dashboard')}>
                                            <ApplicationMark className="block h-9 w-auto" />
                                        </Link>
                                    </div>
                                    {/* Navigation Links */}
                                    <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                            Dashboard
                                        </NavLink>
                                    </div>
                                </div>

                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    <div className="ml-3 relative">
                                        {/* Teams Dropdown */}
                                        {props.jetstream.hasTeamFeatures && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50 transition"
                                                        >
                                                            {props.user.current_team.name}
                                                            <svg
                                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path 
                                                                    fillRule="evenodd" 
                                                                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                                                                    clipRule="evenodd" 
                                                                />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align="right" width="60">
                                                    <div className="w-60">
                                                        {/* Team Management */}
                                                        {props.jetstream.hasTeamFeatures && (
                                                            <>
                                                                <div className="block px-4 py-2 text-xs text-gray-400">
                                                                    Manage Team
                                                                </div>

                                                                {/* Team Settings */}
                                                                <Dropdown.Link href={route('teams.show', props.user.current_team)}>
                                                                    Team Settings
                                                                </Dropdown.Link>

                                                                {props.jetstream.canCreateTeams && (
                                                                    <Dropdown.Link href={route('teams.create')}>
                                                                        Create New Team
                                                                    </Dropdown.Link>
                                                                )}
                                                                <div className="border-t border-gray-100" />

                                                                {/* Team Switcher */}
                                                                <div className="block px-4 py-2 text-xs text-gray-400">
                                                                    Switch Teams
                                                                </div>

                                                                {props.user.all_teams.map((team) => (
                                                                    <form onClick={(e) => switchToTeam(e, team)} key={team.id}>
                                                                        <Dropdown.Link as="button">
                                                                            <div className="flex items-center">
                                                                                {team.id == props.user.current_team_id && (
                                                                                    <svg
                                                                                        className="mr-2 h-5 w-5 text-green-400"
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
                                                                                <div>{team.name}</div>
                                                                            </div>
                                                                        </Dropdown.Link>
                                                                    </form>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        )}
                                    </div>

                                    {/* Settings Dropdown */}
                                    <div className="ml-3 relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                {props.jetstream.managesProfilePhotos ? (
                                                    <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                                                        <img src={props.user.profile_photo_url} alt={props.user.name} className="h-8 w-8 rounded-full object-cover" />
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex rounded-md">
                                                        <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition">
                                                            {props.user.name}

                                                            <svg
                                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                )}
                                            </Dropdown.Trigger>
                                            <Dropdown.Content align="right" width="48">
                                                <>
                                                    {/* Account Management */}
                                                    <div className="block px-4 py-2 text-xs text-gray-400">
                                                        Manage Account
                                                    </div>
                                                    <Dropdown.Link href={route('profile.show')}>
                                                        Profile
                                                    </Dropdown.Link>
                                                    {props.jetstream.hasApiFeatures && (
                                                        <Dropdown.Link href={route('api-tokens.index')}>
                                                            API Tokens
                                                        </Dropdown.Link>
                                                    )}

                                                    <div className="border-t border-gray-200 my-1" />

                                                    {/* Authentication */}
                                                    <Dropdown.Link as="button" method="post" href={route('logout')} className="text-red-500">
                                                        Log Out
                                                    </Dropdown.Link>
                                                </>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Hamburger */}
                                <div className="-mr-2 flex items-center sm:hidden">
                                    <button 
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition"
                                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                className={`${showingNavigationDropdown ? "hidden" : "inline-flex"}`}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={`${!showingNavigationDropdown ? "hidden" : "inline-flex"}`}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"    
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Responsive Navigation Menu */}
                        <div className={`${showingNavigationDropdown ? "block" : "hidden"} sm:hidden`}>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </ResponsiveNavLink>
                            </div>

                            {/* Responsive Settings Options */}
                            <div className="pt-4 pb-1 border-t border-gray-200">
                                <div className="flex items-center px-4">
                                    {props.jetstream.managesProfilePhotos && (
                                        <div className="shrink-0 mr-3">
                                            <img src={props.user.profile_photo_url} alt={props.user.name} className="h-10 w-10 rounded-full object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium text-base text-gray-800">
                                            {props.user.name}
                                        </div>
                                        <div className="font-medium text-sm text-gray-500">
                                            {props.user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.show')} active={route().current('profile.show')}>
                                        Profile
                                    </ResponsiveNavLink>
                                    {props.jetstream.hasApiFeatures && (
                                        <ResponsiveNavLink href={route('api-tokens.index')} active={route().current('api-tokens.index')}>
                                            API Tokens
                                        </ResponsiveNavLink>
                                    )}

                                    {/* Authentication */}
                                    <ResponsiveNavLink as="button" method="post" href={route('logout')} className="text-red-500 hover:text-red-700">
                                        Log Out
                                    </ResponsiveNavLink>

                                    {/* Team Management */}
                                    {props.jetstream.hasTeamFeatures && (
                                        <>
                                            <div className="border-t border-gray-200" />

                                            <div className="block px-4 py-2 text-xs text-gray-400">
                                                Manage Team
                                            </div>

                                            {/* Team Settings */}
                                            <ResponsiveNavLink 
                                                href={route("teams.show", props.user.current_team)} 
                                                active={route().current("teams.show")}>
                                                Team Settings
                                            </ResponsiveNavLink>

                                            {props.jetstream.canCreateTeams && (
                                                <ResponsiveNavLink
                                                    href={route("teams.create")}
                                                    active={route().current("teams.create")}
                                                >
                                                    Create New Team
                                                </ResponsiveNavLink>
                                            )}

                                            <div className="border-t border-gray-200" />

                                            {/* Team Switcher */}
                                            <div className="block px-4 py-2 text-xs text-gray-400">
                                                Switch Team
                                            </div>

                                            {props.user.all_teams.map((team) => (
                                                <form onClick={(e) => switchToTeam(e, team)} key={team.id}>
                                                    <ResponsiveNavLink as="button">
                                                        <div className="flex items-center">
                                                            {team.id == props.user.current_team_id && (
                                                                <svg
                                                                    className="mr-2 h-5 w-5 text-green-400"
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
                                                            <div>{team.name}</div>
                                                        </div>
                                                    </ResponsiveNavLink>
                                                </form>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Page Heading */}
                    {header && (
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    {/* Page Content */}
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
