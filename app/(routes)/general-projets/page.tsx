"use client"
import {useEffect, useState} from 'react';
import Wrapper from "@/app/components/Wrapper";
import {SquarePlus} from "lucide-react";
import {toast} from "react-toastify";
import {addUserTOProject, getProjectAssociatewithUser} from "@/app/action";
import {useUser} from "@clerk/nextjs";
import {Project} from "@/type";
import ProjectComponent from "@/app/components/ProjectComponent";
import EmptyState from "@/app/components/EmptyState";


const Page = () => {
    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string
    const [inviteCode, setInviteCode] = useState<string>("");
    const [associatedProjects, setAssociatedProjects] = useState<Project[]>([]);

    const handleSubmit = async () => {
        try {
            if(inviteCode === ""){
                toast.error("Il manque le code du projet");
            }else{
                await addUserTOProject(email, inviteCode);
                toast.success("Vous pouvez maintenant collaborer sur ce projet")
                await fetchProjects(email)
            }
        }catch {
            toast.error("Code invalide ou vous appartenez déja au projet");
        }finally {
            setInviteCode("");
        }
    }

    const fetchProjects = async (email: string) => {
        try {
            const associated = await getProjectAssociatewithUser(email)
            setAssociatedProjects(associated)
        }catch {
            toast.error("Erreur lors de la recupération de projet");
        }
    }

    useEffect(() => {
        if (email) {
            fetchProjects(email)
        }
    },[email])

    return (
        <Wrapper>
            <div className={"flex"}>
                <div className={"mb-4"}>
                    <input value={inviteCode}
                           type={"text"}
                           onChange={(e) => setInviteCode(e.target.value)}
                           placeholder={"Code d'invitation"}
                           className={"w-full p-2 input input-bordered"}/>
                </div>
                <button onClick={handleSubmit} className={"btn btn-primary ml-4"}>Rejoindre<SquarePlus
                    className={"w-4"}/></button>
            </div>

            <div>
                {associatedProjects.length > 0 ? (
                    <ul className={"w-full grid mx-auto sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 all-transition"}>
                        {associatedProjects.map(project => <li key={project.id}>
                            <ProjectComponent project={project} admin={0} style={true}/>
                        </li>)}
                    </ul>
                ) : (
                    <div>
                        <EmptyState imageAlt={"Image d'Une liste de proojet vide"} imageSrc="/empty-project.png"
                                    message={"Aucun projet Associé"}/>
                    </div>
                )}

            </div>
        </Wrapper>
    );
};

export default Page;