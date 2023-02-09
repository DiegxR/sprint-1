import axios from "axios";
import { URL_MESSAGES } from "./renderContacts.js";
import { URL_USER } from "./renderContacts.js";
import { rendContactInfo } from "./renderContacts.js";
import { addNewContact } from "./profileEdit.js";
export const URL_CONVERSATION = "https://miniback-sprint1-production-8779.up.railway.app/conversation/"
import check from '../../assets/Icons/double-check.svg'
import checkBlue from '../../assets/Icons/double-checkBlue.svg'
import x from '../../assets/Icons/x.svg'
export const rendMessages = async(contactId, userId, contactList) =>{ 
    try {
        let selectId = 0;
        if(!isNaN(contactId)){
            selectId = contactId;
        }else{
            if(contactId.nodeName == "ARTICLE"){
                selectId = contactId.id
            }else{
                if(contactId.parentNode.nodeName == "ARTICLE"){
                    selectId = contactId.parentNode.id
                }else{
                    if(contactId.parentNode.parentNode.nodeName == "ARTICLE"){
                        selectId = contactId.parentNode.parentNode.id
                    }else{  
                        if(contactId.parentNode.parentNode.parentNode.nodeName == "ARTICLE"){
                            selectId = contactId.parentNode.parentNode.parentNode.id
                        }
                    }
                }
            }
        }
        if(selectId !== 0){
            const contact = contactList.find(elem => elem.id == selectId)
            await rendContactInfo(selectId, contact, userId)
        }
        return parseInt(selectId)
    } catch (error) {
        return error
    }
}
export const sendMessages = async(userId,contactId, value) =>{
    try {
        if(value != ""){
            const converRes = await axios.get(URL_CONVERSATION)
            const contact = await axios.get(URL_MESSAGES+contactId)
            const userData = await axios.get(URL_USER+userId)
            let find = false;
            contact.data.messages.forEach(element => {
                if(element.id == userId){
                    find = true;
                }
            });
            if(contact.data.messages == 0 || !find){
                addNewContact(contact.data.id, userData.data.number, 'Desconocido')
            }
            let findConv = false;
            const date = new Date();
            const hour = date.getHours()
            const minutes = date.getMinutes()
            const time = `${hour > 12 ? hour-12 : hour}:${minutes} ${hour >= 12 ? 'pm' : 'am'}`
            converRes.data.forEach(async(element) =>{
                if(element.users.includes(contactId) && element.users.includes(userId)){
                    findConv = true
                    element.conversation.push([userId, value, time, false])
                    await axios.patch(URL_CONVERSATION+element.id,{"conversation": element.conversation})
                }
            })
            if(converRes.data == 0 || !findConv){
                await axios.post(URL_CONVERSATION, {"users": [userId, contactId], "conversation": [[userId, value, time, false]]})
            }
        }
    } catch (error) {
        return error
    }
}
const conversation = document.getElementById('conversation');
export const rendConversation = async(contactId, userId, filter="") =>{
    const checkMessage = await axios.get(URL_CONVERSATION);
    let converId = 0;
    checkMessage.data.forEach(async(elem) =>{
        if(elem.users.includes(contactId) && elem.users.includes(userId)){
            converId = elem.id
            elem.conversation.forEach(mess =>{
                if(mess[0] == contactId){
                    mess[3] = true;
                }
            })
            await axios.patch(URL_CONVERSATION+converId, {"conversation": elem.conversation})
        }
    })
   const res = await axios.get(URL_CONVERSATION)
   let find = false
   res.data.forEach((element, index) =>{
    if(element.users.includes(contactId) && element.users.includes(userId)){
        conversation.innerHTML = ""
        element.conversation.forEach((elem, ind) =>{
            conversation.innerHTML += `
            <div class='message ${elem[0] == userId ? 'you' : 'contact'}' data-id="${ind}" id="mensaje">
            <p class="${filter != "" ? elem[1].toLowerCase().includes(filter.toLowerCase()) ? 'found' : '' : ''}"> ${elem[1]}</p>${elem[0] == userId ?`<img src="${x}" class="deleteMessage" id="edit${ind}" >` : ''} <span>${elem[2]} ${elem[0] == userId ? `<img src="${elem[3] ? checkBlue: check}">` : ''}</span></div>
            `
            find = true
        })
      
    }
   })
   if(res.data.length == 0 || !find){
    conversation.innerHTML = ""
   }
}

