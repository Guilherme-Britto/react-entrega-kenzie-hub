import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../services/Api"
import { UserContext } from "./UserContext"
import { toast } from "react-toastify"

export const TechsContext = createContext({})

export const TechsProvider = ({ children }) => {
    const { techs, SetTechs } = useContext(UserContext)
    const [editingTech, SetEditingTech] = useState(null)
    const [creatingTech, SetCreatingTech] = useState(null)

    const techsCreate = async (formData) => {
        const token = (localStorage.getItem("@KENZIEHUB:token"))

        try {
            const response = await api.post("/users/techs", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Tecnologia adicionada com sucesso!")
            SetCreatingTech(null)
            SetTechs([...techs, response.data])
        } catch (error) {
            toast.error("Tecnologia já cadastrada!")
        } finally {
        }
    }

    const techsRemove = async (techId) => {
        try {
            const token = (localStorage.getItem("@KENZIEHUB:token"))
            const response = await api.delete(`/users/techs/${techId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.info("Tecnologia removida com sucesso!")

            const newTechs = techs.filter(tech => tech.id !== techId);
            SetTechs(newTechs);
        } catch (error) {
            console.log(error);
        }
    }

    const techsUpdate = async (formData, techId) => {
        try {
            const token = (localStorage.getItem("@KENZIEHUB:token"))
            const response = await api.put(`/users/techs/${techId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const newTechs = techs.map(tech => {
                if (techId === tech.id) {
                    return { ...tech, ...formData };
                } else {
                    return tech
                }
            })
            toast.success("Tecnologia atualizada com sucesso!")
            SetEditingTech(null)
            SetTechs(newTechs);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TechsContext.Provider value={{
            techsCreate,
            techsRemove,
            techsUpdate,
            editingTech,
            SetEditingTech,
            creatingTech,
            SetCreatingTech
        }}>
            {children}
        </TechsContext.Provider>
    )
}