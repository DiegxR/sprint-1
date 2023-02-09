import axios from "axios"
const modalContainer = document.querySelector('.modal-contact')
const inputBtn = document.getElementById('search-message')
const inputSearch = document.getElementById('search-message__input')
modalContainer.style.display = 'none'
import { rendConversation } from "./contactMessages"
import close from  '../../assets/Icons/arrow-leftWhite.svg'
import edit from '../../assets/Icons/edit-2.svg'
import check from '../../assets/Icons/check.svg'
import { URL_MESSAGES, URL_USER } from "./renderContacts"
import { renderAccount } from "./renderAccount.js"
export const contactOptions = async (target, userId) => {
    let idS = [];
    if (target.nodeName == 'HEADER') {
        idS = [target.dataset.idContact, target.dataset.idUser]
    } else if (target.parentNode.nodeName == 'HEADER') {
        idS = [target.parentNode.dataset.idContact, target.parentNode.dataset.idUser]
    } else if (target.parentNode.parentNode.nodeName == 'HEADER') {
        idS = [target.parentNode.parentNode.dataset.idContact, target.parentNode.parentNode.dataset.idUser]
    } else if(target.parentNode.parentNode.parentNode.nodeName == 'HEADER') {
        idS = [target.parentNode.parentNode.parentNode.dataset.idContact, target.parentNode.parentNode.parentNode.dataset.idUser]
    } 
    if (idS.length !== 0) {
        modalContainer.style.display = 'block'
        modalContainer.style.zIndex = '1'
        const user = await axios.get(URL_USER + idS[0])
        const contact = await axios.get(URL_MESSAGES + idS[1])
        const viewName = () =>{
            let strgn = ''
            contact.data.messages.forEach(element => {
                if(element.id == idS[0]){
                    strgn = element.name
                }
            })
            return strgn
        }
        modalContainer.innerHTML = ""
        modalContainer.innerHTML = `
                <header>
                    <img src="${close}" class="modal-contact__close" id="closeModalCon">
                    <h3>Información del contacto</h3>
                </header>
                <figure>
                    <img src="${user.data.url}" class="modal-contact__image" id="contactImage">
                    <div id="contactName">
                    <h2 class="modal-contact__name" id="contactNameValue">${viewName()}</h2>
                    <input type="text" id="editContactName"><img src="${edit}" id="editContactNameBtn">
                    </div>
                   
                </figure>
                <article>
                    <hr>
                    <h2>Número</h2>
                        <p class="modal-contact__number"> ${user.data.number} <span class="nameContact"> - ${user.data.name}</span></p>
                    <hr>
                    <h2>Info</h2>
                    <p class="modal-contact__info">${user.data.info}</p>
                </article>
        `
        const closeMdlCon = document.getElementById('closeModalCon');
        closeMdlCon.addEventListener('click', ()=>{
            modalContainer.style.display = 'none'
        })
        const editContactName = document.getElementById('editContactNameBtn');
        const contactName = document.getElementById('contactName')
        const input = document.getElementById('editContactName');
        const name = document.getElementById('contactNameValue')
        contactName.addEventListener('mouseover', ()=>{
            editContactName.style.display = 'block'
        })
        contactName.addEventListener('mouseleave', (e)=>{
            if(!e.target.classList.contains('check')){
                editContactName.style.display = 'none'
            }
        })
        editContactName.addEventListener('click', async(e) =>{
            if(!contactName.classList.contains('check')){
            contactName.classList.add('check')
            input.value = contactName.innerText
            name.style.display = 'none'
            input.style.display = 'block'
            e.target.src = check
            }else{
                contactName.innerText = input.value
                e.target.src = edit
                name.style.display = 'block'
                input.style.display = 'none'
                const contacts = await axios.get(URL_MESSAGES + idS[1])
                console.log(contacts)
                contacts.data.messages.forEach( element =>{
                    if(element.id == idS[0]){
                        element.name = input.value
                    }
                })
                await axios.patch(URL_MESSAGES + idS[1], {messages: contacts.data.messages})
               
            }
        })
        
    }
   
}
inputBtn.addEventListener('click', e =>{
    inputSearch.style.display = 'flex'
    
    const idS = [e.target.parentNode.dataset.idContact, e.target.parentNode.dataset.idUser]
    inputSearch.children[0].children[1].addEventListener('click', () =>{
        inputSearch.style.display = 'none'
    })
    inputSearch.children[0].children[0].addEventListener('input', async(e)=>{
        await rendConversation(parseInt(idS[0]), parseInt(idS[1]), e.target.value)
    })
})