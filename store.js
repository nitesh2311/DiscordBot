const { Client } = require('pg');
const logger = require('./logger');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//connect to DB
const connect_db = () => {
    return new Promise((resolve, reject)=>{
        client.connect((err)=> {
            if(!err){
                logger.info(`Connected to DB`);
                return resolve(true);
            }
            else{
                logger.error(`Error while connecting to DB : ${err.message}`);
                return reject(err);
            }
        });
    })
}

const INSERT_QUERY = "INSERT INTO discord_bot.search_history VALUES($1, $2);";
const SEARCH_QUERY = "SELECT DISTINCT searched_string FROM discord_bot.search_history WHERE user_id = $1 AND lower(searched_string) LIKE lower('%' || $2 || '%');"

//method to store search inside db
const storeSearch = async (searchString, userID) => {
    try{
        if(!client._connected){
            await connect_db();
        }
        client.query(INSERT_QUERY, [userID, searchString] , (err, res) => {
            if (err){
                logger.error(err.message);
            }
            return;
        }); 
    }
    catch(ex){
        logger.error(`Error while storing search into DB : ${ex.message}`);
        return;
    }    
}

//method to fetch search hisotry
const fetchSearches = (searchString, userID) => {
    return new Promise( async (resolve, reject) => {
        try{
            if(!client._connected){
                await connect_db();
            }
            client.query(SEARCH_QUERY, [userID, searchString], (err, res) => {
                if (err){
                    return reject(err.message)
                }
                //if no recent history found for this search
                if(res.rows.length==0){
                    return reject(`Recent searches not found for ${searchString}`);
                }
                else{
                    //return previously matched search strings 
                    return resolve(res.rows.reduce((a, b) => a+'\n'+b.searched_string,""));
                }
            });
        }
        catch(ex){
            logger.info(`Error while fetching previous search from DB : ${ex.message}`);
            return reject(ex.message);
        }
    })
}

module.exports = { storeSearch, fetchSearches }