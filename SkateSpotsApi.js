import Firebase from "./config/Firebase";
//import uuid4 from  'uuid/v4';

export function addReview(review){
  // id
  // - productId
  // - rating
  // - date (if needed)
  // - ip (if needed, e.g. to prevent double rating)
  // - etc
  Firebase.firestore()
  .collection('Reviews')
  .add(review)
  .then((snapshot)=>{
    review.id = snapshot.id;
    snapshot.set(review);
  }).then(()=> addComplete(review))
  

}

export const send  =messages => {
  let time;

  // Create a new date from the passed date time
      var hours = new Date().getHours();

  // Hours part from the timestamp
  // var hours = date.getHours();
  
  // Minutes part from the timestamp
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
export function updateSpot(spot, updateComplete) {
 // spot.updatedAt = Firebase.firestore.FieldValue.serverTimestamp();
  console.log("Updating Spot in Firebase");

  Firebase.firestore()
    .collection('SkateSpots')
    .doc(spot.id).set(spot)
    .then(() => updateComplete(spot))
    .catch((error) => console.log(error));
}

export function addTime(userTime){
  Firebase.firestore()
  .collection('Speeds')
  .add(userTime)
  .then((snapshot)=>{
    userTime.id = snapshot.id;
    snapshot.set(userTime);
  })

}
export  async function getTime(timeretrieved){
    
  var Speed = [];

var snapshot = await Firebase.firestore()
  .collection('Speeds')
  .where('name', '==',Firebase.auth().currentUser.email)
  .get()

snapshot.forEach((doc) => {
  const speed = doc.data();
  speed.id = doc.id;
  Speed.push(speed);
 
})
// console.log(Firebase.auth().currentUser.email);
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


// chatID = () => {
//   const chatterID = this.props.authUser.uid;
//   const chateeID = this.chateeUID;
//   const chatIDpre = [];
//   chatIDpre.push(chatterID);
//   chatIDpre.push(chateeID);
//   chatIDpre.sort();
//   return chatIDpre.join('_');
// };

// export const sendChatMessage = (chatID, chat) => {
//   return db
//     .collection('messages')
//     .doc(chatID)
//     .collection('chats')
//     .add(chat);
// };

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
 // console.log(Firebase.auth().currentUser.email);
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
// console.log(Firebase.auth().currentUser.email);
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
 // console.log(Firebase.auth().currentUser.email);
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
 // console.log(Firebase.auth().currentUser.email);
  spotsRetrieved(Spots);
}


export  async function getMySpots(spotsRetrieved){
    
  var Spots = [];

var snapshot = await Firebase.firestore()
  .collection('SkateSpots')
  .where('createdBy', '==',Firebase.auth().currentUser.email)
  .get()

snapshot.forEach((doc) => {
  const spot = doc.data();
  spot.id = doc.id;
  Spots.push(spot);
 
})
// console.log(Firebase.auth().currentUser.email);
spotsRetrieved(Spots);
}


export async function uploadSpot(spot, onSpotUploaded, {updating}){
  if (spot.imageUri){
    const fileExtension = spot.imageUri.split('.').pop();
    
    var uuid = Math.random();
    const fileName = `%{uuid}.${fileExtension}`;
    const response = await fetch(spot.imageUri)
    var storageRef =Firebase.storage().ref(`skatespots/${fileName}`);
  
   const blobh= await response.blob();
    storageRef.put(blobh)
    
    
   
 
          storageRef.getDownloadURL()
            .then((downloadUrl) => {
              console.log("File available at: " + downloadUrl);

              spot.image = downloadUrl;

              delete spot.imageUri;

              if (updating) {
                console.log("Updating....");
                updateSpot(spot, oSpotUploaded);
              } else {
                console.log("adding...");
                addSpot2(spot, onSpotUploaded);
              }
            })
        
      
  } else {
    console.log("Skipping image upload");

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

      
 
 
  