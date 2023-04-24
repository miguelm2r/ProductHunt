import React, { useEffect, useState} from "react";
import firebase from "@/firebase";

function useAutenticacion(){
    const [ usuarioAutenticado, setUsuarioAutenticacion ] = useState(null)

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
            if(usuario){
                setUsuarioAutenticacion(usuario)
            } else {
                setUsuarioAutenticacion(null)
            }
        })
        return () => unsuscribe()
    },[])

    return usuarioAutenticado
}

export default useAutenticacion