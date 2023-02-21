console.log(firebase)
const auth = firebase.auth()
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');
const provider = new firebase.auth.GoogleAuthProvider();




/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();



// Auth

auth.onAuthStateChanged(user => {
  if (user) {
    //signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    document.getElementById('thingsList').hidden = false;
    document.getElementById('createThing').hidden = false;
    userDetails.innerHTML = `<h1>Welcome, ${user.displayName}</h1>`;



  } else {
    //not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    document.getElementById('thingsList').hidden = true;
    document.getElementById('createThing').hidden = true;
    userDetails.innerHTML = ``;
  }

});

//Firestore

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

  if (user) {

    thingsRef = db.collection('trucs')

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp()

      })
    }


    unsubscribe = thingsRef
      .where('uid', '==', user.uid)
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {
          return `<li>${doc.data().name}</li>`
        })
        thingsList.innerHTML = items.join('');

      })





  }

  else {
    unsubscribe && unsubscribe();
  }

})

//Query





