import React, {useEffect, useState, useContext} from 'react'
import { useRouter } from 'next/router'
import { FirebaseContext } from '../../firebase';
import {collection, getDoc, doc} from 'firebase/firestore'
import Layout from '../../components/layout/Layout';
import Error404 from '@/components/layout/404';
import { css } from '@emotion/react'
import styled from '@emotion/styled';
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { es } from "date-fns/locale"
import { Campo, InputSubmit } from '@/components/ui/Formulario';
import { updateDoc, increment } from "firebase/firestore";
import Boton from '@/components/ui/Boton';

const ContenedorProducto = styled.div`
    @media (min-width: 768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`

export default function Producto() {

    //State del componete
    const [producto, setProducto] = useState({});    
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({})
 
    //Rounting para obtener el ID actual
    const router = useRouter();
    //console.log(router.query.id);
    const {query: {id}} = router;
 
    //Context de Firebase
    const {firebase, usuario} = useContext(FirebaseContext);
 
    useEffect(() => {
      if(id){
        const obtenerProducto = async ()=>{
          const productoQuery = await doc(collection(firebase.db, 'productos'), id);             
          const productoID = await  getDoc(productoQuery);
          //console.log(productoID.data());  
          if(productoID.data() !== undefined ){
            setProducto(productoID.data());
          }else{
            setError(true);
          }
        }
        obtenerProducto();
      }
    }, [id, producto]);

    useEffect(() => {
        console.log(error)
    }, [error])

    if(Object.keys(producto).length === 0 && !error) return "Cargando..."

    const { comentarios, creado, descripcion, empresa, nombre, url, URLImage, votos, creador, haVotado} = producto

    const votarProducto = () => {
        const nuevoTotal = votos+1;

        // Verificar si el usuario ha votado
        if(haVotado.includes(usuario.uid)) return;

        // Guardar el id del usuario que ha votado
        const hanVotado = [...haVotado, usuario.uid]

        // Actualizar en la BD
        const docRef = doc(firebase.db, "productos", `${id}`);
        updateDoc(docRef, {
            votos: increment(nuevoTotal), 
            haVotado: hanVotado
        });
        // Actualizar el state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })
    }

    // Funciones para crear comentarios
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    const agregarComentario = async (e) => {
        e.preventDefault()
        
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        
        //Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario]
 
        //actualizar la DB
        const productoQuery = await doc(collection(firebase.db, 'productos'), id);

        updateDoc(productoQuery, {
            comentarios: nuevosComentarios       
          });
        
        // Actualizar el state
        setProducto({
            ...producto,
            comentario: nuevosComentarios
        })
    }

  return (
    <Layout>
      {error ? <Error404/> : (
        <div className='contenedor'>
            <h1
                css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
            >{nombre}</h1>

            <ContenedorProducto>
            <div>     
                <p>Publicado hace: {creado ? formatDistanceToNow(new Date(creado), {locale: es}) : null} </p>
                <p>por {creador.nombre} de {empresa}</p>
                <img src={URLImage} />
                <p>{descripcion}</p>

                { usuario && (
                    <>
                        <h2>Agrega tu comentario</h2>
                        <form
                            onSubmit={agregarComentario}
                        >
                            <Campo>
                                <input
                                    type='text'
                                    name="mensaje"
                                    onChange={comentarioChange}
                                />
                            </Campo>
                            <InputSubmit
                                type='submit'
                                value="Agregar Comentario"
                            ></InputSubmit>
                        </form>
                    </>
                )}

                <h2 css={css`margin:2rem 0;`}>Comentarios</h2>
                
                {comentarios.length === 0 ? "Aun no hay comentarios" : (
                    <ul>
                        {comentarios.map((comentario, i) => (
                            <li
                                key={`$(comentario.usuarioId)-${i}`}
                                css={css`
                                    border: 1px solid #e1e1e1;
                                    padding: 2rem;
                                `}
                            >
                                <p>{comentario.mensaje}</p>
                                <p>Escrito por: 
                                    <span
                                    css={css`
                                        font-weight: bold;
                                    `}
                                    >
                                    {" "}{comentario.usuarioNombre}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                )} 
            </div>

                <aside>
                    <Boton
                        target="_blank"
                        bgColor="true"
                        href={url}
                    >Visitar URL</Boton>

                    

                    <p css={css`
                        text-align: center;
                        margin: 2rem auto;
                    `}>{votos} Votos</p>
                    
                    { usuario && (
                        <Boton
                         onClick={votarProducto}
                        >
                            Votar
                        </Boton>
                    )}
                    
                </aside>
            </ContenedorProducto>
        </div>


      )} 
         
    </Layout> 
  )
}
