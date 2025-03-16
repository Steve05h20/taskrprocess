import React, {FC} from 'react';
import {Project} from "@/type";
import {ArrowUpRight, Copy, FolderGit2, Trash} from "lucide-react";
import {useCapitalize} from "@/lib/hook";
import ProgressProjectComponent from "@/app/components/ProgressProjectComponent";
import Link from "next/link";
import {toast} from "react-toastify";


interface ProjectProps {
    project: Project;
    admin: number;
    style:boolean
    onDelete?: (id:string) => void;
}

const ProjectComponent: FC<ProjectProps> = ({project, admin,style,onDelete}) => {

    const handleDelete = ()=>{
        const isConfirmed = window.confirm("Êtes-vous sûr de supprimer ce project ?");
        if(isConfirmed && onDelete){
            onDelete(project.id)}
    }

    const totalTask = project.tasks?.length
    const taskByStauts = project.tasks?.reduce(
        (acc, task) => {
            if (task.status === "To DO") acc.toDo++
            else if (task.status === "In Progress") acc.inprogress++
            else if (task.status === "Done") acc.done++;
            return acc;
        },
        {
            toDo: 0, inprogress: 0, done: 0
        }) ?? {toDo: 0, inprogress: 0, done: 0}

    const progressPercentage = totalTask ? Math.round((taskByStauts.done / totalTask) * 1000) : 0;
    const inProgressPercentage = totalTask ? Math.round((taskByStauts.inprogress / totalTask) * 1000) : 0;
    const toDOPercentage = totalTask ? Math.round((taskByStauts.toDo / totalTask) * 1000) : 0;

    const handleCopyCode = async () => {
        try{
            if(project.inviteCode){
                await navigator.clipboard.writeText(project.inviteCode);
                toast.success("Code d'invitation copié");
            }
        }catch (error){
            toast.error("Erreur lors de la copie du code d\'invitation");
            console.error(error);
            throw new Error()
        }

    }

    return (
        <div key={project.id}
             className={`${style ? "border border-base-300 p-5 shadow-sm " : "p-5"} text-base-content rounded-xl w-full text-left transition-all hover:shadow-xl bg-gray-50/50 hover:bg-white`}>
            <div className={"w-full flex items-center mb-3"}>
                <div className={'bg-primary w-10 h-10 flex items-center justify-center rounded-lg'}>
                    <FolderGit2 className={"w-6 text-xl h-10 "}/>
                </div>
                <div className={'font-semibold p-2 h-10 flex items-center justify-center rounded-lg'}>
                    {useCapitalize(project.name)}
                </div>
            </div>
                {!style && <div className={"text-xs text-gray-500 border border-base-300 p-5 mb-6 rounded-xl"}>{project.description}</div>}

            <div className={"w-full flex items-center mb-3"}>
                <span className={"font-bold"}>Collaborateurs</span>
                <div className={"badge badge-ghost ml-1"}>{project.users?.length}</div>
            </div>
            {admin === 1 && (
                <div
                    className={"flex justify-between items-center rounded-lg p-2 border border-base-300 mb-3 bg-base-200/30"}>
                    <p>{project.inviteCode}</p>
                    <button className={"btn btn-sm ml-2"} onClick={()=>handleCopyCode()}><Copy className={"w-4 ≈"}/></button>
                </div>
            )}

            <ProgressProjectComponent taskByStauts={taskByStauts.toDo} percentage={toDOPercentage} status={"A faire"}/>
            <ProgressProjectComponent taskByStauts={taskByStauts.inprogress} percentage={inProgressPercentage} status={"En cours"}/>
            <ProgressProjectComponent taskByStauts={taskByStauts.done} percentage={progressPercentage} status={"Terminée(s)"}/>

            <div className={"flex justify-between items-center rounded-lg"}>
            {admin === 1 && (
                <button className={"btn btn-sm mr-3 hover:bg-red-500 hover:text-white"} onClick={handleDelete}><Trash className={"w-4"}/></button>
            )}
            {style && <Link className={"btn btn-primary btn-sm"} href={`/projet/${project.id}`}>
            <div className={"mr-2 badge"}>
                {totalTask}
            </div>
                Tâche
                <ArrowUpRight className={"ml-2"}/>
            </Link>}
            </div>





        </div>

    );
};

export default ProjectComponent;