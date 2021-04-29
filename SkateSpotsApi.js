import { Marker } from "react-native-svg";
import Firebase from "./config/Firebase";


export function deleteSpot(marker) {
  console.log(marker)
Firebase.firestore()
  .collection('SkateSpots')
  .doc(marker.id).delete()
  
}
export async function getTricks(tricksRetrieved,user){
  var Tricks = [];

  var snapshot = await Firebase.firestore()
    .collection('Tricks')
  .where('uid', '==',user.toString())

    .get()
    
  
  snapshot.forEach((doc) => {
    const trick = doc.data();
    trick.id = doc.id;
    Tricks.push(trick);
   
  })
  tricksRetrieved(Tricks);

}

export const sendTrickData = (tricks) =>{

 
 
    Firebase.firestore()
    .collection('SkateSpots')
    .add(tricks)
    .then((snapshot)=>{
      tricks.id = snapshot.id;
      snapshot.set(spot);
    }).then(()=> addComplete(tricks))
    .catch((error) => console.log(error));
  }




export const send  =messages => {
  let time;

      var hours = new Date().getHours();

  var minutes = new Date().getMinutes();

  time = hours + ':' + minutes;
  messages.forEach(item => {
    const message = {
      text: item.text,
      timestamp: time,
      user: item.user
    };
   Firebase.firestore().collection('Messages').add(message);

  })
}
export async function updateSpot(spot) {
  if(spot.image===null){
  var snapshot = await Firebase.firestore()
  .collection('SkateSpots')
  .doc(spot.id).update({
    name:spot.name
  })}
  else{
    var snapshot = await Firebase.firestore()
    .collection('SkateSpots')
    .doc(spot.id).update({
      name:spot.name,
      image:spot.image
  })}

console.log(spot.name);


 
}
export function updateSpeed(speed){
  Firebase.firestore().collection("Speeds").doc(Firebase.auth().currentUser.uid).update({
   Speed:speed
});
}


export  async function getTime(timeretrieved){
    
  var Speed = [];

var snapshot = await Firebase.firestore()
  .collection('Speeds')
  .where('name', '==',Firebase.auth().currentUser.uid)
  .get()

snapshot.forEach((doc) => {
  const speed = doc.data();
  speed.id = doc.id;
  Speed.push(speed);
 
})
timeretrieved(Speed);
}

export function addSpot2(spot , addComplete){
  Firebase.firestore()
  .collection('SkateSpots')
  .add(spot)
  .then((snapshot)=>{
    spot.id = snapshot.id;
    snapshot.set(spot);
  }).then(()=> addComplete(spot))
  .catch((error) => console.log(error));
}


export async function getMyMessages(messagesRetrieved,chatID){
  var Messages = [];

  var snapshot = await Firebase.firestore()
    .collection('Messages')
  .where('chatID', '==',chatID)

    .get()
    
  
  snapshot.forEach((doc) => {
    const message = doc.data();
    message.id = doc.id;
    Messages.push( message);
   
  })
  messagesRetrieved(Messages);

}


export async function getUsers(usersRetrieved){
var Users=[];

var snapshot = await Firebase.firestore()
.collection('Users')


.get()


snapshot.forEach((doc) => {
const user = doc.data();
user.id = doc.id;
Users.push(user);

})
usersRetrieved(Users);
}
export async function getMessages(messagesRetrieved){
  var Messages = [];

  var snapshot = await Firebase.firestore()
    .collection('Messages')
   // .where('createdBy', '==',Firebase.auth().currentUser.email)

    .get()
    
  
  snapshot.forEach((doc) => {
    const message = doc.data();
    message.id = doc.id;
    Messages.push( message);
   
  })
  messagesRetrieved(Messages);

}
export  async function getSpots(spotsRetrieved){   
    var Spots = [];

  var snapshot = await Firebase.firestore()
    .collection('SkateSpots')
    .get()
  
  snapshot.forEach((doc) => {
    const spot = doc.data();
    spot.id = doc.id;
    Spots.push(spot);
   
  })
  spotsRetrieved(Spots);
}


export  async function getMySpots(spotsRetrieved){
    
  var Spots = [];

var snapshot = await Firebase.firestore()
  .collection('SkateSpots')
  .where('createdBy', '==',Firebase.auth().currentUser.uid)
  .get()

snapshot.forEach((doc) => {
  const spot = doc.data();
  spot.id = doc.id;
  Spots.push(spot);
 
})
spotsRetrieved(Spots);
}
export async function uploadSpot(spot, onSpotUploaded, {updating}){
  if (spot.imageUri){
    const fileExtension = spot.imageUri.split('.').pop();
    
    var uuid = Math.random();
    const fileName =  `${uuid}`
    const response = await fetch(spot.imageUri)
    var storageRef =Firebase.storage().ref(`skatespots/${fileName}`);
  
    const blob= await response.blob();
    storageRef.put(blob).then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {

    spot.image = url;
    delete spot.imageUri;

              if (updating) {
                console.log("Updating....");
                updateSpot(spot, onSpotUploaded);
              } else {
                console.log("adding...");
                addSpot2(spot, onSpotUploaded);
              }

});
  });
}
 else {

    delete spot.imageUri;

    if (updating) {
      console.log("Updating....");
      updateSpot(spot, onSpotUploaded);
    } else {
      console.log("adding...");
      addSpot2(spot, onSpotUploaded);
    }
  }
      }


