import search from '../../assets/Icons/search.svg';
import addUser from  '../../assets/Icons/addUser.png';
import arrowWhite from '../../assets/Icons/arrow-leftWhite.svg'
import x from '../../assets/Icons/x.svg'
import check from '../../assets/Icons/check.svg'
import cameraWhite from '../../assets/Icons/cameraWhite.svg'
import edit from '../../assets/Icons/edit-2.svg'
import cell from '../../assets/no-contacts.png'
import smile from '../../assets/Icons/smile.svg'
import clip from '../../assets/Icons/paperclip.svg'
import micro from '../../assets/Icons/mic.svg'
import sendMess from '../../assets/Icons/send.svg'
import backgroundImg from '../../assets/background-chat.png'
const addContact = document.getElementById('addContact');
const searchContactImg = document.getElementById('searchContactImg');
const backContacts = document.getElementById('back-contacts');
const searchMessage = document.getElementById('search-message');
const closeInput = document.getElementById('closeInput');
const sendUrl = document.getElementById('sendUrl');
const editImage = document.getElementById('imageEdit');
const editName = document.getElementById('edit-name');
const editInfo = document.getElementById('edit-info');
const noContact = document.getElementById('no-contactsImg');
const gifs = document.getElementById('gifs');
const files = document.getElementById('files');
const send = document.getElementById('send');
const inputMes = document.getElementById('inputMes');

export const rendImages = () =>{
    addContact.src = addUser;
    searchContactImg.src = search;
    backContacts.src = arrowWhite;
    closeInput.src = x;
    editImage.src = cameraWhite;
    editName.src = edit;
    editInfo.src = edit;
    noContact.src = cell;
    searchMessage.src = search;
    sendUrl.src = check
    gifs.src = smile;
    files.src = clip;
    send.src = micro;
    backgroundImg
    inputMes.addEventListener('blur', ()=>{
        send.src = micro;
    })
    inputMes.addEventListener('click', ()=>{
        send.src = sendMess;
    })
}
