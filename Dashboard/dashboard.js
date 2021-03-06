//*********************** IMPORT STATMENTS ********************* */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref as databaseRef, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMqIwyT6kw54_FnT2GmyR5l8UYeDBZklU",
  authDomain: "company-b4fed.firebaseapp.com",
  databaseURL: "https://company-b4fed-default-rtdb.firebaseio.com",
  projectId: "company-b4fed",
  storageBucket: "company-b4fed.appspot.com",
  messagingSenderId: "873037321248",
  appId: "1:873037321248:web:9a43344c34894195291845",
  measurementId: "G-4NBKLZLBV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let signout = document.getElementsByClassName('signOut')
let heading = document.getElementsByClassName('dashboard-heading');
let currentUser = JSON.parse(sessionStorage.getItem('user'));
let inputFile = document.querySelector('.input-file')
// console.log(inputFile)
let selectFile = inputFile.querySelector('.select-file')
let dataName = document.getElementsByClassName('data');


let File1 = document.getElementsByClassName('pdf-file1');
let File2 = document.getElementsByClassName('pdf-file2');
let File3 = document.getElementsByClassName('pdf-file3');

function signOut() {
  // console.log('hi signout')
  sessionStorage.removeItem('user')
  window.location = '../index.html'
}


//Heading
if (currentUser == null) {
  alert('Please click Sign Out and login again.')
  // console.log('bye')
}
else {
  heading[0].innerHTML = `Hello ${currentUser.phoneNumber}`;

  let storage = getStorage(); //get storage reference
  let storageRef = ref(storage, `${currentUser.phoneNumber}/`);
  // console.log(storageRef.child)
  let pathName = [];

  listAll(storageRef)
    .then((res) => {
      res.items.forEach((itemRef, i) => {
        // console.log(itemRef)
        // dataName[0].innerHTML += `${itemRef._location.path_.split('/')[1]}<br>`
        document.getElementsByClassName('files-section')[0].innerHTML += `
        <div class="pdf${i+1} pdf">
        <p class="pdf-file${i+1}">${itemRef._location.path_.split('/')[1]}</p>
        <a class="download-file${i+1}"><button>Download</button></a>
      </div>
      `
        // document.getElementsByClassName(`pdf-file${i+1}`)[0].innerHTML += `${itemRef._location.path_.split('/')[1]}`
        // pathName.push(itemRef._location.path_.split('/')[1])
        pathName.push(itemRef._location.path_.split('/')[1])

        function downloadFile() {
          let pathStorageRef = ref(storage, `${currentUser.phoneNumber}/${itemRef._location.path_.split('/')[1]}`);
          // const uploadTask = uploadBytesResumable(pathStorageRef);
          // console.log(uploadTask.snapshot.ref)
          console.log(itemRef)
          console.log(i)
      
            getDownloadURL(itemRef)
              .then((URL) => {
                console.log(URL);
                document.getElementsByClassName(`download-file${i+1}`)[0].addEventListener('click', function () {
                  document.getElementsByClassName(`download-file${i+1}`)[0].href = URL;
                })
                // document.getElementsByClassName('download-file1')[0].addEventListener
                // dataName[0].href = `${URL}`
      
                // uploadUrl(URL)
      
              })
      
          
        }

        downloadFile();

      });
      
      
    })

  console.log(pathName)

  

  // for(let i=1;i<=3;i++){
  //   downloadFile(i)
  // }

  console.log(pathName.length)

  // downloadFile(1)
  // downloadFile(2,pathName)
  // downloadFile(3,pathName)








  // console.log(pathStorageRef)
  // pathStorageRef.getDownloadURL()
  //   .then(
  //     function (url) {
  //       console.log(url)
  //     }
  //   )



  console.log(currentUser)
}


//PDF files

let reader = new FileReader();


function uploadUrl(URL) {

  update(databaseRef(db, 'List' + currentUser.phoneNumber),
    {
      url: URL
    }
  )
  // .then(()=>{
  //   console.log(URL)
  //   alert('realtime database updated')
  // })
  // .catch((error)=>{
  //   alert('error '+ error)
  // })
}


async function uploadFile(file, i) {
  let storage = getStorage(); //get storage reference
  let storageRef = ref(storage, `${currentUser.phoneNumber}/` + file.name);

  const uploadTask = uploadBytesResumable(storageRef, file);
  console.log(uploadTask)
  alert('File is uploading. Click ok to continue and wait for few seconds.')

  uploadTask.on('state-changed', (snapshot) => {
    console.log(snapshot)
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    document.getElementsByClassName('uploading')[0].innerHTML=`${progress}% upload done.`
    console.log('Upload is ' + progress + '% done');

  },
  (error) => {
    // Handle unsuccessful uploads
  },

  () => {
    document.getElementsByClassName('uploading')[0].innerHTML=''
    getDownloadURL(uploadTask.snapshot.ref)
      .then((URL) => {
        console.log(URL);
        document.getElementsByClassName('files-section')[0].innerHTML += `
        <div class="pdf${i+1} pdf">
        <p class="pdf-file${i+1}">${file.name}</p>
        <a class="download-file${i+1}"><button>Download</button></a>
      </div>
      `
        document.getElementsByClassName(`download-file${i+1}`)[0].addEventListener('click', function () {
          document.getElementsByClassName(`download-file${i+1}`)[0].href = URL;
        })

        // dataName[0].href = `${URL}`

        // uploadUrl(URL)
        // alert('File uploaded successfully.')

      })
    alert('File uploaded successfully.')
    window.location='../Dashboard/dashboard.html';
  }
  
  )
  // alert('file uploaded')
  // window.location='../Dashboard/dashboard.html';

  // alert('file uploaded. Click Ok and wait for few seconds.')
  // setTimeout(()=>{
  //   // window.location='../Dashboard/dashboard.html';
  // },4000)
  // window.location='../Dashboard/dashboard.html';
}


inputFile.addEventListener('click', () => {
  selectFile.click();
})


selectFile.onchange = e => {

  let file = e.target.files[0]

  if (file.type === 'application/pdf') {
    console.log(file)
    let fileName = file.name;

    let storage = getStorage(); //get storage reference
    let storageRef = ref(storage, `${currentUser.phoneNumber}/`);


    listAll(storageRef)
      .then((res) => {
        console.log(res.items)
        console.log(res.items
          .some((itemRef)=>{
            console.log(itemRef._location.path_.split('/')[1])
            console.log(fileName)
            itemRef._location.path_.split('/')[1] == fileName}
                ))
        
        let flag=0;
        
        console.log(res.items.length)
        if(res.items.length==0){
          console.log('start')
          if (res.items.length < 3) {
            // document.getElementsByClassName(`pdf-file${res.items.length+1}`)[0].innerHTML = `${fileName}`
            // dataName[0].innerHTML += `${fileName}<br>`
            uploadFile(file, res.items.length);
            // window.location='../Dashboard/dashboard.html';
          }
          else {
            alert('can not upload more than 3 files')
          }
        }
        for(let i=1; i<=res.items.length; i++){
          console.log('inside for loop')

          if(res.items[i-1]._location.path_.split('/')[1] == fileName){
            alert(`${fileName} already uploaded.`)
          console.log('finish')
            break;
          }
          else{
            flag=1;
            console.log(flag)
          }
        }
        if(flag){
          console.log('start')
          if (res.items.length < 3) {
            // document.getElementsByClassName(`pdf-file${res.items.length+1}`)[0].innerHTML = `${fileName}`
            // dataName[0].innerHTML += `${fileName}<br>`
            uploadFile(file, res.items.length);
            // window.location='../Dashboard/dashboard.html';
          }
          else {
            alert('can not upload more than 3 files')
          }
        }
      })
      

  }
  else {
    alert('please choose pdf files only')
  }
}




signout[0].addEventListener('click', signOut);