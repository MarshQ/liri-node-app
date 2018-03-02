

var env= require("dotenv").config('');

var keys = require("./key.js");
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var fs = require('fs')
//var OMDB = "trilogy";

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
        case "spotify":
            sGenerate();
        case "movie":
            mGenerate();
        case "random":
        //    fs.readFile(__dirname + "/random.txt", function(err, data) {
        //     if (error) {
        //         return console.log(error);
        //       }
        //       var dataArr = data.split(",");
        //    });  
    }
})

function tGenerate() {
    //console.log("hello");
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
    inquirer.prompt([
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
    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to search for?",
            name: "movieTitle"
        }
    ]).then(function(user) {
        //console.log(user.movieTitle);
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
