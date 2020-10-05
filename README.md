## Discord bot for google search

#Start server

1. Create bot on discord and get the auth token from the bot add it in .env file
2. Get custom google api key and engine id from google and add into the .env file
3. Run `npm install` to install all the dependecies
4. Create table in Postgres DB and add the connection string in process environment variable

command to create table : `Create table search_history (user_id varchar(50), searched_string varchar(100), id serial primary key);`

command to add connection string: `set DATABASE_URL = <connection URL>`

5. Run `npm start` to start the server
6. Now bot will be up and running
7. Add bot to your discord server using bot's auth url

#Usage

1. Type '!Hi' in chat bot will respond as '!Hey'
2. Type '!google <search_string>' in chat bot will respond as 5 search result links of <search_string>
3. Type '!recent <searched_string>' in chat bot will respond as recent search history related to this <searched_string>