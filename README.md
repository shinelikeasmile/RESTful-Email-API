# RESTful-Email-API
- RESTful-Email-API sends emails using Gmail REST API and OAuth 2.0 without using client libraries.

## step 1 :
- clone this repository and go to the project directory in terminal

## step 2 :
- npm install

## step 3 :
- go to project directory manually and open server.js in a text editor 
- you will find client_id and client_secret variables where you need to enter your project credentials
- ( note : keep redirect_url as "http://localhost:8080" while creating the credentials for your project in Google API console )
- ( tip : search #CHANGE to easily find the variables)

## step 4 :
- npm start 

## step 5 :
- endpoint to authorize your server
-  http://localhost:8080/authorize

## step 6 :
-  endpoint to send email
-  it should be a post request with JSON object having properties 1) to 2) subject 3) message
-  localhost:8080/email 
-  ![postman example](https://github.com/shinelikeasmile/RESTful-Email-API/blob/master/a.png)
