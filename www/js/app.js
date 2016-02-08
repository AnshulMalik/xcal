// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('xcal', ['ionic', 'ngCordova', 'firebase', 'xcal.services', 'xcal.controllers'])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.addVehicle', {
        url: 'addVehicle',
        views: {
            'menuContent' : {
                templateUrl: 'templates/add-vehicle.html',
                controller: 'VehicleCtrl'
            }
        }
    })
    .state('app.dash', {
        url: '/dash',
        views: {
            'menuContent' : {
                templateUrl: 'templates/dash.html',
                controller: 'DashCtrl'
            }
        }
    })
    .state('app.login', {
        url: "/login",
        views: {
            'menuContent': {
                templateUrl: "templates/login-view.html",
                controller: 'LoginCtrl'
            }
        }

    })
    .state('app.logout', {
        url: '/logout',
        views: {
            'menuContent': {
                templateUrl: 'templates/logout.html',
                controller: 'LogoutCtrl'
            }
        }
    })
    .state('app.signup', {
      url: '/signup',
      views: {
        'menuContent': {
          templateUrl: 'templates/signup.html',
          controller: 'SignupCtrl'
        }
      }
    })
    .state('app.signup1', {
      url: '/signup1',
      views: {
        'menuContent': {
          templateUrl: 'templates/signup1.html',
          controller: 'SignupCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise("/app/signup");
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
