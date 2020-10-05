const request = require('request');
const config = require('./config')
const logger = require("./logger");


const url = `https://www.googleapis.com/customsearch/v1?key=${config.google_api_key}&cx=${config.google_search_engine_id}`;


const search = (searchString) =>{
    //logger.info(`url to search : ${url}&q=${searchString}`);
    return new Promise((resolve, reject) => {
        request.get(`${url}&q=${searchString}`, function(err, result){
            try{
                if(err){
                    logger.error(`error in search of gSearch : ${err.message}`);
                    return reject(err.message);
                }
                else{
                    let items = JSON.parse(result.body).items; 
                    if(!items){
                        return reject('Coudn\'t find any link');
                    }
                    //get 5 items from search response
                    let five_items = items.length>5 ? items.splice(0,5) : items;
                    //get links from 5 items
                    let five_links = five_items.map((item) => item.link);
                    //accumulate all 5 links to single string 
                    let links = five_links.reduce((a,b) => a+'\n'+b )
                    return resolve(links);
                }
            }
            catch(ex){
                return reject(ex.message);
            }
        })
    });
    
}

module.exports = { search }