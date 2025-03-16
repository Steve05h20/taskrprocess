import React, {FC, useState} from 'react';
import {User} from "@prisma/client";
import UserInfo from "@/app/components/UserInfo";

interface AssignTaskProps {
    users: User[],
    projectId: string
    onAssignTask: (user: User) => void
}

const AssignTask :FC<AssignTaskProps> = ({users, projectId,onAssignTask}) => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const handleAssign = (user:User) => {
        setSelectedUser(user);
        onAssignTask(user);
        const modal = document.getElementById('my_modal_3')as HTMLDialogElement
        if(modal){
        modal.close()
        }

    };

    return (
        <div className={"w-full"}>
            <div className="cursor-pointer border border-base-300 p-5 rounded-xl w-full" onClick={()=>(document.getElementById('my_modal_3')as HTMLDialogElement).showModal()}>
            <UserInfo role={"Assigné à"} email={selectedUser?.email || "Personne"} name={selectedUser?.name ||""}/>
            </div>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Choisissez un collaborateur</h3>
                    <div>
                        {users?.map((user:User) => <div className={"cursor-pointer border my-1 border-base-200 p-5 rounded-xl w-full"} onClick={()=>handleAssign(user)} key={user.id}><UserInfo role={"Assigné à"} email={user.email} name={user.name}/></div>)}
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignTask;