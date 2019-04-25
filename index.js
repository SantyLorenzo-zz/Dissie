var user = {}

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCxXq7SDRwsgYAuY1QP7LmBWj_ViLf_u_U",
  authDomain: "dissie-app.firebaseapp.com",
  databaseURL: 'https://dissie-app.firebaseio.com',
  projectId: "dissie-app",
  storageBucket: "dissie-app.appspot.com",
  messagingSenderId: "321471252260"
})
var db = firebase.firestore()
db.settings({
  timestampsInSnapshots: true
})

// FirebaseUI config.
var uiConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  // Terms of service url/callback.
  tosUrl: () => {},
  // Privacy policy url/callback.
  privacyPolicyUrl: () => {}
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig)

firebase.auth().onAuthStateChanged(firebaseUser => {
  document.getElementById('mainchat-loader').classList.remove('active')
  document.getElementById('mainchat-loader').classList.add('hide')

  if (firebaseUser) {
    user = firebaseUser
    document.getElementById('firebaseui-auth-container').classList.add('hide')
    document.getElementById('logout-button').classList.remove('hide')
    document.getElementById('buzon').classList.remove('hide')
    document.getElementById('footer').classList.remove('hide')
  } else {
    // User is signed out.
    document.getElementById('firebaseui-auth-container').classList.remove('hide')
    document.getElementById('logout-button').classList.add('hide')
    document.getElementById('buzon').classList.add('hide')
    document.getElementById('footer').classList.add('hide')
  }
}, error => console.log(error))

document.getElementById('logout-button').addEventListener('click', () => firebase.auth().signOut())

// final of firebase configuration ----

db.collection('chat').orderBy('timeStamp', 'desc').onSnapshot(chats => {
  var buzon = document.getElementById('buzon')
  while (buzon.hasChildNodes()) {
    buzon.removeChild(buzon.firstChild);
  }
  chats.forEach(response => {
    var chat = response.data()

    var mensage = document.createElement('li')
    var img = document.createElement('img')
    var container = document.createElement('div')
    var rowTitle = document.createElement('div')
    var name = document.createElement('strong')
    var text = document.createElement('p')
    var date = document.createElement('p')
  
    img.className = 'imagen1'
    date.className = 'chat-date'
    text.className = 'chat-text'
    name.className = 'chat-title'
    rowTitle.className = 'row'
    container.className = 'chat-column-container'

    if (user.displayName == chat.name) {
      mensage.classList.add('alignEnd')
    }

    const chatDate = chat.timeStamp.toDate()
    const y = chatDate.getFullYear()
    const m = chatDate.getMonth()
    const d = chatDate.getDate()
    const h = chatDate.getHours()
    const min = chatDate.getMinutes()

    date.innerHTML = `${d}/${m}/${y} ${h}:${min}`
    name.innerHTML = chat.name
    text.innerHTML = chat.message
    img.src = chat.photo

    rowTitle.appendChild(name)
    rowTitle.appendChild(date)
    container.appendChild(rowTitle)
    container.appendChild(text)

    // reseteando el input
    input.value = ''
    // mando el mensage
    mensage.appendChild(img)
    mensage.appendChild(container)
    buzon.appendChild(mensage)
  })
})

var button = document.getElementById('send-button')
var input = document.getElementById('new-message-input')

button.addEventListener('click', function (e) {
  if (input.value != '') {
    addMessage()
  }
})
input.addEventListener('keypress', function (e) {
  if (e.keyCode === 13 && input.value != '') {
    addMessage()
  }
})

// crear nuevo mensage
function addMessage() {
  // send chat to firebase
  db.collection("chat").add({
      name: user.displayName,
      photo: user.photoURL,
      message: input.value,
      timeStamp: new Date()
    })
    .then(docRef => console.log('Document written with ID: ', docRef.id))
    .catch(error => console.error('Error adding document: ', error))

  // reseteando el input
  input.value = ''
}

document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit()
})