angular.module('xcal.controllers', [])
    .controller('AppCtrl', appCtrl)
    .controller('DashCtrl', dashCtrl)
    .controller('LoginCtrl', loginCtrl)
    .controller('LogoutCtrl', logoutCtrl)
    .controller('OrdersCtrl', ordersCtrl)
    .controller('PaymentCtrl', paymentCtrl)
    .controller('ProfileCtrl', profileCtrl)
    .controller('SignupCtrl', signupCtrl)
    .controller('VehicleCtrl', vehicleCtrl);


function appCtrl($scope) {
    $scope.user = {};
}


function dashCtrl($rootScope, $scope, $state, User, Order) {

    var userData;
    //User.getCurrentUser(function(result) {
    //    userData = result;
    //});



    $scope.$on('$ionicView.enter', function(){
        if(!$rootScope.authData) {
            $state.go('app.login');
        }
        else {
    
    
        /*
        var review: {
            toId: '',
            fromId: '',
            vehicleId: '',
            createdAt: '',
            rating: '',
            comments: ''
        }
        */
            $scope.orders = [];
            User.getOrders(function(data) {
                var count = data.length;
                if(count == 0)
                    $scope.message = "There are no orders to display";
                while(count--) {
                    Order.getById(data[count], function(order) {
                        $scope.orders.push(order);
                        $scope.$apply();
                    });
                }


            });
        }
    });



    
}

function loginCtrl($rootScope, $scope, User, $state, $ionicLoading) {

    if($rootScope.authData)
        $state.go('app.dash');

    $scope.login = Login;

    function Login() {
        if(!$scope.user.email)
            $scope.message = "Please enter email";
        else if(!$scope.user.password)
            $scope.message = "Password can not be empty";
        else {
              $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
              });
            User.auth({email: $scope.user.email, password: $scope.user.password}, function(response) {
                $ionicLoading.hide();
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

function ordersCtrl($scope, User) {

}

function profileCtrl($scope) {

}

function signupCtrl($scope, User, $ionicLoading, $firebaseArray, $cordovaBarcodeScanner, $state, $cordovaCamera) {
    $scope.$on('ionicView.enter', function() {
        $scope.message = "";
        clearForm();
    });

    //$scope.profilePicArray = User.profilePic();




    var clearForm = function() {
        $scope.user.password = "";
        $scope.user.email = "";
        $scope.user.confirmPassword = "";

    }

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            profilePicArray.$add({image: imageData}).then(function() {
                console.log('Image has been uploaded');
            });
        }, function(error) {
            console.error(error);
        });
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
            $state.go('app.signup1');

        }
    }

    $scope.signup1 = function() {
        if(!$scope.user.rollNo ) {
            $scope.message1 = "Please scan the roll number";
        }
        else if(!$scope.user.phone ) {
            $scope.message1 = "Please fill phone number";
        }
        else {
            $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
            User.create({email: $scope.user.email, password: $scope.user.password}, function(result) {
                console.log(result);
                $scope.message = result.message;

                User.firstTimeSignup($scope.user, result, function(error) {
                    if(error) {
                        $scope.message1 = "Something went wrong";
                        $ionicLoading.hide();
                    }
                    else {
                        $scope.message1 = "Signup successful";

                        User.auth({email: $scope.user.email, password: $scope.user.password}, function(response) {
                            $ionicLoading.hide();
                            if(response.status) {

                                $rootScope.authData = response.authData;
                                $rootScope.$apply();
                                $state.go('app.dash');
                            }
                            else {
                                $scope.message = "Please check your email and password.";
                                $ionicLoading.hide();
                            }
                        });

                    }
                });

                $scope.$apply();
            });

        }
    }

    $scope.scanBarCode = function() {
        $cordovaBarcodeScanner.scan().then(function(data) {
            console.log(data);
            $scope.user.rollNo = data.text;
        }, function(error) {
                $scope.message = "Please try again"; 
        });
    }
}

function vehicleCtrl($scope, $state, User, $ionicPopup, Vehicle, $rootScope, $ionicLoading) {
    

    $scope.typeOfVehicles = User.typeOfVehicles;
    $scope.selectWeekDays = selectWeekDays;
    $scope.selectedVehicle = $scope.typeOfVehicles[0];
    $scope.addVehicleFinal = addVehicleFinal;
    $scope.addVehicleStep2 = addVehicleStep2;
    $scope.addVehicleStep3 = addVehicleStep3;
    $scope.loadAfterSearchResults = loadAfterSearchResults;
    $scope.loadBookPage = loadBookPage;
    $scope.searchCars = searchCars;
    $scope.searchBikes = searchBikes;
    $scope.searchBiCycles = searchBiCycles;


    $scope.vehicle = User.addNewVehicle;

    function selectWeekDays() {
        var weekDaysPopup = $ionicPopup.show({
            templateUrl: 'templates/weekDaysSelect.html',
            title: 'Select weekdays for this vehicle',
            scope: $scope,
            buttons: [
              {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    //return $scope.vehicle.rentDate.weekDays;
                  }
                
              }
            ]
        });
        weekDaysPopup.then(function(res) {
            console.log($scope.vehicle.rentData.weekDays);
        });
    };

    $scope.startTimePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      format: 24,  //Optional
      titleLabel: 'Start Time',  //Optional
      setLabel: 'Select',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var selectedTime = new Date(val * 1000);
            $scope.vehicle.rentData.startTime.hours = selectedTime.getUTCHours();
            $scope.vehicle.rentData.startTime.minutes = selectedTime.getUTCMinutes();
            console.log(selectedTime.getUTCHours() , selectedTime.getUTCMinutes());   
        }
      }
    };
    $scope.endTimePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      format: 24,  //Optional
      titleLabel: 'End Time',  //Optional
      setLabel: 'Select',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var selectedTime = new Date(val * 1000);
            $scope.vehicle.rentData.endTime.hours = selectedTime.getUTCHours();
            $scope.vehicle.rentData.endTime.minutes = selectedTime.getUTCMinutes();
        }
      }
    };
    

    function addVehicleFinal() {
        if(!$scope.vehicle) {
            $scope.message = "Please give some details";
        }
        else {
            $scope.message = "";
            if(!$scope.vehicle.location)
                $scope.message = "Please specify a pickup and drop location";
            else {
                console.log($scope.vehicle);
                User.addVehicle(function(result) {
                    $scope.message = "Added successfully";
                });
            }
        }

    }

    function addVehicleStep3() {
        if(!$scope.vehicle) {
            $scope.message = "Please give some details";
        }
        else {
            if(!$scope.vehicle.rate)
                $scope.message = "Please specify a rent rate";
            else if(!$scope.vehicle.mileage)
                $scope.vehicle.message = "Mileage";
            else if(!$scope.vehicle.rentData.startTime.hours)
                $scope.message = "Please select shift begin time";
            else if(!$scope.vehicle.rentData.endTime.hours) 
                $scope.message = "Please select shift end time";
            else {
                $state.go('app.addVehicle3')
            }
        }

    }

    function addVehicleStep2() {
        if(!$scope.vehicle)
            $scope.message = "Please enter something";
        else {
            if(!$scope.vehicle.manuf)
                $scope.message = "Invalid manufacturer";
            else if(!$scope.vehicle.model)
                $scope.message = "Invalid model";
            else {
                $scope.vehicle.ownerId = User.getUID()
                $scope.vehicle.type = $scope.selectedVehicle.value; 
                $scope.message = "";
                $state.go('app.addVehicle2');

            }
        }
    }

    function loadBookPage() {
        //request for payment through payment gateway
        $state.go('app.cardDetails');
    }

    function loadAfterSearchResults(data) {
        console.log(data);
        $rootScope.afterSearchDetails = data;
        User.getById(data.ownerId, function(user) {
            $rootScope.afterSearchDetails.userData = user; 
            $state.go('app.afterSearchDetails');    
        });
        
    }

    function searchCars() {
        $ionicLoading.show({
            content: '',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        
        Vehicle.getCars(function(cars) {
            $ionicLoading.hide();
            $rootScope.searchResults = cars;
            $state.go('app.vehicle-search-results');
        });
    }

    function searchBikes() {
        $ionicLoading.show({
            content: '',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        Vehicle.getBikes(function(bikes) {
            $ionicLoading.hide();
            $rootScope.searchResults = bikes;
            $state.go('app.vehicle-search-results');
        });
    }

    function searchBiCycles() {
        $ionicLoading.show({
            content: '',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        Vehicle.getBiCycles(function(biCycles) {
            $ionicLoading.hide();
            $rootScope.searchResults = biCycles;
            $state.go('app.vehicle-search-results');
        });
    }
    
}

function paymentCtrl($scope, $http, User, Order, $rootScope, $state) {
    $scope.message = "";
    $scope.card = {
        number: null,
        expiry: null,
        cvc: null
    }
    $scope.addBalanceObject = {
        amount: null
    }


    $scope.addBalance = function() {
        console.log(parseInt($scope.addBalanceObject.amount, 10));
        if(!$scope.addBalanceObject.amount )
            $scope.message = "Invalid amount";
        else if(parseInt($scope.addBalanceObject.amount, 10) <=0)
            $scope.message = "Invalid amount";
        else {

        }

    }



    $scope.checkout = function() {
        var expiry = parseExpiry($scope.card.expiry);
        if(!Stripe.card.validateCardNumber($scope.card.number))
            $scope.message = "Invalid card";
        else if(!Stripe.card.validateExpiry(expiry.month, expiry.year))
            $scope.message = "Invalid Expiry";
        else if(!Stripe.card.validateCVC($scope.card.cvc))
            $scope.message = "Invalid CVC";
        else {
            Stripe.createToken({    
                "number": $scope.card.number,
                "exp_month": expiry.month,
                "exp_year": expiry.year,
                "cvc": $scope.card.cvc
                
            }, function(status, response) {
                if(response.error) {
                    $scope.message = response.error.message;
                    $scope.$apply();
                }
                else {
                    
                    $http({
                        method: 'POST',
                        url: 'https://api.stripe.com/v1/charges',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization : 'Bearer sk_test_U47MZKB8vxeG6vjCtBsMX7a7'
                        },
                        transformRequest: function(obj) {
                            var str = [];
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            amount: 6000,
                            currency: 'inr',
                            source: response.id,
                            description: "Test charge"
                        }
                    }).then(function (res) {
                        if(res.error)
                            $scope.message = "Something went wrong";
                        else {

                            $scope.message ="Payment successful.";
                            orderObj = {
                                fromId: $rootScope.authData.uid,
                                toId: $rootScope.afterSearchDetails.ownerId,
                                vehicleId: $rootScope.afterSearchDetails.id,
                                rentData: $rootScope.afterSearchDetails.rentData,
                                location: $rootScope.afterSearchDetails.location,
                                model: $rootScope.afterSearchDetails.model,
                                manuf: $rootScope.afterSearchDetails.manuf,
                                type: $rootScope.afterSearchDetails.type
                            };
                            console.log(orderObj);
                            Order.newOrder(orderObj, function(err) {
                                if(err)
                                    $scope.message = "Something went wrong";
                                else  {
                                    $scope.message = "Order Successfully placed";
                                }
                                $scope.$apply();

                                $state.go('app.myOrders');
                            });
                        }
                    });
                }
            });
        }
    }

    function parseExpiry(value){
        var month, prefix, year, _ref;

        value = value || ''

        value = value.replace(/\s/g, '');
        _ref = value.split('/', 2), month = _ref[0], year = _ref[1];

        if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
          prefix = (new Date).getFullYear();
          prefix = prefix.toString().slice(0, 2);
          year = prefix + year;
        }

        month = parseInt(month, 10);
        year = parseInt(year, 10);
        
        return {
          month: month,
          year: year
        };
    }

    $scope.handleStripe = function(status, response){
      if(response.error) {
        $scope.message = response.error.message;
      } else {
        // got stripe token, now charge it or smt
        console.log(response.id);
      }
    }
}
