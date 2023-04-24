import React, { useState, useEffect } from 'react'

export default function useValidacion(stateInicial, validar, funcion) {

    const [ valores, setValores ] = useState(stateInicial)
    const [ errores, setErrores ] = useState({})
    const [ submitForm, setSubmitForm ] = useState(false)

    useEffect(() => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores){
                funcion()
            }
            setSubmitForm(false)
        }
    }, [errores])

    const handleChange = e =>{
        setValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = e =>{
        e.preventDefault()
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion)
        setSubmitForm(true)
    }

    // Cuando se realiza el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion)
    }

  return {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  }
}
