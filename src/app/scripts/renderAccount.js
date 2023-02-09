import axios from "axios";
const backContacts = document.getElementById('back-contacts');
const name = document.getElementById('profile-edit__name')
const info = document.getElementById('profile-edit__info')
const userImage = document.getElementById('user-image');
const editUser = document.getElementById('edit-user');
const noConctacts = document.getElementById('no-contacts');
const home = document.getElementsByClassName('home__contacts')[0]
const profileEdit = document.getElementById('profile-edit')
const conversation = document.getElementsByClassName('home__messages')[0];
const imageContainer = document.getElementById('image-container');
const editImage = document.getElementById('editImage');
const editProfile = document.getElementById('edit-profile')
const editName = document.getElementById('profile-edit__name');
const editInfo = document.getElementById('profile-edit__info');
const inputName = document.getElementById('inputName');
const inputInfo = document.getElementById('inputInfo');
const addContact = document.getElementById('addContact');
const infoContact = document.getElementById('infoContact');
const contactsList = document.getElementById('contactsList')
const sendBtn = document.getElementById('send')
import check from '../../assets/Icons/check.svg'
import edit from '../../assets/Icons/edit-2.svg'
import userImg from '../../assets/Icons/user.webp';
import { date } from "./handleTime.js";
import { contactOptions } from "./contactOptions";
import { profileImage, profileName, profileInfo, addNewContact } from "./profileEdit.js";
import { renderContacts, rendContactInfo, filterContacts, URL_MESSAGES, URL_USER } from "./renderContacts.js";
import { rendMessages,  sendMessages, rendConversation, URL_CONVERSATION } from "./contactMessages.js";
let didMount = true;
export const renderAccount = async (user) => {
    await axios.patch(URL_USER+user.id, {flag: [true, []]})
    home.style.display = 'block';  
     conversation.style.display = 'block'
     contactsList.style.display = 'flex'
    const res = await axios.get(URL_MESSAGES + user.id)
    let firstContactG
    let contactListG
    let conversations
    const messages = res.data.messages
    name.innerText = user.name
    info.innerText = user.info
    if (user.url) {
        editUser.src = user.url
        userImage.src = user.url
    }
    let contactId = 0;
    if (messages.length == 0) {
        noConctacts.style.display = 'grid'
        conversation.style.display = 'none'
    } else {
         conversations = await axios.get(URL_CONVERSATION)
        const {firstContact, contactList} = await renderContacts(user.id, conversations.data)
        firstContactG = firstContact;
        contactListG = contactList;
        await rendContactInfo(firstContact, contactList[0])
       await rendConversation(contactList[0].id, user.id)
       contactId = await rendMessages(contactList[0].id, user.id, contactList)
        conversation.style.display = 'block'
    }
    editUser.addEventListener('click', () => {
        profileEdit.style.display = 'block'
        profileEdit.style.zIndex = 1;
        home.style.display = 'none'
    })
    backContacts.addEventListener('click', () => {
        profileEdit.style.display = 'none'
        home.style.display = 'block'
    })
//Cerrar mensajes mobile
    const contactsBack = document.getElementById('backConversation');
    contactsBack.addEventListener('click', e =>{
        conversation.style.zIndex = 0;
        home.style.zIndex = 1;
    })
//abrir mensajes
    contactsList.addEventListener('click', async(e)=>{
        if(e.target.nodeName !== 'SECTION'){
        contactId = await rendMessages(e.target, user.id, contactListG)
          await rendConversation(contactId, user.id)
          conversation.style.zIndex = 1;
        }
    })
//Informacion del contacto
    const contactInfoBtn = document.getElementById('contactInfoBtn');
    contactInfoBtn.addEventListener('click', async(e) =>{
        if(e.target.id !== 'search-message' && e.target.id !== 'backConversation'){
            await contactOptions(e.target, user.id);
        }
    })
//enviar mensajes
    let converChange
      const inputMes = document.getElementById('inputMes')
      sendBtn.addEventListener('click', async(e) =>{
            await sendMessages(user.id, contactId, inputMes.value)
            await rendConversation(contactId, user.id)
            converChange = await axios.get(URL_CONVERSATION)
            await renderContacts(user.id, converChange.data)
            inputMes.value = ""
      })
//Cambiar foto de perfil
    imageContainer.addEventListener('mouseover', () => {
        editImage.style.display = 'flex'
    })
    imageContainer.addEventListener('mouseout', (e) => {
        editImage.style.display = 'none'
    })
    imageContainer.addEventListener('click', (e) => {
        const urlInput = document.getElementById('urlInput')
        const input = urlInput.children[1]
        urlInput.style.display = 'flex'
        urlInput.addEventListener('click', async (e) => {
            if (e.target.id == 'closeInput') {
                urlInput.style.display = 'none'
            }
            if (e.target.id == 'sendUrl') {
                const res = await profileImage(user.id, input.value)
                if (res.data.url) {
                    editUser.src = res.data.url
                    userImage.src = res.data.url
                } else {
                    editUser.src = userImg
                    userImage.src = userImg
                }
            }
        })
    });
//Editar nombre y estado
    editProfile.addEventListener('click', async (e) => {
        console.log(e.target.id)
        if (e.target.id == 'edit-name' && e.target.classList.value == 'save') {
            const res = await profileName(user.id, inputName.value);
            editName.style.display = 'block'
            inputName.style.display = 'none'
            e.target.src = edit
            editName.innerText = res.data.name
            e.target.removeAttribute("class")
            e.target.parentNode.removeAttribute("class")
        } else {
            if (e.target.id == 'edit-name' && e.target.classList.value == '') {
                inputName.value = editName.innerText
                editName.style.display = 'none'
                inputName.style.display = 'block'
                e.target.src = check
                e.target.parentNode.className = 'line_edit'
                e.target.className = 'save'
            }
        }

        if (e.target.id == 'edit-info' && e.target.classList.value == 'save') {
            const res = await profileInfo(user.id, inputInfo.value);
            editInfo.style.display = 'block'
            inputInfo.style.display = 'none'
            editInfo.innerText = res.data.info
            e.target.src = edit
            e.target.removeAttribute("class")
            e.target.parentNode.removeAttribute("class")
        } else {
            if (e.target.id == 'edit-info') {
                inputInfo.value = editInfo.innerText
                editInfo.style.display = 'none'
                inputInfo.style.display = 'block'
                e.target.src = check
                e.target.parentNode.className = 'line_edit'
                e.target.className = 'save'
            }
        }
    })
    addContact.addEventListener('click', (e) => {
        infoContact.style.display = 'flex';
        const contactName = infoContact.children[1]
        const contactNumber = infoContact.children[3]
        infoContact.addEventListener('click', async (e) => {
            if (e.target.id == 'closeInfo') {
                infoContact.style.display = 'none';
                contactName.value = ''
                contactNumber.value = ''
            }
            if (e.target.id == 'saveContact') {
                const { validate } = await addNewContact(user.id, contactNumber.value, contactName.value)
                if (validate) {
                    swal({
                        title: "Usuario agregado",
                        icon: "success"
                    })
                    infoContact.style.display = 'none';
                    contactName.value = ''
                    contactNumber.value = ''
                    conversations = await axios.get(URL_CONVERSATION)
                    const {firstContact, contactList} = await renderContacts(user.id, conversations.data)
                    await rendContactInfo(firstContact, contactList[0])
                    await rendConversation(contactList[0].id, user.id)
                    contactId = await rendMessages(contactList[0].id, user.id, contactList)
                    conversation.style.display = 'block'
                    noConctacts.style.display = 'none'
                } else {
                    swal({
                        title: "Uste usuario no existe",
                        icon: "error"
                    })
                }
            }
        })
    })

//Buscar usuarios
   const searchContact = document.getElementById('searchContact');
   searchContact.addEventListener('input', async(e) =>{
    converChange = await axios.get(URL_CONVERSATION)
    await filterContacts(user.id, e.target.value, converChange.data );
   })
//Cerrar cuenta
    const closeAccount = document.getElementById('closeAccount');
    closeAccount.addEventListener('click', async(e) =>{
     const {minutes, hour} = date()
    await axios.patch(URL_USER+user.id, {flag: [false, [hour, minutes]]})
    location.reload();
    })


}
