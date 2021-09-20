// Added throttling to limit the number of API calls
const throttle = (fn, delay) => {

  let flag = true;
  return (...args) => {
    if(flag) {
      console.log((new Date()).getTime());
      fn(...args);
      flag = false;

      setTimeout(() => {
        flag = true;
      }, delay);
    }
  }
}

const getDistance = (cities) => {
  console.log('cities', cities);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: cities,
    redirect: 'follow'
  };

  fetch("https://nodejs--rest-api.herokuapp.com/get-distance", requestOptions)
    .then(response => {
      console.log('response', response);
      if(response.status === 400) {
        return "Error processing request, Try changing city name(s)";
      }
      return response.text();
    })
    .then(result => {
      console.log('result', result);
      document.getElementById("result").innerHTML = `<p>${result}</p>`;
      document.getElementById("result").style.textAlign = 'center';
    })
    .catch(error => {
      console.log('error', error);
      document.getElementById("result").innerHTML = `<p>${error}</p>`;
      document.getElementById("result").style.textAlign = 'center';
    });
}

document.getElementsByTagName("button")[0].addEventListener("click", throttle((e) => {
  e.preventDefault();
  const cityNames = document.getElementsByTagName("input");

  document.getElementById("result").innerHTML = `<p>Loading.....</p>`;
  document.getElementById("result").style.textAlign = 'center';

  if(!cityNames[0].value || !cityNames[1].value) {
    document.getElementById("result").innerHTML = `<p>City name cannot be empty</p>`;
    document.getElementById("result").style.textAlign = 'center';
    return;
  } else if(cityNames[0].value.toLocaleLowerCase() === cityNames[1].value.toLocaleLowerCase()) {
    document.getElementById("result").innerHTML = `<p>City names cannot be same</p>`;
    document.getElementById("result").style.textAlign = 'center';
    return;
  }

  const cities = JSON.stringify({
    "firstCity": cityNames[0].value,
    "secondCity": cityNames[1].value
  });

  getDistance(cities);
}, 500));