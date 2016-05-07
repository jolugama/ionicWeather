angular.module('App')
.directive('autoFocus', function($timeout) {  // auto-focus auto-focus-delay="500"
  function link($scope, $element, $attrs) {
    var dom = $element[0];
    if ($attrs.autoFocus) {
      $scope.$watch($attrs.autoFocus, focus);
    } else {
      focus(true);
    }
    function focus(condition) {
      if (condition) {
        $timeout(function() {
          dom.focus();
        }, $scope.$eval($attrs.autoFocusDelay) || 0);
      }
    }
  }
  return {
    restrict: 'A',
    link: link
  };
})


.directive('reFocus', function($timeout) {
  return {
    link: function($scope, $element, $attrs) {
      $scope.$watch($attrs.autoFocus, function(){
        $element[0].focus();
      });
      $element.bind('blur', function() {
        $timeout(function() {
          $element[0].focus();
        });

      });
    }
  };
});
