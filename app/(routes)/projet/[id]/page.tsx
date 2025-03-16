"use client"
import React, {useEffect, useState} from 'react';
import Wrapper from "@/app/components/Wrapper";
import {useUser} from "@clerk/nextjs";
import {Project} from "@/type";
import {getProjectInfo} from "@/app/action";
import UserInfo from "@/app/components/UserInfo";
import ProjectComponent from "@/app/components/ProjectComponent";
import Link from "next/link";
import {Plus} from "lucide-react";

const Page = ({params}:{params:Promise<{id:string}>}) => {

    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string

    const [projectId, setProjectId] = useState<string>("");
    const [project,setProject] = useState<Project | null>(null);

    const fecthInfo = async (projectId:string) => {
        try{
            const project = await getProjectInfo(projectId,true)
            setProject(project)
        }catch (errror){
            console.log("Erreur lors du chargement du projet,",errror)
        }
    }

    useEffect(() => {
        const getId = async ()=>{
            const resolverdParams = await params;
            setProjectId(resolverdParams.id)
             fecthInfo(resolverdParams.id);
        }

        getId()
    },[params])

    return (
        <Wrapper>
            <div className={"md:flex md:flex-row flex-col"}>
                <div className={"md:w-1/4"}>
                    <div className={"p-5 border border-base-300 rounded-xl "}>
                        <UserInfo role={'Crée par'} email={project?.createdBy?.email || null}
                                  name={project?.createdBy?.name || null}/>
                    </div>

                    <div className={"w-full"}>
                    {project &&(<ProjectComponent project={project} admin={0} style={false}/>)}
                    </div>
                </div>
                <div className={"mt-6 md:ml-6 md:mt-0 md:w-3/4"}>
                    <div className={"md:flex md:justify-between"}>
                        <Link className={"btn-sm btn mt-2 md:mt-0"} href={`/new-task/${projectId}`}>Ajouter une tâche <Plus/></Link>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default Page;