

var env= require("dotenv").config('');
var keys = require("./key.js");
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var inquirer2 = require('inquirer');
var inquirer3 = require('inquirer');
var fs = require('fs')

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});


inquirer.prompt([
    {
        type: "list",
        message: "Hello what would you like to run",
        choices: ["tweets", "spotify", "movie", "random"],
        name: "whatWeDoing"   
    }
]).then(function(user){
    
    switch (user.whatWeDoing) {
        case "tweets":
            tGenerate();
            break;
        case "spotify":
            sGenerate();
            break;
        case "movie":
            mGenerate();
            break;
        case "random":
           //console.log("fudge");
           rGenerate(); 
           break;
    }

    // if (user.whatWeDoing == "tweets") {
    //     tGenerate();
    // }
    // else if (user.whatWeDoing == "spotify") {
    //     sGenerate();
    // }
    // else if (user.whatWeDoing == "movie") {
    //     mGenerate();
    // }
    // else if (user.whatWeDoing == "random") {
    //     rGenerate();
    // }
})

function tGenerate() {
    //console.log("hello 1");
    var params = {screen_name: '@MikariaSquirtle'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i=0; i<20; i++){
                console.log(i+1);
                console.log(tweets[i].text)
                console.log(tweets[i].created_at);
                console.log("-----------------")  
            }
            
         }
         else if (error) {
             console.log(error);
         }
    });
}

function sGenerate() {
    //console.log("hello 2");
    inquirer2.prompt([
        {
            type: "input",
            message: "What song would you like to search for?",
            name: "songTitle"
        }
    ]).then(function(user) {
        console.log(user.songTitle);
        var pickles = user.songTitle;
        if (user.songTitle == "") {
            pickles = "'The Sign' by Ace of Base ";
        };
        spotify.search({ type: 'track', query: pickles }, function(err, data) {
            
            if (err) {
              return console.log('Error occurred: ' + err);
            };
            console.log('Title: ' + data.tracks.items[0].name);
            console.log('Artist: ' + data.tracks.items[0].artists[0].name);
            console.log('Album: ' + data.tracks.items[0].album.name);
            console.log('Preview link: ' + data.tracks.items[0].preview_url); 
            

          });
    })

}

function mGenerate() {
    //console.log("hello 3");
    inquirer3.prompt([
        {
            type: "input",
            message: "What movie would you like to search for?",
            name: "movieTitle"
        }
    ]).then(function(user) {
        console.log(user.movieTitle);
        var alpha = user.movieTitle;
        if (alpha == "") {
            alpha = "Mr. Nobody";
        };
        var queryURL = "https://www.omdbapi.com/?t=" + alpha + "&y=&plot=short&apikey=trilogy";
        request(queryURL, function (error, status, response) {
        console.log('error:', error); 
        //console.log('statusCode:', status && status.statusCode); 
        //console.log(response);
        pieces = JSON.parse(response);
        console.log(pieces.Title); 
        console.log(pieces.Year); 
        console.log(pieces.Actors); 
        console.log(pieces.Country); 
        console.log(pieces.Language); 
        console.log(pieces.Ratings[0].Source + " " + pieces.Ratings[0].Value); 
        console.log(pieces.Ratings[1].Source + " " + pieces.Ratings[1].Value); 
        console.log(pieces.Plot);
});

    });
}

function rGenerate() {
    //console.log("hello 4");
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var info = data.split(",");
        var mission = info[0];
        var reward = info[1];
        console.log(mission);
        console.log(reward);

        switch (mission) {
            case "my-tweets":
                tGenerate();
                break;
            case "spotify-this-song":
                spotify.search({ type: 'track', query: reward }, function(err, data) {
                
                if (err) {
                return console.log('Error occurred: ' + err);
                };
                console.log('Title: ' + data.tracks.items[0].name);
                console.log('Artist: ' + data.tracks.items[0].artists[0].name);
                console.log('Album: ' + data.tracks.items[0].album.name);
                console.log('Preview link: ' + data.tracks.items[0].preview_url);
            }); 
                break;
            case "movie-this":
                var queryURL = "https://www.omdbapi.com/?t=" + reward + "&y=&plot=short&apikey=trilogy";
                request(queryURL, function (error, status, response) {
                console.log('error:', error); 
                //console.log('statusCode:', status && status.statusCode); 
                //console.log(response);
                pieces = JSON.parse(response);
                console.log(pieces.Title); 
                console.log(pieces.Year); 
                console.log(pieces.Actors); 
                console.log(pieces.Country); 
                console.log(pieces.Language); 
                console.log(pieces.Ratings[0].Source + " " + pieces.Ratings[0].Value); 
                console.log(pieces.Ratings[1].Source + " " + pieces.Ratings[1].Value); 
                console.log(pieces.Plot);
                
            });
            break;  
        };
    
   }); 
};
 

  