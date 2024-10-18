angular.module("myApp").controller("LoginController", [
  "$scope",
  "$location",
  "AuthService",
  function ($scope, $location, AuthService) {
    $scope.credentials = {};
    $scope.errorMessage = "";

    $scope.login = function () {
      console.log($scope.credentials);
      AuthService.login($scope.credentials)
        .then(() => {
          $location.path("/auth");
        })
        .catch((error) => {
          console.error("Login failed", error);
          $scope.errorMessage = error?.data?.message || "Login failed";
        });
    };
  },
]);
