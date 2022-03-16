var apiKey = '25e62c9368d5952a27ccbb9896435a18';

// let api;

const wrapper = document.querySelector( '.wrapper' );
const inputPart = wrapper.querySelector( '.input-part' );
const infoTxt = inputPart.querySelector( '.info-txt' );
const inputField = inputPart.querySelector( 'input' );
const locationBtn = inputPart.querySelector( 'button' );

inputField.addEventListener( "keyup", e => {

    // when user press enter key check input value is not empty..! 
    if ( e.key == "Enter" && inputField.value != "" ) {
        // console.log("enter key Pressed..!!");

        requestApi(inputField.value);
        
    }
} );


locationBtn.addEventListener( 'click', () => {
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition( onSucess, onError );
    } else {
        alert( 'Please enable location to access this..!!' )
    }
} );

function onSucess( position ) {
    // console.log(position)

    // getting lat and log...
    const { latitude, longitude } = position.coords;

   let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${ apiKey }`;

    fetchData(api);
}

function onError( error ) {
    // console.log(error)

    infoTxt.innerText = error.message;
    infoTxt.classList.add( 'error' );
}


function requestApi( city ) {
    // console.log( city );



// var geocoder = new google.maps.Geocoder();
// // var address = document.getElementById("address").value;
// geocoder.geocode( { 'address': address}, function(results, status) {
//   if (status == google.maps.GeocoderStatus.OK)
//   {
//       // do something with the geocoded result
//       //
//      let a =  results[0].geometry.location.latitude
//       let b = results[0].geometry.location.longitude

//       console.log(a,b)
//   }
// });

    // let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    // let api = `https://api.openweathermap.org/data/2.5/weather?lat=30&lon=35&appid=${ apiKey }`;
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetchData(api)
}

function fetchData(api) {
      infoTxt.innerText = "Getting weather details...!!!";
    infoTxt.classList.add( 'pending' );


    fetch( api ).then( response =>  response.json() ).then( res => weatherDetails( res ) );
}

function weatherDetails( info ) {
    
    if ( info.cod == '404' ) {

        infoTxt.classList.replace( 'pending', 'error' );
        infoTxt.innerText = `${ inputField.value } is not valid city name..!!`;
    } else {



        // fetching val from object
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;


        // passing val to html element

        wrapper.querySelector( '.temp .numb' ).innerText = Math.floor(temp);
        wrapper.querySelector( '.weather' ).innerText = description;
        wrapper.querySelector( '.location span' ).innerText = `${city}, ${country}`;
        wrapper.querySelector( '.temp .numb-2' ).innerText = Math.floor(feels_like);
        wrapper.querySelector( '.humidity span' ).innerText = `${humidity}%`;
        



        infoTxt.classList.remove( 'pending', 'error' );
        wrapper.classList.add( 'active' );
         console.log( info );

    }
   
   
}
 