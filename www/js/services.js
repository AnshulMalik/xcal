angular.module('xcal.services', [])

    .factory('Vehicle', function() {

      var vehicle = {};
      var vehiclesRef = new Firebase("https://torrid-heat-9411.firebaseio.com/vehicles");

      vehicle.getCars = getCars;
      vehicle.getBikes = getBikes;
      vehicle.getBiCycles = getBiCycles;
      function getCars(callback) {
        cars = [];
        vehiclesRef.orderByChild("rate").on("value", function(snapshot) {
          snapshot.forEach(function(car) {
                
                carObject = {};
                carObject = car.val();
                carObject.id = car.key();
                if(carObject.type == 1)
                  cars.push(carObject);
            });
            callback(cars);
        });
      };
      function getBikes(callback) {
        bikes = [];
        vehiclesRef.orderByChild("rate").on("value", function(snapshot) {
          snapshot.forEach(function(bike) {
                
                bikeObject = {};
                bikeObject = bike.val();
                bikeObject.id = bike.key();
                if(bikeObject.type == 2)
                  bikes.push(bikeObject);
            });
            callback(bikes);
        });
      };
      function getBiCycles(callback) {
        biCycles = [];
        vehiclesRef.orderByChild("rate").on("value", function(snapshot) {
          snapshot.forEach(function(biCycle) {
                
                biCycleObject = {};
                biCycleObject = biCycle.val();
                biCycleObject.id = biCycle.key();
                if ( biCycleObject.type == 3 )
                  biCycles.push(biCycleObject);
            });
            callback(biCycles);
        });
      };
      return vehicle;
    })


    .factory("User", function($firebaseAuth, $rootScope) {
      var ref = new Firebase("https://torrid-heat-9411.firebaseio.com");
      var userRef = ref.child('users');
      var vehiclesRef = ref.child('vehicles')
      var user = {};

      user.addOrder = addOrder;
      user.typeOfVehicles = [
        { name: "Car", value: 1 },
        { name: "Bike", value: 2 },
        { name: "Bicycle", value: 3 }
      ]; 
      user.addOrderById = addOrderById;
      user.addToWallet = addToWallet;
      user.addVehicle = addVehicle;
      user.auth = Auth;
      user.create = Create;

      user.firstTimeSignup = firstTimeSignup;
      user.getUID = getUID;
      user.getCurrentUser = getCurrentUser; 
      user.getById = getById;
      user.getEmail = getEmail;
      user.getOrders = getOrders;
      user.getToken = getToken;
      user.getWalletAmount = getWalletAmount;
      user.isVerified = isVerified;
      user.profilePic = profilePic;
      user.unauth = Unauth;
      user.updateVehicles = updateVehicles;

      user.addNewVehicle = {
        manuf: null,
        model: null,
        rate: null,
        type: null,
        mileage: null,
        name: null,
        ownerId: null,
        rating: null,
        rentData:  {
          startTime: {
            hours: null,
            minutes: null
          },
          endTime: {
            hours: null,
            minutes: null
          }, 
          weekDays: [true, true, true, true, true, true, true]
        },
        createdAt: Firebase.ServerValue.TIMESTAMP,
        status: 1
      };

      var userData = {

        profile: {
            name: '',
            image: '',
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
        orders: 0,    // array
        vehicles: 0,  // array
        reviews: 0,   // array
        rating: 0,
        wallet: 0,
        createdAt: null
      };

      function addOrder(order, callback) {
          console.log("inside add order");
          var ref = userRef.child(getUID() + '/orders');
          var userOrders ;
          getOrders(function(data) {
            userOrders = data;
          
            if (userOrders == 0)
              userOrders = [order.id] ;
            else 
              userOrders.push(order.id);
            ref.set(userOrders, callback);
            
          });
      }

      function addOrderById(id, order, callback) {
          console.log("inside add order by id");
          getById(id, function(user) {
            toUser = user;
           
            var ref = userRef.child(id + '/orders');
            var userOrders = user.orders;
            if (userOrders == 0)
              userOrders = [order.id] ;
            else 
              userOrders.push(order.id);
            console.log(userOrders);
            ref.set(userOrders, callback);
            
          });
      }


      function addToWallet(amount, callback) {
          var ref = userRef.child(user.getUID() + "/wallet");
          var total = user.getWalletAmount() + amount;

          ref.set(total, function(error) {
            if(error)
              callback( {status: 0, message: "Something went wrong"} );
            else {
              callback( {status: 1, message: "Successfully added " + amount + " to your wallet"} )
            }
          });
      }

      function addVehicle(callback) {
          

          var newVehicleRef = vehiclesRef.push();

          newVehicleRef.set(user.addNewVehicle, function(error) {

            if(error)
              callback( { status: 0, message: "Something went wrong" } );
            else {

              user.getCurrentUser(function(data) {
                if(data.vehicles != 0) 
                  data.vehicles.push(newVehicleRef.key());
                else 
                  data.vehicles = [ newVehicleRef.key() ];

                user.updateVehicles(data.vehicles, function(error) {
                  if(error)
                    callback( { status: 0, message: "Something went wrong." } );      
                  else
                    callback( { status: 1, message: "Successfully added." } );
                });
                

              });
              
            }
          });

      }
      
      function Auth(userData, callback) {
          ref.authWithPassword(userData, function(error, authData) {
              if(error)
                callback({status: 0 });
              else {
                  callback({ status: 1, authData: authData });
              }
          });
      }

      function Create(userData, callback) {
          ref.createUser(userData, function(error, userData) {
              if (error) {
                switch (error.code) {
                  case "EMAIL_TAKEN":
                    callback({status: 0, messsage: "The email is already in use."});
                    break;
                  case "INVALID_EMAIL":
                    callback({status: 0, message: "Invalid email"});
                    break;
                  default:
                    callback({status: 0, message: "Oops.. Something went wrong.."});
                }
              } else {
                callback({status: 1, message: "You are registered successfully, please check your email for verification email.", 'userData': userData });
              }
            });
      }

      function firstTimeSignup(data, signUpData, callback) {

          userData.profile.name = data.fullname;
          userData.profile.email = data.email;
          userData.profile.mobile = data.phone;
          userData.profile.rollNo = data.rollNo;
          var uid = signUpData.userData.uid;
          userData.createdAt = Firebase.ServerValue.TIMESTAMP;
          userRef = userRef.child(uid);
          userRef.set(userData, callback);
      }


      function getById(id, callback) {
          ref = new Firebase('https://torrid-heat-9411.firebaseio.com/users/' + id);
          console.log(ref.toString());
          ref.once("value", function(snapshot) {
            callback(snapshot.val());
          });
      }

      function getCurrentUser(callback) {
          ref = new Firebase('https://torrid-heat-9411.firebaseio.com/users/' + $rootScope.authData.uid);
          ref.once("value", function(snapshot) {
            callback(snapshot.val());

          });
      }

      function getUID() {
        return $rootScope.authData.uid;
      }
      function getWalletAmount() {
          getCurrentUser(function(data) {
            return data.wallet;
          });
      }
      function getOrders(callback) {
          getCurrentUser(function(data) {
            console.log(data);
            callback(data.orders);
          });
      }
      function getToken() {
          return $rootScope.authData.token;
      }
      function getEmail() {
          return $rootScope.authData.password.email;
      }
      function isVerified() {
          return $rootScope.isVerified;
      }
      function profilePic() {
          var imageRef = userRef.child($rootScope.authData.uid + '/profile');
          var syncArray = $firebaseArray(imageRef.child("image"));
          return syncArray;
      }
      function Unauth() {
          ref.unauth();
      }
      function updateVehicles(vehicles, callback) {
        ref = userRef.child(user.getUID() + "/vehicles");
        ref.set(vehicles, callback);
      }
      return user;
    })

    .factory('Review', function( ) {

    })
    .factory('Order', [ 'User', function(User) {
      var order = {};

      /*
        Order status:
        Pending: When placed, not confirmed by lender
        Canceled: Either canceled by lender or taker
        Success: Accepted by lender
        Completed: After return of vehicle
      */
      var orderStatus = ['Pending', 'Canceled', 'Success', 'Completed'];
      var orderData = {
          id: null,
          createdAt: Firebase.ServerValue.TIMESTAMP,
          fromId: '',
          status: 0,
          toId: '',
          vehicleId: ''
      };
      var orderRef = new Firebase("https://torrid-heat-9411.firebaseio.com/orders");

      order.getById = function(id, callback) {
          var ref = orderRef.child(id);
          ref.once('value', function(snapshot) {
            callback(snapshot.val());
          })
      }
      
      order.newOrder = function(data, callback) {
          orderData.fromId = data.fromId;
          orderData.toId = data.toId;
          orderData.vehicleId = data.vehicleId;
          orderData.rentData = data.rentData;
          orderData.location = data.location;
          orderData.model = data.model;
          orderData.manuf = data.manuf;
          orderData.type = data.type;
          
          var newOrderRef = orderRef.push();
          var newOrderId = newOrderRef.key();
          orderData.id = newOrderId;
          newOrderRef.set(orderData, function(error) {
            console.log("first set");
            console.log(error);
            if(error)
              callback(error);
            else {
              User.addOrder(orderData, function(error) {
                console.log("second set (addOrder)");
                console.log(error);
                if(error)
                  callback(error);
                else {
                  
                  User.addOrderById(orderData.toId, orderData, function(error) {
                    console.log("third set( addBy Id)");
                    console.log(error);
                    if(error)
                      callback(error);
                    else
                      callback(false);
                  })
                }
              });

            }
          });


      }



      return order;
    }]);