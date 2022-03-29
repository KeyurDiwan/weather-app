const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
let extra = document.getElementById('extra');

let welcomeText = document.getElementById('welcome-text')
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const inputField = document.querySelector( 'input' );
document.body.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC3uZvPVFUJogYtNeWDK2-3o8lHoIjtI6qLA&usqp=CAU')";



function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000);
}

function hideLoading() {
    loader.classList.remove("display");
}

inputField.addEventListener( "keyup", getSearchBoxData );
const loader = document.querySelector("#loading");

function getSearchBoxData(e) {


 

   
        // when user press enter key check input value is not empty..! 
        if ( e.key == "Enter" && inputField.value != "" ) {
            // console.log("enter key Pressed..!!");
    
            displayLoading()
            requestApi(inputField.value);
    
        }
  


}


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    // timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    // dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
          
        
        console.log(data)
        showWeatherData(data);
        })

    })
}


function requestApi( city ) {
    //  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
    fetch( `https://api.openweathermap.org/data/2.5/weather?q=${ city }&appid=${ API_KEY }` ).then( res => res.json() ).then( data => {

        hideLoading()
        let latitude = data.coord.lat;
        let longitude = data.coord.lon;

        findByCity(latitude,longitude )

    } );

 
}

function findByCity( latitude, longitude ) {
    // console.log( latitude, longitude )
     fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })
}

function showWeatherData (data){
  
    console.log("temp:",data.current.temp);

    let tempForBack = data.current.temp;
    hideLoading()
    if(tempForBack < 30) {
        document.body.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGBn_D8xf2kW6v47Rv9RhjZJUiJDo5lcGXXw&usqp=CAU')";
    }

    if(tempForBack > 30 && tempForBack < 32) {

        document.body.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThygWvQWA3Bij3wiFip63NqM6sZbAOBDyIeA&usqp=CAU')";
    }
    if(tempForBack > 32) {

        document.body.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkrvx-VgLDvYVi5XKXxYNRuALox0loJVuZ3g&usqp=CAU')";
    }
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    // timezone.innerHTML = data.timezone;
    // countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;

   
    extra.appendChild(currentWeatherItemsEl);
    welcomeText.remove();

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
       
        if(idx == 0){
            otherDayForcast += `
            <div class="weather-forecast-item-current">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })





    weatherForecastEl.innerHTML = otherDayForcast;
}