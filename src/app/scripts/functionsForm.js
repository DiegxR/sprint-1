import axios from "axios";
import { URL_USER } from "./renderContacts";
import { URL_MESSAGES } from "./renderContacts";
export const checkUser = async (number, password) => {
    try {
        const users = await axios.get(URL_USER)
        const element = users.data;
        let response = {}
        for(let i = 0; i < element.length; i++){
            if (element[i].number == number) {
                if (element[i].password == password) {
                    response = {
                        "state": true,
                        "message": 'Bienvenido',
                        "user": element[i]
                    }
                    break;
                } else {
                    response = {
                        "state": false,
                        "message": 'El usuario y la contraseña no coinciden.'
                    }
                    break;
                }
            } else {
                response = {
                    "state": false,
                    "message": 'Usario incorrecto'
                }
            }
        }
        return response
    } catch (error) {
        return error
    }
}

export const createUser = async (user) => {
    try {
        const res = await axios.post(URL_USER, user)
        const message = {
            "user": res.data.idMessage,   
            "messages": []
        }
        await axios.post(URL_MESSAGES, message)
        return res
    } catch (error) {
        return error
    }
}
