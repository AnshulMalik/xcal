angular.module('xcal', ['ionic', 'ngCordova', 'ionic-timepicker', 'firebase', 'xcal.services', 'xcal.controllers', 'angularPayments'])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.addBalance', {
        url: '/addBalance',
        views: {
            'menuContent' : {
                templateUrl: 'templates/add-balance.html',
                controller: 'PaymentCtrl'
            }
        }
    })
    .state('app.addVehicle', {
        url: '/addVehicle',
        views: {
            'menuContent' : {
                templateUrl: 'templates/add-vehicle.html',
                controller: 'VehicleCtrl'
            }
        }
    })
    .state('app.addVehicle2', {
        url: '/addVehicle2',
        views: {
            'menuContent' : {
                templateUrl: 'templates/add-vehicle2.html',
                controller: 'VehicleCtrl'
            }
        }
    })
    .state('app.addVehicle3', {
        url: '/addVehicle3',
        views: {
            'menuContent' : {
                templateUrl: 'templates/add-vehicle3.html',
                controller: 'VehicleCtrl'
            }
        }
    })
    .state('app.afterSearchDetails', {
      url: '/afterSearchDetails',
      views: {
        'menuContent': {
          templateUrl: 'templates/after-search-details.html',
          controller: 'VehicleCtrl'
        }
      }
    })
    .state('app.cardDetails', {
      url: '/cardDetails',
      views: {
        'menuContent': {
          templateUrl: 'templates/card-details.html',
          controller: 'PaymentCtrl'
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
    .state('app.myOrders', {
        url: '/myOrders',
        views: {
            'menuContent': {
                templateUrl: 'templates/my-orders.html',
                controller: 'DashCtrl'
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
    })
    .state('app.vehicle-search-results', {
      url: '/vehicleSearchResults',
      views: {
        'menuContent': {
          templateUrl: 'templates/vehicle-search-results.html',
          controller: 'VehicleCtrl'
        }
      }
    })
    .state('app.wallet', {
        url: '/wallet',
        views: {
            'menuContent' : {
                templateUrl: 'templates/wallet.html',
                controller: 'PaymentCtrl'
            }
        }
    })
    .state('app.selectSearchVehicleType', {
      url: '/selectSearchVehicleType',
      views: {
        'menuContent': {
          templateUrl: 'templates/select-vehicle-type.html',
          controller: 'VehicleCtrl'
        }
      }
    })
    .state('landing', {
      url: '/landing',
      templateUrl: 'templates/landing.html',
      controller: 'AppCtrl'
      
    });

    $urlRouterProvider.otherwise("/landing");
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    Stripe.setPublishableKey('pk_test_0kQud90mccD8nyDvovjLrTXY');
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
