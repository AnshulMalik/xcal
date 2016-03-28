angular.module('xcal.controllers', [])
    .controller('AppCtrl', appCtrl)
    .controller('DashCtrl', dashCtrl)
    .controller('LoginCtrl', loginCtrl)
    .controller('LogoutCtrl', logoutCtrl)
    .controller('SignupCtrl', signupCtrl);


function appCtrl($scope) {
    $scope.user = {};
}


function dashCtrl($rootScope, $scope, $state, User) {
    /*$scope.$on('$ionicView.enter', function(){
        if(!$rootScope.authData) {
            $state.go('app.login');
        }
    });
    var order = {
        createdAt: '',
        fromId: '',
        status: ['pending', 'canceled', 'success'],
        toId: '',
        vehicleId: ''
    };

    var user = {
        profile: {
            name: '',
            email: '',
            mobile: '',
            rollNo: '',
            address: '',
            idCard: ''
        },
        isVerified: {
            phone: 0,
            email: 0,
            idCard: 0
        },
        orders: {

        },
        vehicles: {

        },
        reviews: {

        },
        rating: 0
    }

    var review: {
        toId: '',
        fromId: '',
        vehicleId: '',
        createdAt: '',
        rating: '',
        comments: ''
    }
    */
    $scope.addVehicle = addVehicle;
    function addVehicle() {
        var tempVehicle = {
            model: '',
            manufacturer: '',
            name: '',
            ownerId: '',
            createdAt: '',
            status: 1,
            rentData:  {
                startTime: '',
                endTime: '',
                weekDays: [1, 1, 1, 1, 1, 1, 1],
                location: ''
            },
            rating: 5,
            milage: 10
        };

        User.addVehicle({name: "hi"}, function(data) {
            console.log(data);
        });
    }
}

function loginCtrl($rootScope, $scope, User, $state) {

    if($rootScope.authData)
        $state.go('app.dash');

    $scope.login = Login;

    function Login() {
        if(!$scope.user.email)
            $scope.message = "Please enter email";
        else if(!$scope.user.password)
            $scope.message = "Password can not be empty";
        else {
            User.auth({email: $scope.user.email, password: $scope.user.password}, function(response) {
                if(response.status) {

                    $rootScope.authData = response.authData;
                    $rootScope.$apply();
                    $state.go('app.dash');
                }
                else
                    $scope.message = "Please check your email and password.";
            });
        }
    }




}

function logoutCtrl($rootScope, User, $state, $scope) {
    $scope.$on('$ionicView.enter', function(){
        if($rootScope.authData) {
            User.unauth();
            $rootScope.authData = null;
        }
        $state.go('app.login');
    });
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
