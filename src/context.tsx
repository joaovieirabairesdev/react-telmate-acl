import React, { createContext, useContext, useEffect, useState } from 'react'
import { ACLControls, ACLService } from './service'

export type ACLProviderProps = {
    children: React.ReactNode
    aclService: ACLService
}

export type ACLProviderData = {
    loading: boolean
    get: () => ACLControls[]
    clear: () => void
}

const ACLContext = createContext({} as ACLProviderData)

export const ACLProvider: React.FC<ACLProviderProps> = ({ children, aclService }: ACLProviderProps) => {

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await aclService.load()
            setLoading(false)
        }

        load()
    }, [])

    return (
        <ACLContext.Provider value={{ loading, get: aclService.getAcls, clear: aclService.clear }}>
            { children }
        </ACLContext.Provider>
    )
}

export const useACL = (): ACLProviderData => {
    const context = useContext(ACLContext)

    return context
}

export default ACLContext