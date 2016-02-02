angular.module('xcal.services', [])
    .factory("Auth", function($firebaseAuth) {
      var usersRef = new Firebase("https://torrid-heat-9411.firebaseio.com/users");
      return $firebaseAuth(usersRef);
    })