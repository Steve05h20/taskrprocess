"use client"
import React, {useEffect} from 'react';
import {FolderGit2, Menu, X} from "lucide-react";
import {UserButton, useUser} from "@clerk/nextjs";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {checkAndAddUser} from "@/app/action";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = React.useState(false);
    const handleMenuOpen = () => {
        setMenuOpen(value => !value);
    };

    const navLinks = [
        {href: "/general-projets", label: "Collaborations"},
        {href: "/", label: "Mes projets"},
    ]

    const pathname = usePathname()
    const isActiveLink = (href: string) => pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

    const renderLinks = (className: string) => {
        return navLinks.map(({href, label}) => <Link key={href} className={`btn-sm ${className} ${isActiveLink(href) ? "btn-primary " : ""}`}
                                                     href={href}>{label}</Link>)
    }

    const {user} = useUser();
    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress;
        const name = user?.fullName;

        if (email && name) {
            checkAndAddUser(email, name)
                .catch(error => console.error("Erreur lors de l'ajout de l\'utilisateur", error));
        }
    }, [user]);

    return (
        <div className={"border-b border-base-300 px-5 md:px-[10px] py-4 relative"}>
            <div className={"flex items-center justify-between"}>
                <div className={"flex items-center "}>
                    <div className={"bg-primary-content text-primary rounded-full p-2"}>
                        <FolderGit2 className={"w-6 h-6"}/>
                    </div>
                    <span className={"ml-3 font-bold text-3xl"}>Task<span className={"text-primary"}>Process</span></span>
                </div>

                <button className={"btn w-fit btn-sm sm:hidden"} onClick={handleMenuOpen}>
                    <Menu className="w-4"/>
                </button>

                <div className={"flex items-center justify-between gap-2 max-sm:hidden"}>
                    {renderLinks("btn")}
                    <UserButton/>
                </div>
            </div>

            <div
                className={`absolute top-0 w-full h-screen flex flex-col gap-2 p-4 ${menuOpen ? "left-0" : "left-full"} transition-all duration-300 sm:hidden bg-white z-50`}>
                <div className={"flex justify-between"}>
                    <UserButton/>
                    <button className={"btn w-fit btn-sm"} onClick={handleMenuOpen}>
                        <X className="w-4"/>
                    </button>
                </div>
                {renderLinks("btn")}
            </div>

        </div>
    );
};

export default Navbar;