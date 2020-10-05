var Discord = require('discord.io');
var config = require("./config");
var logger = require("./logger");
var gSearch = require("./gSearch");
var store = require("./store");


// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', async function (user, userID, channelID, message, evt) {
    //greetings
     if (message.toLowerCase().startsWith('!hi')){
        bot.sendMessage({
            to: channelID,
            message: 'Hey!'
        });
    }
    //google search
    if (message.toLowerCase().startsWith('!google')){
        let reply;
        try{
            var args = message.split(' ').splice(1);
            var searchString = args.reduce((a, b) => a+' '+b);
            //make a google search
            reply = await gSearch.search(searchString);
        }
        catch(ex){
            logger.error(ex);
            reply = 'Not able to search or couldn\'t find result';
        }
        finally{
            //store search string into db 
            //not calling this synchronously
            store.storeSearch(searchString, user);
        }
        bot.sendMessage({
            to: channelID,
            message: reply
        });
    }
    //recent suggestions from history
    if (message.toLowerCase().startsWith('!recent')){
        let reply;
        try{
            var args = message.split(' ').splice(1);
            var searchString = args.reduce((a, b) => a+' '+b);
            //fetch matched previous search strings
            reply = await store.fetchSearches(searchString, user);
        }
        catch(ex){
            logger.error(ex);
            reply = 'Not able to find recent search history';
        }
        bot.sendMessage({
            to: channelID,
            message: reply
        });
    }
});