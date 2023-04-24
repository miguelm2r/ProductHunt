import { initializeApp } from 'firebase/app';
import firebaseConfig from './config';
import "firebase/firestore";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from '@firebase/storage';
import { createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword } from '@firebase/auth'


class Firebase {
    constructor() {
        const app = initializeApp(firebaseConfig)
        this.auth = getAuth(app)
        this.db = getFirestore(app)
        this.storage = getStorage(app)
    }

    // Registra un usuario
    async registrar(nombre, email, password) {
        const nuevoUsuario = await createUserWithEmailAndPassword(
            this.auth,
            email,
            password
        )
        
        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        })
    }

    // Iniciar Sesion
    async login(email, password) {
        return await signInWithEmailAndPassword(this.auth, email, password);
    }

    // Cierra la sesion del usuario
    async cerrarSesion(){
        await this.auth.signOut()
    }
}

const firebase = new Firebase()

export default firebase;