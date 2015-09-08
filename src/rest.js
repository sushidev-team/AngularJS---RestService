/**
 * RESTful Service for AngularJS
 * @version v0.0.1
 * @link http://www.ambersive.com
 * @licence MIT License, http://www.opensource.org/licenses/MIT
 */

angular.module('ambersive.rest',[]);

angular.module('ambersive.rest').factory('RestSrv',['$http','$log',
    function($http,$log){

        var RestSrv = {};

        /**
         * Configuration
         * @type {{auth: {storageName: string, storageValidDays: number, tokenName: string, tokenType: string}, contentType: string, errorHandling: {on401: Function, on403: Function}}}
         */
        RestSrv.config = {
            'auth':{
                'storageName':'accessToken',
                'storageValidDays':7,
                'tokenName':'accessToken',
                'tokenType':'Bearer '
            },
            'contentType':'application/json; charset=utf-8;',
            'errorHandling':{
                'on401':function(callback){
                    // overwriteable
                    if(callback){callback();}
                },
                'on403':function(callback){
                    // overwriteable
                    if(callback){callback();}
                }
            }
        };

        /**
         * Helper function for handling responses
         */

        RestSrv.response = function(response,callback){
            if(callback){
                if(typeof(callback) === 'function'){
                    callback(response);
                } else {
                    return response;
                }
            } else {
                return response;
            }
        };

        /**
         * Helper functions
         * @type {{cookies: {get: Function, update: Function, delete: Function}}}
         */
        RestSrv.helper = {
            'cookies':{
                'get': function (cname, callback) {
                    var name = cname + '=',
                        response = '',
                        ca = document.cookie.split(';');

                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') c = c.substring(1);
                        if (c.indexOf(name) === 0) {
                            response = c.substring(name.length, c.length);
                        }
                    }
                    return RestSrv.response(response, callback);
                },
                'update': function (cname, cvalue, exdays, callback) {
                    var expires = '';
                    if (exdays === 0) {
                        expires = 'expires=0';
                    } else {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        expires = 'expires=' + d.toUTCString();
                    }
                    document.cookie = cname + '=' + cvalue + '; ' + expires+';path=/';
                    return RestSrv.response(RestSrv.helper.cookies.get(cname), callback);
                },
                'delete': function (cname) {
                    RestSrv.helper.cookies.update(cname, '', -100);
                }
            }
        };

        /**
         * Loader-Function for the error-Handling while the Rest-Call
         * @type {{load: Function}}
         */
        RestSrv.errorHandling = {
            'load':function(statusCode){
                var fn;
                if(RestSrv.config.errorHandling['on'+statusCode] !== undefined){
                    fn = RestSrv.config.errorHandling['on'+statusCode];
                }
                return fn;
            }
        };

        /**
         * Authorization-Header Token
         * @type {{get: Function, set: Function}}
         */
        RestSrv.token = {
            'get':function(callback){
                var token = null;
                try {
                    token = RestSrv.helper.cookies.get(RestSrv.config.auth.storageName);
                    return RestSrv.response(token,callback);
                } catch(err){
                    return RestSrv.response(token,callback);
                }
            },
            'set':function(token){
                if(token !== null && token !== undefined && token !== '') {
                    RestSrv.helper.cookies.update(RestSrv.config.auth.storageName, token, RestSrv.config.auth.storageValidDays);
                }
            },
            'fromHeader':function(headers){
                if(headers(RestSrv.config.auth.storageName) !== undefined && headers(RestSrv.config.auth.storageName) !== null){
                    RestSrv.token.set(headers(RestSrv.config.auth.storageName));
                }
            }
        };

        /**
         * Set and get the authorization header
         * @type {{get: Function, set: Function}}
         */
        RestSrv.auth = {
            'get':function(callback){
                return RestSrv.response($http.default.headers.common.Authorization,callback);
            },
            'set':function(token,callback){
                var setAuth = false;
                if(token !== undefined && token !== null && token !== '') {
                    RestSrv.token.set(token);
                }

                RestSrv.token.get(function (token) {
                    if (token === undefined) {
                        token = null;
                    }
                    if (token !== null) {
                        try {
                            $http.defaults.headers.common[RestSrv.config.auth.tokenName] = RestSrv.config.auth.tokenType + token;
                        } catch(err){
                            $log.warn(err);
                        }
                        try {
                            $http.defaults.headers.common.Authorization = RestSrv.config.auth.tokenType + token;
                        } catch(err){
                            $log.warn(err);
                        }
                        setAuth = true;
                    }
                    return RestSrv.response(setAuth, callback);
                });
            }
        };

        /**
         * Request the Webservice
         * @param req ($http request object)
         * @param callback
         */
        RestSrv.call = function(req, callback){
            var response = {'status':412};
            try {

                if(req === undefined){
                    response.msg = '$http req object ist missing';
                    throw response;
                }

                RestSrv.auth.set();

                switch(req.method){
                    case 'DELETE':
                        if(req.headers === undefined){
                            req.headers = {};
                            req.headers['Content-Type'] = RestSrv.config.contentType;
                        }
                        break;
                }

                $http(req).success(function(data,status,headers,config){

                    response.status = status;
                    response.data = data;
                    $log.log(data);
                    if(data.status !== undefined){response.status = data.status;}
                    if(data.data !== undefined) { response.data = data.data;}

                    if(headers !== undefined){
                        RestSrv.token.fromHeader(headers);
                    }

                    switch(response.status){
                        case 401:
                        case 403:
                            var errorFN = RestSrv.errorHandling(response.status);
                            if(errorFN !== undefined){
                                if(typeof(errorFN) === 'function'){
                                    errorFN(function(){
                                        return RestSrv.response(response,callback);
                                    });
                                }
                            }
                            break;
                        case 500:
                            throw response;
                        default:
                            return RestSrv.response(response,callback);
                    }

                }).error(function(data,status,headers,config){
                    if(status === 0){status = 400;}
                    response.status = status;
                    if(data !== undefined && data !== null) {
                        if (data.status !== undefined) {
                            response.status = data.status;
                        }
                        response.data = data;
                        if (data.data !== undefined) {
                            response.data = data.data;
                        }
                    }
                    return RestSrv.response(response,callback);
                });

            } catch(err){
                response.status = 500;
                response.msg = err;
                return RestSrv.response(response,callback);
            }
        };

        return RestSrv;

}]);