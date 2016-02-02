angular.module('xcal.services', [])
    .factory("User", function($firebaseAuth) {
      var ref = new Firebase("https://torrid-heat-9411.firebaseio.com");
      var user = {};
      user.create = function(userData, callback) {
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
                    callback({status: 0, message: "Oops.. Something went wrong.."})
                }
              } else {
                callback({status: 1, message: "You are registered successfully, please check your email for verification email.", 'userData': userData });
              }
            });
      }
      user.auth = function(userData, callback) {
          ref.authWithPassword(userData, function(error, authData) {
              if(error)
                callback({status: 0 });
              else {
                  callback({ status: 1 })
              }
          });
      }
      return user;
    })
