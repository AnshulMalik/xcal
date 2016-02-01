angular.module('xcal.services', [])
    .factory("Items", function($firebaseArray) {
      var itemsRef = new Firebase("https://torrid-heat-9411.firebaseio.com/items");
      return $firebaseArray(itemsRef);
    })
    .factory("Auth", function($firebaseAuth) {
      var usersRef = new Firebase("https://torrid-heat-9411.firebaseio.com/users");
      return $firebaseAuth(usersRef);
    })