import axios from "axios";
import { URL_USER } from "./renderContacts";
import { URL_MESSAGES } from "./renderContacts";
export const profileImage = async(userId, urlValue) =>{
    try {
        const res = await axios.patch(URL_USER+userId, {url : urlValue});
        return res
    } catch (error) {
        return error
    }
}
export const profileName = async(userId, newName) => {
    console.log(userId)
    try {
        const res = await axios.patch(URL_USER+userId, {name: newName})
        return res
    } catch (error) {
        return error
    }
}
export const profileInfo = async(userId, newInfo) => {
    try {
        const res = await axios.patch(URL_USER+userId, {info: newInfo})
        return res
    } catch (error) {
        return error
    }
}
export const addNewContact = async(userId, contactNumber, contactName) =>{
    try { 
        const res = await axios.get(URL_USER);
        let user = {}
        let validate = false
        res.data.forEach((element) => {
            if(element.number == contactNumber){
                user = {
                    "id": element.id,
                    "name": contactName,
                    "number": element.number,
                    "image": element.url,
                }
                validate = true
            }
        });
        if(validate){
            const contacts = await axios.get(URL_MESSAGES+userId)
            const messages = contacts.data.messages
                messages.push(user)
            const res = await axios.patch(URL_MESSAGES+userId, {"messages": messages})
            return {
                res,
                validate
            } 
        }else{
            return validate
        }
    } catch (error) {
        return error
    }
}