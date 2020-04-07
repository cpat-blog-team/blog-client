# CPAT blog client
The front end for a blogging web app to foster growth amongst the IBM CPAT team via the sharing of information. 

## Prerequisites  
  This App is the front end for the cpat-blog-bff found here https://github.com/cpat-blog-team/cpat-blog-bff/.  
  Before starting this Getting Started. Make sure you have completed the "Getting Started/Installation Instructions" and "Start dev server" sections of the bff and have the bff running in a separate terminal on your computer.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### *** Note: This App uses IBM App ID for authentication. ***

### To run the app without App ID
  1. Clone this repository to your local machine.
  2. Cd into the cpat-blog directory and run npm install.
  3. Run the script "dev:no-auth" to run the app in the development environment with App ID disabled.
    - Note: You may have to wait up to a minute for webpack to build your bundles.js file. 
    - You can check if your bundle.js file has been created by running "ls public" once it's built you should see   
      ```bundle.js	index.html```
  4. Once the bundle.js file has been built. You can now make changes to the source code and webpack will rebuild your bundle for you, just wait for the new bundle to be compiled and refresh you browser to see the changes.

### To Run the app with App ID
  1. Provision an instance of AppID on IBM cloud.
  2. Clone this repository to your local machine.
  3. Cd into the cpat-blog directory and run npm install.
  4. With cpat-blog as your working directory, run the command "touch .env" to create a file for you env variables.
    - the location of the file should be cpat-blog/.env
  5. Follow steps in the link bellow to get your IBM tokens for App ID 
    - https://cloud.ibm.com/docs/appid?topic=appid-obtain-tokens.
    
    Example IBM tokens:
      {
        "clientId": "c90830bf-11b0-4b65-bffe-9773f8703bad",
        "tenantId": "b42f7429-fc24-48ds-b4f9-616bcc31cfd5",
        "secret": "YWQyNjdkZjMtMGRhZC00ZWRkLThiOTQtN2E3ODEyZjhkOWQz",
        "name": "testing",
        "oAuthServerUrl": "https://us-south.appid.cloud.ibm.com/oauth/v4/b42f7429-fc24-48ds-b4f9-616bcb31cfd5",
        "profilesUrl": "https://us-south.appid.cloud.ibm.com",
        "discoveryEndpoint": "https://us-south.appid.cloud.ibm.com/oauth/v4/b42f7429-fc24-48ds-b4f9-616bcb31cfd5/.well-known/openid-configuration"
      }

  6. Open the newly created .env file in a code editor and paste the following variables and save the file. 
    - Note: You will have to fill in any value in <> with it's corresponding value from your IBM tokens.
    
    CLIENT_ID=<clientId>
    TENANT_ID=<tenantId>
    SECRET=<secret>
    AUTH_SERVER_URL=<oAuthServerUrl>
    REDIRECT_URI=http://localhost:3001/appid/callback

    - Example .env file based on Example IBM tokens
        ```
        CLIENT_ID=c90830bf-11b0-4b65-bffe-9773f8703bad
        TENANT_ID=b42f7429-fc24-48ds-b4f9-616bcc31cfd5
        SECRET=YWQyNjdkZjMtMGRhZC00ZWRkLThiOTQtN2E3ODEyZjhkOWQz
        AUTH_SERVER_URL=https://us-south.appid.cloud.ibm.com/oauth/v4/b42f7429-fc24-48ds-b4f9-616bcb31cfd5
        REDIRECT_URI=http://localhost:3001/appid/callback
        ```

  7. Cd into the cpat-blog directory and run npm install.
  8. In your terminal run the command "npm run dev" and wait a minute until you see a file called bundle.js appear at the location cpat-blog/public/bundle.js.
  9. Once the bundle.js file has been compiled you can open a browser and head to http://localhost:3001/ to see the app.
  10. You can now make changes to the source code and webpack will rebuild your bundle for you, just wait for the new bundle to be compiled and refresh you browser to see the changes.

## Running the tests
"npm run tdd" Will run jest with the --watch flag
"npm test" Will just run jest once 

<!-- ## Deployment

...Add additional notes about how to deploy this on a live system... -->

## Authors

* **Esther Baek** - *Initial work* - [ebaek] (https://github.com/ebaek)
* **Napoleon Santana** - *Initial work* - [popcor255] (https://github.com/popcor255)
* **Daniel Kim** - *Initial work* - [dkayzee] (https://github.com/dkayzee)
* **Isaiah Santala** - *Initial work* - [Zaiah11](https://github.com/Zaiah11)
* **Ritu Patel** - *Initial work* - [rp06](https://github.com/rp06)
