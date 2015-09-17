(function() {


  var app = angular.module('app', [
    'smoothScroll'  //uses smoothScroll from https://github.com/d-oliveros/ngSmoothScroll
  ]);

  var all_documents = [
    {
      document_num: 1,
      template_src: 'resources/buckley.html',
      heatmap_src: 'resources/buckley_heatmap.json'
    }
  ];
  var current_document = all_documents[0];

  var heatMapFunc = function ($http) {
    console.log("here!");
    this.heatMap = {content: null};

    $http.get(current_document.heatmap_src).success(function(data) {
      this.heatMap.content = data;
    });
    console.log(this.heatMap);

    return this.heatMap;
  };

  var MyFunc = function() {

			this.name = "default name";

			this.$get = function() {
				this.name = "new name"
				return "Hello from MyFunc.$get(). this.name = " + this.name;
			};

			return "Hello from MyFunc(). this.name = " + this.name;
		};

  // app.factory('heatMap', MyFunc);
  app.factory('heatMap', ['$http', '$rootScope', function($http, $scope) {
    return {
        heatmap_data: function() {
            if ($scope.data) {
                return $scope.data;
            }

            $http.get('resources/buckley_heatmap.json')
              .success(function(data) {
                  $scope.data = data;
                  console.log($scope.data);
                  return data;
              });
        }
    }
  }]);


  app.directive('documentText', ['heatMap', function (heatMap){
    return {
      restrict: 'E',
      templateUrl: current_document.template_src,
      controller: function ($scope) {
        var maxPage = $("span.page_number").last()[0].getAttribute('data-page');
        var arr = [];
        for(var i = 1; i <= maxPage; i++) {  arr.push(i);  }
        $scope.pageNums = arr;
        $scope.heatmap = heatMap.heatmap_data;
        console.log($scope.heatmap.heatmap_data);
      },
      controllerAs: 'textCtrl'
    }
  }])

  app.directive('tooltip', function(){
    return {
      restrict: 'A',
      link: function($scope, $element){
        $($element).hover(function(){
          $($element).tooltip('show');
        }, function(){
          $($element).tooltip('hide');
        });
      }
    };
  });

  app.controller('documentCtrl', ['$scope', '$http', 'smoothScroll', 'heatMap',
    function($scope, $http, smoothScroll, heatMap) {
      var docCtrl = this;
      var info = heatMap;
      var hm = heatMap.heatmap_data;

      console.log(hm);

      this.reAnchor = function(page_num) {
        var elem = $("span.page_number[data-page='" + page_num + "']")[0];
        smoothScroll(elem);
      };
    }
  ]);

})();
