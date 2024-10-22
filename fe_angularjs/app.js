angular
  .module("myApp", ["ngRoute"])
  .config([
    "$routeProvider",
    "$httpProvider",
    function ($routeProvider, $httpProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/login.html",
          controller: "LoginController",
          resolve: {
            isAuthenticated: [
              "AuthService",
              "$location",
              "$q",
              function (AuthService, $location, $q) {
                if (AuthService.isAuthenticated()) {
                  $location.path("/auth");
                  return $q.reject("Already authenticated");
                }
              },
            ],
          },
        })
        .when("/auth", {
          templateUrl: "views/auth.html",
          controller: "AuthController",
          resolve: {
            isAuthenticated: [
              "AuthService",
              "$location",
              function (AuthService, $location) {
                if (!AuthService.isAuthenticated()) {
                  $location.path("/");
                }
              },
            ],
          },
        })
        .when("/verify-login", {
          templateUrl: "views/verify-login.html",
          controller: "VerifyLoginController",
        })
        .when("/register", {
          templateUrl: "views/register.html", // Path to your registration template
          controller: "RegisterController", // New controller for registration
        })
        .otherwise({
          redirectTo: "/",
        });

      // Register the interceptor
      $httpProvider.interceptors.push("AuthInterceptor");
    },
  ])
  .factory("AuthInterceptor", [
    "$q",
    "$window",
    "$injector",
    function ($q, $window, $injector) {
      return {
        // Intercepting the request
        request: function (config) {
          // Get the token from localStorage or any other storage method
          const token = $window.localStorage.getItem("accessToken");
          if (token) {
            // Add the token to the request headers
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },

        // Intercepting the response
        response: function (response) {
          // Handle response data if needed
          return response;
        },

        // Intercepting errors
        responseError: function (rejection) {
          const $http = $injector.get("$http");
          const $location = $injector.get("$location");
          const AuthService = $injector.get("AuthService"); // Inject AuthService

          if (rejection.status === 401) {
            // Call the refreshToken method from AuthService
            return AuthService.refreshToken().then(
              function (newToken) {
                // If refreshToken succeeds, retry the original request
                if (newToken) {
                  const config = rejection.config;
                  config.headers.Authorization = `Bearer ${newToken}`;
                  return $http(config);
                }
              },
              function (error) {
                if (error.status === 401) {
                  // If the refreshToken API returns 401, redirect to login
                  $window.localStorage.removeItem("accessToken");
                  $window.localStorage.removeItem("refreshToken");
                  $location.path("/");
                }
                return $q.reject(rejection);
              }
            );
          }

          return $q.reject(rejection);
        },
      };
    },
  ]);
