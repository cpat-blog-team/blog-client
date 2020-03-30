# CPAT blog client
The front end for a blogging web app to foster growth amongst the IBM CPAT team via the sharing of information. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Note: This App uses IBM App ID for authentication.

### For Running the app with App ID:
  1. Provision an instance of AppID on IBM cloud.
  2. Clone this repository to your local machine.
  3. Run touch cpat-blog/.env to create a file for you env variables.
  4. Follow steps here to get your IBM tokens for App ID https://cloud.ibm.com/docs/appid?topic=appid-obtain-tokens.
    
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

  5. Open the newly created .env file in a code editor and paste the following variables and save the file. 
    Note: you will have to fill in any value in <> with it's corresponding value from your IBM tokens.
    
    CLIENT_ID=<clientId>
    TENANT_ID=<tenantId>
    SECRET=<secret>
    AUTH_SERVER_URL=<oAuthServerUrl>
    REDIRECT_URI=http://localhost:3001/appid/callback

    Example .env file based on Example IBM tokens: 

      CLIENT_ID=c90830bf-11b0-4b65-bffe-9773f8703bad
      TENANT_ID=b42f7429-fc24-48ds-b4f9-616bcc31cfd5
      SECRET=YWQyNjdkZjMtMGRhZC00ZWRkLThiOTQtN2E3ODEyZjhkOWQz
      AUTH_SERVER_URL=https://us-south.appid.cloud.ibm.com/oauth/v4/b42f7429-fc24-48ds-b4f9-616bcb31cfd5
      REDIRECT_URI=http://localhost:3001/appid/callback

  6. Cd into the cpat-blog directory and run npm install.
  7. In your terminal run the command "npm run dev" and wait a minute until you see a file called bundle.js appear at the location cpat-blog/public/bundle.js.
  8. Once the bundle.js file has been compiled you can open a browser and head to http://localhost:3001/ to see the app.
  9. You can now make changes to the source code and webpack will rebuild your bundle for you, just wait for the new bundle to be compiled and refresh you browser to see the changes.

## Running the tests
"npm run tdd" Will run jest with the --watch flag
"npm test" Will just run jest once 

<!-- ## Deployment

...Add additional notes about how to deploy this on a live system... -->

<!-- ## Authors

* **Esther Baek** - *Initial work* - 
* **Napoleon Santana** - *Initial work* - 
* **Daniel Kim** - *Initial work* - 
* **Isaiah Santala** - *Initial work* - [Zaiah11](https://github.com/Zaiah11) -->
