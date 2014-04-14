var spsApp = angular.module("spsApp", ["ngRoute", "spsControllers", "spsServices"]);

spsApp.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider.
          when('/home', {
              templateUrl: 'partials/home.html',
              controller: 'homeCtrl'
          }).
          when('/games/new', {
              templateUrl: 'partials/createGame.html',
              controller: 'newGameCtrl'
          }).
          when('/games', {
              templateUrl: 'partials/findGame.html',
              controller: 'findGameCtrl'
          }).
          when('/games/:gameId', {
              templateUrl: 'partials/game.html',
              controller: 'viewGameCtrl'
          }).
          when('/profile', {
              templateUrl: 'partials/profile.html',
              controller: 'profileCtrl'
          }).
          otherwise({
              redirectTo: '/home'
          });
    }
]);

document.addEventListener("deviceready", function () {
    var auth0 = new Auth0Client(
        "straightpoolscore.auth0.com",
        "DHiWNztSKgcxgmYq1rhvq6reTJyoj9nY");

    auth0.login(function (err, result) {
        if (err) return err;
        alert(result.profile.email);
        /* 
        Use result to do wonderful things, e.g.: 
            - get user email => result.profile.email
            - get facebook/google/twitter/etc access token => result.profile.identities[0].access_token
            - get Windows Azure AD groups => result.profile.groups
            - etc.
        */
    });
});
