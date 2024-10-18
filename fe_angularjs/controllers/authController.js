angular.module("myApp").controller("AuthController", [
  "$scope",
  "$location",
  "AuthService",
  function ($scope, $location, AuthService) {
    $scope.data = {};

    function fetchData() {
      AuthService.fetchProtectedData().then((response) => {
        console.log(response.data);
        $scope.data = response.data;
      });
    }

    fetchData();

    // Logout function
    $scope.logout = function () {
      AuthService.logout() // Call the logout function in AuthService
        .then(function () {
          // Redirect to login page after successful logout
          $location.path("/");
        })
        .catch(function (error) {
          console.error("Logout failed: ", error);
        });
    };
  },
]);
