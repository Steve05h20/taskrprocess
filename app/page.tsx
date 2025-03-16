"use client"
import Wrapper from "@/app/components/Wrapper";
import {useEffect, useState} from "react";
import {FolderGit2} from "lucide-react";
import {createProject, deleteProjectById, getProjectsCreatedByUser} from "@/app/action";
import {useUser} from "@clerk/nextjs";
import {toast} from "react-toastify";
import {Project} from "@/type";
import ProjectComponent from "@/app/components/ProjectComponent";
import EmptyState from "@/app/components/EmptyState";

export default function Home() {
    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string;
    const [project, setProject] = useState({
        name:"",
        description:"",
    });
    const [projects,setProjects] = useState<Project[]>([]);

    const handleSubmit = async ()=> {
        try {
            const modal = document.getElementById('my_modal_3')as HTMLDialogElement
            await createProject(project.name,project.description,email)
            if(modal){
                modal.close()
            }
            setProject({name:"",description:"",});
            await fetchProjects(email)
            toast.success("Le project créer");
        }catch (error){
            console.log("Erreur lors de la création du projet",error);
        }
    }

    const fetchProjects = async (email: string) => {
        try {
            const myPorject = await getProjectsCreatedByUser(email)
            setProjects(myPorject)

        }catch (error){
            console.log("Erreur lors de la recupération de projet",error);
            throw new Error
        }
    }

    useEffect(() => {
        if (email) {
            fetchProjects(email)
        }
    },[email])

    const deleteProject = async (idProject: string) => {
        try {
        await deleteProjectById(idProject)
            fetchProjects(email)
            toast.success("Le projet supprimé")
        }catch (error){
            throw new Error(`Erreur lors de la suppression du projet: ${idProject} ` +error);
        }
    }


  return (
    <Wrapper>
      <div className={""}>


          <button className="btn btn-primary mb-6" onClick={()=>(document.getElementById('my_modal_3')as HTMLDialogElement).showModal()}>Nouveau Projet<FolderGit2/></button>
          <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                  <form method="dialog">

                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 className="font-bold text-lg">Nouveau Projet !</h3>
                  <p className="py-4">Décriver votre project grace à la description</p>
                  <div>
                      <input required className={"border border-base-300 input input-bordered w-full mb-4"} type="text" name="name" value={project.name} onChange={(e)=>setProject({...project,name:e.target.value})} placeholder="Nom du Projet" />
                      <textarea required name="description" value={project.description} onChange={(e)=>setProject({...project,description:e.target.value})} placeholder="Description du Projet" className={"mb-2 textarea textarea-bordered border border-base-300 w-full textarea-md"}/>
                  </div>
                  <button className={"btn btn-primary"} onClick={()=>handleSubmit()}>Nouveau Projet<FolderGit2/></button>
              </div>
          </dialog>

          <div>
              {projects.length > 0 ? (
                  <ul className={"w-full grid mx-auto sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 all-transition"}>
                      {projects.map(project => <li key={project.id}>
                          <ProjectComponent project={project} admin={1} onDelete={deleteProject} style={true} />
                      </li>)}
                  </ul>
              ) : (
                  <div>
                      <EmptyState imageAlt={"Image d'Une liste de proojet vide"} imageSrc="/empty-project.png" message={"Aucun projet Créer"} />
                  </div>
              )}

          </div>

      </div>
    </Wrapper>
  );
}
