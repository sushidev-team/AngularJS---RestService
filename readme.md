# RESTful - AngularJS Service
An AngularJS service for using RESTful Webservices
### Version
0.0.1

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
License
----
MIT