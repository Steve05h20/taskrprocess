"use client"

import React, {ChangeEvent, useEffect, useState} from 'react';
import Wrapper from "@/app/components/Wrapper";
import {Project} from "@/type";
import {getProjectInfo, getProjectUsers} from "@/app/action";
import Link from "next/link";
import AssignTask from "@/app/components/AssignTask";
import {User} from "@prisma/client";


const Page =({params}:{params:Promise<{id:string}>}) => {
    const param= params

    const [projectId, setProjectId] = useState<string>("");
    const [project,setProject] = useState<Project | null>(null);
    const [usersProject, setUsersProject] = useState<User []>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);


    const fecthInfo = async (projectId:string) => {
        try{
            const project = await getProjectInfo(projectId,true)
            setProject(project)

            const associatedUser = await getProjectUsers(projectId);
            setUsersProject(associatedUser as User[])
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

    const handleUserSelect = (user:User) => {
        setSelectedUser(user)
    }


    return <Wrapper>
        <div>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><Link href={`/projet/${projectId}`}>Retour</Link></li>
                    <li>
                        <div className={"badge badge-primary"}>{project?.name}</div>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between">
                <div className={"md:w:1/4 "}>
                    <AssignTask users={usersProject} projectId={projectId} onAssignTask={handleUserSelect}/>
                    <div className={"flex justify-between items-center mt-4"}>
                        <span className={"badge"}>
                            A livré
                        </span>
                        <input placeholder="Date d'écheance" className={"input input-bordered border border-base-300 focus:outline-none"} type="date" onChange={(e)=>setDueDate(new Date(e.currentTarget.value))}/>
                    </div>
                </div>
                <div className="md:w:3/4 ">

                </div>

            </div>
        </div>
    </Wrapper>;
};

export default Page;