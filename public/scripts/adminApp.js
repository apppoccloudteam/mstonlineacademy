'use strict';
/**
 * @ngdoc overview
 * @name mstApp
 * @description
 * # mstApp
 *
 * Admin - Main module of the application.
 */
 angular
 .module('myAdminApp', [
  'oc.lazyLoad',
  'ui.router',
  'ui.bootstrap',
  ])
 .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider','$locationProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $locationProvider) {

  $ocLazyLoadProvider.config({debug:false,events:true });

  $urlRouterProvider.otherwise('/site/login');


  $stateProvider
  .state('dashboard', {
    url:'/dashboard',
    controller: 'MainCtrl',
    templateUrl: 'views/admin/main.html',
    resolve: {
      loadMyDirectives:function($ocLazyLoad){
        return $ocLazyLoad.load(
        {
          name:'myAdminApp',
          files:[
          'scripts/directives/admin/sidebar/sidebar.js',
          'scripts/directives/admin/navigation/navigation.js',
          'scripts/directives/admin/footer/footer.js',
          'scripts/directives/common/adminServices.js',
          'scripts/directives/myaccount/mstAuth.js',
          'scripts/directives/myaccount/mstUser.js',
          'scripts/directives/myaccount/mstIdentity.js',
          'scripts/controllers/main.js',
          'scripts/directives/common/loading.js'
          ]
        }),
        $ocLazyLoad.load(
        {
          name:'ngResource',
          files:['vendor/angular-resource/angular-resource.js']
        })
      },
    }
  })
  .state('dashboard.home',{
    url:'/home',
    templateUrl:'views/admin/dashboard/home.html'
  })
  .state('dashboard.profile',{
    url:'/profile',
    templateUrl:'views/admin/pages/profile.html'
  })

   .state('dashboard.mentors',{
    url:'',
    templateUrl:'views/admin/mentors/mentors.home.html',
    controller:"MentorsCtrl",
    resolve:{
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
       return $ocLazyLoad.load('scripts/controllers/mentorUserCtrl.js');
     }],
     loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
       return $ocLazyLoad.load('scripts/directives/mentor/mentorServices.js');
     }]
   }
 })
 .state('dashboard.mentors.list',{
    url:'/mentors/list',
    templateUrl:'views/admin/mentors/partials/mentors.list.html'
  })

  .state('dashboard.mentors.addnew',{
    url:'/mentors/addnew',
    templateUrl:'views/admin/mentors/partials/mentors.new.html'
  }) 

  .state('dashboard.papers',{
    url:'',
    templateUrl:'views/admin/papers/papers.home.html',
     controller:"papersCtrl",
      resolve:{
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
         return $ocLazyLoad.load('scripts/controllers/papersCtrl.js');
       }],
       loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
         return $ocLazyLoad.load('scripts/directives/papers/paperServices.js');
       }]
     }
  })
  .state('dashboard.papers.list',{
    url:'/papers/list',
    templateUrl:'views/admin/papers/partials/papers.list.html'
  })

  .state('dashboard.students',{
    url:'',
    templateUrl:'views/admin/students/students.home.html',
    controller:"studentsCtrl",
    resolve:{
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
       return $ocLazyLoad.load('scripts/controllers/studentsCtrl.js');
     }],
     loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
       return $ocLazyLoad.load('scripts/directives/students/studentServices.js');
     }]
   }
 })
  .state('dashboard.students.list',{
    url:'/students/list',
    templateUrl:'views/admin/students/partials/students.list.html'
  })
  .state('site',{
    url:'/site',
    templateUrl:'views/admin/pages/login.html',
  })
  .state('site.login',{
    url:'/login',
    templateUrl:'views/admin/pages/login.html',
    resolve: {
      loadMyFiles: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load files for an existing module
            return $ocLazyLoad.load({
             files:[
             'scripts/directives/myaccount/mstAuth.js',
             'scripts/directives/myaccount/mstUser.js',
             'scripts/directives/myaccount/mstIdentity.js',
             'scripts/controllers/loginCtrl.js'
             ] 
           }),
            $ocLazyLoad.load({
              name:'ngResource',
              files:['vendor/angular-resource/angular-resource.js']
            })
          }]
        }

      })

  $locationProvider.html5Mode(true);


}]).run(function($rootScope, $http, $location,$state,$ocLazyLoad,$timeout,$stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  $rootScope.loggedIn = function()  {
    $http.post('/auth/isloggedIn').success(function(data)
    {
      if(data.state == 'success')
      {
        $rootScope.identity = {'currentUser':''};
        $rootScope.authenticated = true;
        $rootScope.identity.currentUser = data.user;
        var str = $location.$$path;
        var redirecturl = str.replace("/", "").split("/").join(".");
        $state.go((redirecturl=="site.login") ? "dashboard.home" : redirecturl);
      }
      else
      {
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
        $state.go('site.login');
      }
    });
  }
  $rootScope.loggedIn();

});
