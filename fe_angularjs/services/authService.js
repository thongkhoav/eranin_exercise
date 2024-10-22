angular.module("myApp").service("AuthService", [
  "$http",
  "$q",
  "$window",
  function ($http, $q, $window) {
    const apiUrl = "http://localhost:3000"; // Replace with your API URL

    this.login = function (credentials) {
      return $http.post(`${apiUrl}/api/auth/login`, credentials);
    };

    this.verifyLogin = function (uid, hash, expiredAt) {
      // Create the API URL with the query parameters
      const verificationUrl = `${apiUrl}/api/auth/verify-login?uid=${uid}&token=${hash}&expired_at=${expiredAt}`;

      // Perform the HTTP GET request to the backend server
      return $http.get(verificationUrl);
    };

    this.register = function (user) {
      return $http.post(`${apiUrl}/api/auth/register`, user);
    };

    this.logout = function () {
      return $http
        .post(`${apiUrl}/api/auth/logout`, {
          refreshToken: $window.localStorage.getItem("refreshToken"),
        })
        .then(() => {
          $window.localStorage.removeItem("accessToken");
          $window.localStorage.removeItem("refreshToken");
        });
    };

    this.isAuthenticated = function () {
      const token = $window.localStorage.getItem("accessToken");
      return token ? true : false;
    };

    this.refreshToken = function () {
      return $http
        .post(`${apiUrl}/api/auth/refresh-token`, {
          refreshToken: $window.localStorage.getItem("refreshToken"),
        })
        .then((response) => {
          const { accessToken } = response.data;
          $window.localStorage.setItem("accessToken", accessToken);
          return accessToken;
        });
    };

    this.fetchProtectedData = function () {
      return $http.get(`${apiUrl}/api/user`);
    };
  },
]);
