export default function validarCrearProducto(valores) {
  
    let errores = {};

    // Validar el nombre de usuario
    if(!valores.nombre){
        errores.nombre ="El Nombre es Obligatorio"
    }

    // Validar empresa
    if(!valores.empresa){
        errores.empresa ="El nombre de la Empresa es Obligatorio"
    }
    
    // Validar la url
    if(!valores.url){
        errores.url ="La url es Obligatorio"
    }
    
    // Validar descripcion
    if(!valores.descripcion){
        errores.descripcion ="La descripción es Obligatorio"
    }
    

    return errores
}
