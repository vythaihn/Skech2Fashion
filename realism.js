

let r, g, b;
let authPromise;
let database;
let rgbDiv;

let bodyElement;
let buttons = [];
let ready = false;
let dataSave;

var model;
var model_name;

var pic_name;
var timeoutHandle;

function getRandomImage(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomModel(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickColor() {
  r = floor(random(256));
  g = floor(random(256));
  b = floor(random(256));
  background(100, 100, 100);
  updateBodyBG();
}

function pickImage() {
  var pic = getRandomImage(1, 1759)
  var model = getRandomModel(6,7);
  pic_name = pic.toString();
  model_name = model.toString();
  var file_name = pic_name.concat(".png")

  const m = "model"
  var model_dir = m.concat(model_name)
  model_dir = model_dir.concat("/")

  model = model_dir.concat(file_name)

  console.log(model)

  //new code
  var storage = firebase.storage();

  var storageRef = storage.ref();
  var tangRef = storageRef.child(model);


  database = firebase.database();
  authPromise = firebase.auth().signInAnonymously();

  //createCanvas(256, 256).parent('#root');
  bodyElement = document.body;
  pickColor();

  let img;
  // First we sign in the user anonymously
  //firebase.auth().signInAnonymously().then(function() {
    // Once the sign in completed, we get the download URL of the image
  tangRef.getDownloadURL().then(function(url) {
    var img1 = document.getElementById("img1")
    img1.src = url;
    var img1 = select('#img1')
    //img1.mouseClicked(sendData)
    console.log("retrive!!!", url)
  }).catch(function(error) {
              // If anything goes wrong while getting the download URL, log the error
    console.error(error);
  });

}

function doHide(){
    select('#all').hide();
    select('#time').show();
}

function setup() {
  select('#time').hide();

  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyCPH_TvIxzyp3Yr8YJhjQ3FtdQQovCOREE",
    authDomain: "sketch2fashion.firebaseapp.com",
    databaseURL: "https://sketch2fashion.firebaseio.com",
    projectId: "sketch2fashion",
    storageBucket: "sketch2fashion.appspot.com",
    messagingSenderId: "688917954916",
    appId: "1:688917954916:web:dbfe30ce56da792066fa71",
    measurementId: "G-4F26EDTH1K"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();



  //createCanvas(256, 256).parent('#vy');


  //randomly choose an image point to show the user
  //changeImage();

  //rgbDiv = createDiv().parent('#root');
  bodyElement = document.body;

  pickImage();


  buttons.push(createButton('real').parent('#root').class('green-ish'));
  buttons.push(createButton('fake').parent('#root').class('red-ish'));



  ready = true;


  buttons[0].mouseClicked(sendData)
  buttons[1].mouseClicked(sendData)





  //rgbDiv.html(`R:${r} G:${g} B:${b}`);

  //buttons.push(createButton('red-ish').parent('#root').class('red-ish'));
  //buttons.push(createButton('green-ish').parent('#root').class('green-ish'));
  //buttons.push(createButton('blue-ish').parent('#root').class('blue-ish'));
  //buttons.push(createButton('orange-ish').parent('#root').class('orange-ish'));
  //buttons.push(createButton('yellow-ish').parent('#root').class('yellow-ish'));
  //buttons.push(createButton('pink-ish').parent('#root').class('pink-ish'));
  //buttons.push(createButton('purple-ish').parent('#root').class('purple-ish'));
  //buttons.push(createButton('brown-ish').parent('#root').class('brown-ish'));
  //buttons.push(createButton('grey-ish').parent('#root').class('grey-ish'));



  // Commenting out the loading of data for the webpage running
  // console.log("Retreiving data... (this can take a minute or two)");
  // loadData().then(data => {
  //   dataSave = data;
  //   console.log("Recieved data. To analyze", data.length, "entries, run: ");
  //   console.log("showSample(dataSave, 'red-ish')");
  //   console.log("or analyzeData(dataSave, ['red-ish', 'blue-ish'])");
  //   console.log("To clean the data by label and hue use: ");
  //   console.log("let green_data = cleanData(dataSave, 'green-ish', 60, 180)");
  //   console.log("For any help, please see the documentation above each function in the code!");
  // });
}

console.log(firebase)

async function sendData() {
   if(!ready) return;
   clearTimeout(timeoutHandle); 
   select('#time').hide();

   showLoading();
  // send this data to something?
  // send the data to firebase!
  let { user } = await authPromise;
  let colorDatabase = database.ref("realism");

  // Make an object with data in it
  var data = {
    uid: user.uid,
    image: pic_name,
    model: model_name,
    email: document.getElementById("textboxinput").value,
    label: this.html()
  };
  console.log(document.getElementById("textboxinput").value)
  console.log(this);
  console.log("B")
  console.log(data);

  let color = colorDatabase.push(data, finished);
  console.log("Firebase generated key: " + color.key);

  //Pick new color

  pickImage();

  // Reload the data for the page
  function finished(err) {
    if (err) {
      console.error("ooops, something went wrong.");
      console.error(err);
    } else {
      console.log('Data saved successfully');
      setTimeout(hideLoading, 2000);

    }
  }
  

}

function showLoading() {
  select('.loading').show();
  select('#all').hide();
  for (button of buttons) button.addClass("disabled");
  ready = false;
}

function hideLoading() {
  select('.loading').hide();
  select('#all').show();
  timeoutHandle = setTimeout("doHide()", 1000)
  //rgbDiv.html(`R:${r} G:${g} B:${b}`);
  for (button of buttons) button.removeClass("disabled");
  setTimeout(function(){ ready = true;} , 600);
}

function updateBodyBG(){
  bodyElement.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 1.0)`;
}
