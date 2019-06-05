require("dotenv").config();
var fs = require("fs");
var moment = require('moment');
var axios = require("axios");

var command = process.argv[2];
var input = process.argv[3];

switch (command) {
  case "concert-this":
    concert();
    break;
  
  case "spotify-this-song":
    spotify();
    break;
  
  case "movie-this":
    movie();
    break;
  
  case "do-what-it-says":
    other();
    break;
  }

function concert(artist) {
    var artist = input;
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios
    .get(bandQueryURL)
    .then(
        function(response) {
            console.log("----------------");
            console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

            var logConcert = "-----Begin Concert Log Entry-----" + "\nName of the musician: " + artist + "\nName of the venue:"

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            }); 
      
        }
    )
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

}


function movie() {
  axios.get("http://www.omdbapi.com/?t=" + input + "&apikey=trilogy").then(
    function(response) {
      let OMDBresult = "-----------------------------------" +
      "\nTitle: " + JSON.stringify(response.data.Title) +
      "\nYear: " + JSON.stringify(response.data.Year) +
      "\nIMDB Rating: " + JSON.stringify(response.data.imdbRating) +
      "\nRotton Tomatoes Rating: " + JSON.stringify(response.data.Ratings[2].Value) +
      "\nLocation: " + JSON.stringify(response.data.Country) +
      "\nLanguage: " + JSON.stringify(response.data.Language) +
      "\nPlot: " + JSON.stringify(response.data.Plot) +
      "\nActors: " + JSON.stringify(response.data.Actors) +
      "\n---------------------------------------------------"
      console.log(OMDBresult)

      fs.appendFile("log.txt", OMDBresult, function(err) {

        if (err) {
          return console.log(err);
        }
        console.log("updated");
      });
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {

        console.log(error.request);
      } else {
      
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function spotify() {
  var Spotify = require('node-spotify-api');

  var spotify = new Spotify({
  id: '69a8fe5f2f1748d38fc5b1bd0cfcb487',
  secret: '5cf553215d084f53b79cc2c3ec51b11d'
  });

  spotify.search({ type: 'track', query: input, limit:1}, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  var spotifyResponse = 
  (
    "\n" + "-----------------------------------" +
    "\n" + "Artists: " + JSON.stringify(data.tracks.items[0].artists[0].name) +
    "\n" + "Song Name: " + JSON.stringify(data.tracks.items[0].name) +
    "\n" + "Album: " + JSON.stringify(data.tracks.items[0].album.name) +
    "\n" + "Preview Link from Spotify: " + JSON.stringify(data.tracks.items[0].artists[0].external_urls.spotify) +
    "\n" + "-----------------------------------" 
    );
  console.log(spotifyResponse);

      fs.appendFile("log.txt", spotifyResponse, function(err) {

        if (err) {
          return console.log(err);
        }
     
        console.log("");
      });
  });
  
}

function other() {

  fs.readFile("random.txt", "utf8", function(error, data) {

  if (error) {
    return console.log(error);
  }

  console.log(data);

  var dataArr = data.split(",");

  console.log(dataArr[0]);
  console.log(dataArr[1])
 
  command = dataArr[0];
  input = dataArr[1];

  switch (command) {
    case "concert-this":
      concert();
      break;
    
    case "spotify-this-song":
      spotify();
      break;
    
    case "movie-this":
      movie();
      break;
    
    case "do-what-it-says":
      other();
      break;
    }
  });
}
