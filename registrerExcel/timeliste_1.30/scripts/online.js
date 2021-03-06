function Online() {
  var uid = '';
  const db = firebase.database().ref();
  var userDb = firebase.database().ref('userdatabase');


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
    } else {
      // No user is signed in.
    }
  });




  //functions
  this.pushTime = function(newList) {
    var dateCode = time.getDateCode();
    console.log(dateCode);
    db.child(uid).child(time.getDate().year).child(time.getDate().month.toLowerCase()).child(dateCode).set(newList);
  }


  this.checkPin = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(error.message);
      //
    });
  }
  this.getEmail = function(email) {
    let check = false;
    userDb.child('users').child('emails').on('value', snap => {
      var arr = snap.val();
      for(var item in arr) {
        if (email == arr[item]) {
          check = true;
        }
      }
    })
    return check;
  }
  this.getGroup = function() {
    var arr = [];
    db.child(uid).child('users').child('groups').on('child_added', snap => {
      arr.push(snap.val());
    })
    return arr;
  }

  this.getUrl = function() {
    return 'https://jarandkwesterheim.github.io/registrerExcel/timeliste_1.30/html/excel/excelformat.html?id='+uid;
  }

}
