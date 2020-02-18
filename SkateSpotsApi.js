import Firebase from "./config/Firebase";
import uuid4 from  'uuid/v4';

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
  console.log("Updating Spot in firebase");

  firebase.firestore()
    .collection('SkateSpots')
    .doc(spot.id).set(spot)
    .then(() => updateComplete(spot))
    .catch((error) => console.log(error));
}

export function addSpot2(spot , addComplete){
  firebase.firestore()
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
  });

  spotsRetrieved(Spots);
}


export function uploadSpot(spot, onSpotUploaded, {updating}){
  if (spot.imageUri){
    const fileExtension = spot.imageUri.split('.').pop();
    
    var uuid = uuid4();
    const fileName = `%{uuid}.${fileExtension}`;
    var storageRef =Firebase.storage().ref(`skatespots/images/${fileName}`);

    storageRef.putFile(spot.imageUri)
    .on(
      Firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot =>{
        

        if(snapshot.state === Firebase.storage.TaskState.SUCCESS){
          console.log('success');
        }

      },

      error=> {
        unsubscribe();
      },

      ()=> {
        storageRef.getDownloadURL()
        .then((downloadUrl) => {

          if(updating){
            console.log('updating...');
            updateSpo(spot, onSpotUploaded);

          }else{
            console.log("adding...");
            addSpot2(spot,onSpotUploaded);
          }

        })
      }

      
    )
 
 
  }
}