# Water_System Using ExpressJS
## Tech Used
- Backend - ExpressJS (NodeJS scafollding)
- Frontend - Vanilla HTML, CSS, JavaScript, JQuery, AJAX
- UI - Bootstrap v5
- database - MySQL
 

## Setup
1. Open .env.example
2. Configure the DB part
3. Rename .env.example to .env
4. Configure the .env key/value pair to fit your credentials
5. run ```npm install```
6. run ```npm run start```
7. open http://localhost:3000 to browser


## Entry point:
- The server is ran using the server.js which will be found in the root directory.

## routes directory:
- responsible for routing, which is used by the server.js via the route.config.js
- adminRoute.js - handles routing for admin side
- publicRoute.js - handles routing for public side
- route.config.js - bootstraps routing to connect to server.js

## constants
- typically utilities used to encapsulate processes.
- dbCon.js - initializes the database connection
- dbConfig.js - handles the configuration for database which is used by dbCon.js.
- render-page.js - abstracts the dynamic rendering of the page for admin side.
## middleware
- directory meant to intercept requests if needed.
- errors.js - handles redirection to 404 page if route is not found.

## pages
- contains static file for html (please separate it by folder, depending on the context)
- admin directory - responsible for administrative UI
- public directory - responsible for public side UI
- 404.html - static page on the outside since it is a constant
- template.html - base html file used to scaffold each pages.
- login.html - static page for login page, utilizes template.html
## uploads
- contains static file/asset such as image, videos, etc.

## package.json
 - do not delete, this determines the dependencies involved.