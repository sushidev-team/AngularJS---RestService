# RESTful - AngularJS Service
An AngularJS service for using RESTful Webservices with an build-in auto-mechanism for detecting access tokens.
### Version
0.0.1.1

### Installation

#### Step 1

```sh
$ bower install ambersive-rest
```
#### Step 2
You first have to declare the 'ambersive.rest' module dependency inside your app module (perhaps inside your app main module).

```sh
angular.module('app', ['ambersive.rest']);
```
### Useage

```sh
angular.module('app').controller('DemoController', function($scope, RestSrv) {

    // GET

    RestSrv.call({
        'method': 'GET',
        'url': 'httP://api.example.com/users/1'
    },function(result){
        // result = object {'status':STATUSCODE (integer),'data':OBJECCT}
    });

    // POST

    RestSrv.call({
        'method': 'POST',
        'url': 'httP://api.example.com/users/1',
        'data':OBJECT/ARRAY
    },function(result){
        // result = object {'status':STATUSCODE (integer),'data':OBJECCT}
    });

    // PUT

    RestSrv.call({
        'method': 'PUT',
        'url': 'httP://api.example.com/users/1',
        'data':OBJECT/ARRAY
    },function(result){
        // result = object {'status':STATUSCODE (integer),'data':OBJECCT}
    });

    // DELETE

    RestSrv.call({
        'method': 'DELETE',
        'url': 'httP://api.example.com/users/1'
    },function(result){
        // result = object {'status':STATUSCODE (integer),'data':OBJECCT}
    });

});
```

### Configuration

You an configurate few things like storageName, tokenName etc.
#### tokenName 
This value determine the name of the access token. 
```sh
RestSrv.config.auth.tokenName = 'NAME'; // Default value: accessToken
```
#### tokenType 
This value determine the tokenType of the access token. 
```sh
RestSrv.config.auth.tokenType = 'NAME'; // Default value: 'Bearer '
```
#### storeageName & storageValidDays 
This value determine the name of the cookie, in which the access token will be safed. 
```sh
RestSrv.config.auth.storageName = 'NAME'; // Default value: accessToken
RestSrv.config.auth.storageValidDays ='' // Default value: 7
```
### Error-Handling

This service provides an easy way to determine an error handling for 401 and 403 status codes.
If you want to set a error handler insert the following code.

```sh
RestSrv.config.errorHandling.on401 = function(callbackFN){
    // Insert here your code
    // Callback method fires the normal response mechanism
});
RestSrv.config.errorHandling.on403 = function(callbackFN){
    // Insert here your code
    // Callback method fires the normal response mechanism
});
```

License
----
MIT