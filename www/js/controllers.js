angular.module('xcal.controllers', [])
    .controller('AppCtrl', appCtrl);
    
    
function appCtrl($scope, Items) {
    $scope.items = Items;
    $scope.addItem = function() {
        var name = prompt("What do you need to buy?");
        if (name) {
          $scope.items.$add({
            "name": name
          });
        }
    };
}