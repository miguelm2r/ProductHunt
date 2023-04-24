import { useState, useContext } from "react";
import Layout from "@/components/layout/Layout";
import { css } from "@emotion/react"
import { Formulario, Campo, InputSubmit, Error } from "@/components/ui/Formulario";
import Router, { useRouter} from "next/router";
import { collection , addDoc } from 'firebase/firestore';
import { FirebaseContext } from "../firebase"
import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage';

// Validaciones
import useValidacion from "@/hooks/useValidacion";
import validarCrearProducto from "@/validacion/validarCrearProducto";

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: '',
}


export default function NuevoProducto() {
  const [ error, setError ] = useState(false)


  const { 
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

  const { nombre, empresa, imagen, url, descripcion } = valores

  const router = useRouter()

  const { usuario, firebase } = useContext(FirebaseContext)

  // States para la subida de la imagen
  const [ uploading, setUploading ] = useState(false)
  const [URLImage, setURLImage] = useState('')

  const handleImageUpload = e => {
    // Se obtiene referencia de la ubicacion donde se guardara la imagen
    const file = e.target.files[0]
    const imageRef = ref(firebase.storage, "productos/" + file.name)

    // Se inicia la subida
    setUploading(true)
    const uploadTask = uploadBytesResumable(imageRef, file)

    // Registrar eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed',
      // Muestra progreso de la subida
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        console.log(`Subiendo imagen: ${progress}% terminado`);

      },
      // En caso de error
      error => {
        setUploading(false)
        console.log(error)
      },
      // Subida finalizada correctamente
      () => {
        setUploading(false)
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          console.log('Imagen disponible en:', url);
          setURLImage(url)
        })
      }
    )
  }

  async function crearProducto() {
    if (!usuario) {
        return router.push('/');
    }
 
    const producto = {
        nombre,
        empresa,
        url,
        URLImage,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(),
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName
        },
        haVotado: []
    }
 
    try {
        await addDoc(collection(firebase.db,"productos"), producto);

        return router.push('/')
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

            <fieldset>
              <legend>Información General</legend>
            
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre Producto"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Nombre Empresa o Compañia"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}

              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <input
                    accept="image/*"
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageUpload}
                />
              </Campo>
              {errores.imagen && <Error>{errores.imagen}</Error>}

              <Campo>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  placeholder="URL del Producto"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>

            {error && <Error>{error}</Error>}

            <InputSubmit 
              type="submit" 
              value="Crear Producto" 
            />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

