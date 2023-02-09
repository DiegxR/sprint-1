import axios from "axios";
export const URL_MESSAGES = 'https://miniback-sprint1-production-8779.up.railway.app/mensajes/'
export const URL_USER = "https://miniback-sprint1-production-8779.up.railway.app/usuarios/"
document.addEventListener('DOMContentLoaded', async(e) =>{
const a = await axios.get(URL_USER)
console.log(a)
})
import check from '../../assets/Icons/double-check.svg'
import checkblue from '../../assets/Icons/double-checkBlue.svg'
import { date } from "./handleTime";
const contactsList = document.getElementById('contactsList');
export const renderContacts = async (userId, firstMessage) => {
    const res = await axios.get(URL_MESSAGES + userId)
    const contactsMessages = firstMessage.filter(element => element.users.includes(userId))
    contactsList.innerHTML = ""
    console.log(contactsMessages)
    const rendInfo = (idUser) =>{
        let str = ''
        if(contactsMessages.length !== 0 ){
        contactsMessages.forEach((element)=>{
            if(element.users.includes(idUser)){
                str = `
                <p>${element.conversation[element.conversation.length-1][2]}</p>
                </div>
                <p>${element.conversation[element.conversation.length-1][0] == userId ? 
                    `<img src="${element.conversation[element.conversation.length-1][3] ? checkblue : check}"/>
                    ${element.conversation[element.conversation.length-1][1]}` : `${element.conversation[element.conversation.length-1][1]}`}</p>
                `
            }
            })
        }
        return str
    }
    if(res.data.messages.length !== 0){
        res.data.messages.forEach((element, index) => {
            console.log(index)
            contactsList.innerHTML += `
            <hr>
                <article id="${element.id}">
                        <img src="${element.image}" alt="">
                        <figure>
                            <div>
                                <h1>${element.name}</h1>
                               ${rendInfo(element.id)}
                </article>
            `
        });
        const firstContact =  res.data.messages[0].id
        const contactList = res.data.messages
        return {
           firstContact,
            contactList
        }
    }
    
}
const infoMessage = document.querySelector('.home__messages-info');
export const rendContactInfo = async(userId, contactList, accountId) =>{
    infoMessage.dataset.idContact = userId
    infoMessage.dataset.idUser = accountId
    const res = await axios.get(URL_USER+userId)
    const img = infoMessage.children[0].children[1]
    const name = infoMessage.children[0].children[2].children[0]
    const flag = infoMessage.children[0].children[2].children[1]
    img.src = res.data.url;
    name.innerText = contactList.name;
    const {minutes, hour} = date()

    flag.innerText = res.data.flag[0] ? 'EN LINEA' : `${hour == res.data.flag[1][0] ? minutes-res.data.flag[1][1] == 0 ? 'Hace un momento' : `Hace ${minutes-res.data.flag[1][1]} minutos` : hour-res.data.flag[1][0] == 1 ? `Hace ${60-res.data.flag[1][1]+minutes} minutos` : isNaN(hour-res.data.flag[1][0]) ? '' : `Hace ${hour-res.data.flag[1][0]} horas`} `;
}
export const filterContacts = async(userId, value, firstMessage) =>{
    const res = await axios.get(URL_MESSAGES + userId)
    const contactsMessages = firstMessage.filter(element => element.users.includes(userId))
    contactsList.innerHTML = ""
    console.log(contactsMessages)
    const rendInfo = (idUser) =>{
        let str = ''
        if(contactsMessages.length !== 0 ){
        contactsMessages.forEach((element)=>{
            if(element.users.includes(idUser)){
                str = `
                <p>${element.conversation[element.conversation.length-1][2]}</p>
                </div>
                <p>${element.conversation[element.conversation.length-1][0] == userId ? 
                    `<img src="${element.conversation[element.conversation.length-1][3] ? checkblue : check}"/>
                    ${element.conversation[element.conversation.length-1][1]}` : `${element.conversation[element.conversation.length-1][1]}`}</p>
                `
            }
            })
        }
        return str
    }
    res.data.messages.forEach((element) => {
        if(element.name.includes(value)){
            contactsList.innerHTML += `
            <hr>
                <article id="${element.id}">
                        <img src="${element.image}" alt="">
                        <figure>
                            <div>
                                <h1>${element.name}</h1>
                               ${rendInfo(element.id)}
                        </figure>
                </article>
            `
            }
        });
    }
 
