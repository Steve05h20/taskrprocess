"use server"

import prisma from "@/lib/prisma";
import {randomBytes} from "node:crypto";

function generateUniqueCode(): string {
    return randomBytes(6).toString("hex")
}

export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({where: {email: email}})
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email,
                    name,
                }
            })
            console.error("Erreur lors de la création de l'utilisateur:")
        } else {
            console.error("Utilisateur déja présent dans la base de donnée")
        }
    } catch (error) {
        console.error("Erreurs lors de la vérification de l'utilisateur", error)
        throw error
    }
}

export async function createProject(name: string, description: string, email: string) {
    try {
        const inviteCode = generateUniqueCode()
        const user = await prisma.user.findUnique({where: {email}})
        if (!user) {
            throw new Error("User not found")
        }

        return await prisma.project.create({
            data: {
                name, description, inviteCode, createdById: user.id
            }
        })
    } catch (error) {
        console.error(error)
        throw new Error
    }
}

export async function getProjectsCreatedByUser(email: string) {
    try {
        const projects = await prisma.project.findMany({
                where: {
                    createdBy: {email}
                },
                include: {
                    tasks: {
                        include: {
                            user: true,
                            createdBy: true
                        }
                    },
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true, name: true, email: true
                                }
                            }
                        }
                    }
                }
            }
        )

        const formatedProject = projects.map(project => ({
            ...project,
            users: project.users.map(userEntry => userEntry.user)
        }))
        return formatedProject
    } catch
        (error) {
        console.error("Erreur lors de la récuperation des projets créer par l'utilisateur:", error)
        throw new Error
    }
}

export async function deleteProjectById(projectId: string) {
    try {
        await prisma.project.delete({where: {id: projectId}})
        console.log(`Project avec l'ID ${projectId} supprimé avec succès`)
    } catch (error) {
        console.error("Erreur server lors de la suppresion du projet", error)
        throw new Error
    }
}

export async function addUserTOProject(email: string, inviteCode: string) {
    try {
        const projet = await prisma.project.findUnique({
            where: {
                inviteCode
            }
        })
        if (!projet) {
            throw new Error("Projet non trouvé")
        }

        const user = await prisma.user.findUnique({where: {email: email}})
        if (!user) {
            throw new Error("Utilisateur non trouvé")
        }

        const existingAssocition = await prisma.projectUser.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: projet.id
                }
            }
        })
        if (existingAssocition) {
            throw new Error("Utilisateur non trouvé")
        }

        await prisma.projectUser.create({data: {userId: user.id, projectId: projet.id}})

        return "Utilisateur ajouté avec succès"

    } catch (error) {
        console.error("Erreur lors de l\'ajout à la collabolation", error);
        throw new Error
    }
}

export async function getProjectAssociatewithUser(email: string) {
    try {
        const projects = await prisma.project.findMany({
            where: {users: {some: {user: {email}}}},
            include: {tasks: true, users: {select:{user:{select: {id: true, name: true, email: true}}}}}
        })
        const formatedProject = projects.map(project => ({
            ...project,
            users: project.users.map(userEntry => userEntry.user)
        }))
        return formatedProject
    } catch (error) {
        console.error("Erreur lors de la récupération:", error)
        throw new Error
    }
}

export async function getProjectInfo(idProject:string,details:boolean){
    try {
        const project = await prisma.project.findUnique(
            {where: {
                id:idProject
                },
                include: details ? {
                    tasks:{
                        include: {
                            user: true,
                            createdBy: true,
                        }
                    },
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true, name: true, email: true
                                }
                            }
                        }
                    },
                    createdBy:true
                    }:undefined
            })
        if (!project) {
            throw new Error("Project non trouvé")
        }
        return project
    }catch(error){
        console.error("Erreur lors de la récupération du project",error)
        throw new Error
    }
}


export const getProjectUsers=async (idProject: string) =>{
    try {
    const projectwithUsers = await prisma.project.findUnique({where:{id:idProject},include:{users:{include:{user:true}}}})
        return projectwithUsers?.users.map(projectUser => projectUser.user)
    }catch (error) {
        console.error(error)
        throw new Error
    }

}