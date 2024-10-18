angular.module("myApp").controller("RegisterController", [
  "$scope",
  "$location",
  "AuthService",
  function ($scope, $location, AuthService) {
    $scope.user = {};
    $scope.errorMessage = "";

    // Register function
    $scope.register = function () {
      AuthService.register($scope.user) // Call the register method in AuthService
        .then(function () {
          // Redirect to login or authenticated page after successful registration
          $location.path("/login"); // Adjust as necessary
        })
        .catch(function (error) {
          $scope.errorMessage = error?.data?.message || "Registration failed";
        });
    };
  },
]);
