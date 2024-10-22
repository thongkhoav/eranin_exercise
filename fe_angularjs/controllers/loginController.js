angular.module("myApp").controller("LoginController", [
  "$scope",
  "$location",
  "AuthService",
  function ($scope, $location, AuthService) {
    $scope.credentials = {};
    $scope.errorMessage = "";
    $scope.mfaEmailSent = false;

    $scope.login = function () {
      console.log($scope.credentials);
      if (AuthService.isAuthenticated()) {
        $location.path("/auth");
        return;
      }
      AuthService.login($scope.credentials)
        .then((response) => {
          console.log(response);
          $scope.mfaEmailSent = true;
          $scope.errorMessage = "";
          // $location.path("/auth");
        })
        .catch((error) => {
          console.error("Login failed", error);
          $scope.mfaEmailSent = false;
          $scope.errorMessage = error?.data?.message || "Login failed";
        });
    };
  },
]);
