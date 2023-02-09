import axios from "axios";
import '../styles/styles.scss'
import { rendImages } from './UI';
import { checkUser } from "./functionsForm.js";
import { createUser } from "./functionsForm.js";
import { renderAccount } from "./renderAccount.js";
const login = document.getElementById('login');
export const loginContainer = document.getElementsByClassName('login')[0]
const errorLogin = document.getElementById('login__error');
const signupContainer = document.getElementsByClassName('signup')[0]
const errorSignup = document.getElementById('signup__error')
const createBtn = document.getElementById('create__account')
const home = document.getElementsByClassName('home')[0]
import { URL_USER } from './renderContacts';
//Iniciar sesion
login.addEventListener('submit', async (e) => {
    

    e.preventDefault()
    rendImages()
    const prueba = await axios.get(URL_USER+1)
    const inputs = Object.values(login).filter(element => element.nodeName == "INPUT")
    const number = inputs[0].value
    const password = inputs[1].value;
    if (!number || !password) {
        !number ? errorLogin.innerText = 'Ingrese un número' : errorLogin.innerText = 'Ingrese una contraseña';
    } else {
        const { state, message, user } = await checkUser(number, password)
        if (state) {
            swal({
                title: "¡Bienvenido!",
                icon: "success",
              });
              login.reset()
              await renderAccount(user)
              loginContainer.style.display = 'none'
              home.style.display = 'flex'
        } else {
            errorLogin.innerText = message
        }
    }
})
//Crear cuenta
createBtn.addEventListener('click', e => {
    e.preventDefault()
    loginContainer.style.display = 'none'
    signupContainer.style.display = 'block'
})
const signup = document.getElementById('signup')

signup.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = Object.values(signup).filter(element => element.nodeName == "INPUT")
    let newUser = {}
    const name = inputs[0].value
    const number = inputs[1].value
    const password = inputs[2].value
    const { message } = await checkUser(number, 1)
    if (message == "Contraseña incorrecta.") {
        errorSignup.innerText = 'este numero ya está registrado'
    } else {
        if (!name || !number || !password) {
            !name ? errorSignup.innerText ='Ingrese un nombre' :
                (!number ? errorSignup.innerText ='Ingrese un número' : errorSignup.innerText ='Ingrese una contraseña')
        } else {
            if (number.length !== 10) {
                errorSignup.innerText = 'registre un número válido'
            } else {
               
                newUser = {
                    "name": name,
                    "number": number,
                    "password": password,
                    "url": inputs[3].value,
                    "info": inputs[4].value,
                    "flag": [false, []]
                }
                const res = await createUser(newUser)
                swal({
                    title: `Tu número ${res.data.number} ha sido registrado con exito.`,
                    text: "Ya puedes iniciar sesión.",
                    icon: "success",
                  })
                  signupContainer.style.display = 'none'
                  loginContainer.style.display = 'block'
                  signup.reset()
            }
        }

    }
})
