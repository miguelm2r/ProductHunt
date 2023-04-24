export default function validarCrearCuenta(valores) {
  
    let errores = {};

    // Validar el nombre de usuario
    if(!valores.nombre){
        errores.nombre ="El Nombre es Obligatorio"
    }

    // Validar el email de usuario
    if(!valores.email){
        errores.email ="El Email es Obligatorio"
    }

    // Validar el password de usuario
    if(!valores.password){
        errores.password ="El password es Obligatorio"
    } else if (valores.password.length < 6){
        errores.password = "El password debe contener al menos 6 cáracteres"
    }

    return errores
}
