# order-summary-be

This project uses Nest.JS to create REST API Endpoints in the backend. These endpoints can be accessed by the frontend to retrieve data and hydrate the UI with the information. The backend also uses CORS to accept requests from frontend `localhost:3001`.

## Yarn

This project uses yarn and can be installed using npm: `npm install --global yarn`

To start the project use the command: `yarn start`

## Postman

Postman was one of the methods used to test the endpoints and see the data being returned. A Postman collection has been provided in this repository.

## Improvements
- **Connecting to a database** - Allows for better interaction with data in case updates to current data needs to be or leaving customers need to be removed.
- **Authentication of data** - Authentication to ensure all User IDs and User related data are accurate to reduce likelihood of `HTTP Status 400 BadRequest` errors due to invalid User Ids. 
