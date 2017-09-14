var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var command = process.argv[2];
var selection = process.argv.slice(3).join("+");


var client = new Twitter({
    consumer_key: keys.twitter_consumer_key,
    consumer_secret: keys.twitter_consumer_secret,
    access_token_key: keys.twitter_access_token_key,
    access_token_secret: keys.twitter_access_token_secret
});
var spotify = new Spotify({
    id: keys.spotify_id,
    secret: keys.spotify_secret
  });

function myTweets() {
    var params = {screen_name: 'OldKingKole'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        console.log("\n--------------\n")
        for(i = 0; i<tweets.length; i++) {
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
            console.log("\n--------------\n")
        }
    }
    });
}
function spotifyThisSong(selection) {
      spotify.search({ type: 'track', query: selection }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
      });
}

function movieThis(selection) {
    request("http://www.omdbapi.com/?apikey=40e9cece&t=" + selection, function(error, response, body) {
        
          // If the request was successful...
          if (!error && response.statusCode === 200) {
        
            // Then log the body from the site!
            console.log("\n--------------\n")
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Released);
            console.log(JSON.parse(body).Ratings[0].Value + " on IMDB");
            console.log(JSON.parse(body).Ratings[1].Value + " on Rotten Tomatoes");
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Awards);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);
            console.log("\n--------------\n")
          }
        });
}

function run(command, selection) {
    switch(command) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            if(selection != "") {
                spotifyThisSong(selection);
            }
            else {
                spotifyThisSong("the+sign");
            }
            break;
        case "movie-this":
            if(selection != "") {
                movieThis(selection);
            }
            else {
                movieThis("mr+nobody");
            }
            break;
        case "do-what-it-says":
            fs.readFile('random.txt', function(err, data) {
                spotifyThisSong(data);
            })
            break;
        default:
            console.log("please enter a valid command");
    }
}
run(command, selection);