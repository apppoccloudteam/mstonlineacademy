'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('myAdminApp')
  .controller('MainCtrl', function($scope,mstAuth,$location,mstIdentity,$ocLazyLoad,$timeout,$rootScope,$state,adminServices) {
  		$scope.loading = true;
      var studentinfo = {};

      if(!$rootScope.authenticated) {
         $rootScope.identity = mstIdentity;
      }

  	 $scope.signout = function() {
		    mstAuth.logoutUser().then(function() {
		       window.location.href="/site/login";
		    })
  		}

     	$scope.$on('$viewContentLoaded', function(event) {
			$timeout(function() {
				    $ocLazyLoad.load(['vendor/iCheck/icheck.min.js','scripts/common/custom.js']);
			 },0);
	   });


     $scope.getDashoard = function(){
      	 adminServices.getUsersListTotal()
            .then(function (response) {
                $scope.totalUserCount = response.data[0];
                $scope.loading = false;
            }, function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
  	};


    $scope.getStudentInfo = function(){
        adminServices.getStudentInfo()
            .then(function (response) {
                $rootScope.identity.currentUser.studentinfo = response.data[0];
            }, function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    };


    if($rootScope.identity.currentUser.role_id == 3) {
           $scope.getStudentInfo();
    }

  	$scope.getDashoard();

  });
