angular.module('xcal.controllers', [])
    .controller('AppCtrl', appCtrl)
    .controller('LoginCtrl', loginCtrl)
    .controller('SignupCtrl', signupCtrl);


function appCtrl($scope) {
    $scope.user = {};
}

function loginCtrl($scope, User) {

    $scope.login = function() {
        if(!$scope.user.email)
            $scope.message = "Please enter email";
        else if(!$scope.user.password)
            $scope.message = "Password can not be empty";
        else {
            User.auth({email: $scope.user.email, password: $scope.user.password}, function(response) {
                if(response.status)
                    $scope.message = "You have successfully logged in.";
                else
                    $scope.message = "Please check your email and password.";
            });
        }
    }
}

function signupCtrl($scope, User) {
    var clearForm = function() {
        $scope.user.password = "";
        $scope.user.email = "";
        $scope.user.confirmPassword = "";

    }

    $scope.signup = function() {
        if(!$scope.user.fullname) {
            $scope.message = "Please enter a name";
            clearForm();
        }
        else if(!$scope.user.email) {
            $scope.message = "Please enter an email address";
            clearForm();
        }
        else if(!$scope.user.password) {
            $scope.message = "Please enter a password";
            clearForm();
        }
        else if(!$scope.user.confirmPassword) {
            $scope.message = "Please confirm your password";
            clearForm();
        }
        else if($scope.user.password != $scope.user.confirmPassword) {
            $scope.message = "Passwords didn't match, please try again";
            clearForm();
        }
        else {
            User.create({email: $scope.user.email, password: $scope.user.password}, function(result) {
                console.log(result.message);
                $scope.message = result.message;
                $scope.$apply();
            });

        }
    }
}
