import Firebase from "./config/Firebase";
//import uuid4 from  'uuid/v4';

// export function addSpot (spot, addComplete){

//   Firebase.firestore()
//   .collection("SkateSpots")
//   .add( {name: spot.name, 
//     latitude:spot.latitude, 
//     longitude: spot.longitude, 
//     image: spot.image,
//     createdAt: Firebase.firestore.FieldValue.serverTimeStamp()
// }).then((data) => addComplete(data))
// }
export function updateSpot(spot, updateComplete) {
  spot.updatedAt = Firebase.firestore.FieldValue.serverTimestamp();
  console.log("Updating Spot in Firebase");

  Firebase.firestore()
    .collection('SkateSpots')
    .doc(spot.id).set(spot)
    .then(() => updateComplete(spot))
    .catch((error) => console.log(error));
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

      
 
 
  