angular.module("myApp").controller("VerifyLoginController", [
  "$scope",
  "$location",
  "$window",
  "AuthService",
  function ($scope, $location, $window, AuthService) {
    const uid = $location.search().uid;
    const token = $location.search().token;
    const expiredAt = $location.search().expired_at;

    if (token) {
      AuthService.verifyLogin(uid, token, expiredAt)
        .then(function (response) {
          console.log(response.data);
          const { accessToken, refreshToken } = response.data;
          if (accessToken && refreshToken) {
            $window.localStorage.setItem("accessToken", accessToken);
            $window.localStorage.setItem("refreshToken", refreshToken);
            console.log({ accessToken, refreshToken });
            // after 5s redirect to /auth
            $scope.successMessage =
              "Login successful. Redirecting to dashboard...";
            setTimeout(() => {
              $location.path("/auth");
              // clear query string
              $location.search({});
              $scope.$apply();
            }, 5000);
          }
        })
        .catch(function (error) {
          $scope.errorMessage = "Invalid or expired token.";
        });
      // console.log(token);
    } else {
      $scope.errorMessage = "No token found.";
    }
  },
]);
