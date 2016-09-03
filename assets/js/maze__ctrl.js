Maze.controller('mazeCtrl',function($scope){

	var welcome_message = "Select one maze and play it hard!";

	$scope.maze = {
		id:0,
		name: welcome_message,
		matrix: [],
		goals:0,
		compass: []
	};

	$scope.resetGame = function(){
		$scope.maze.id = 0;
		$scope.maze.name = welcome_message;
		$scope.maze.matrix = [];
		$scope.maze.goals = 0;
		$scope.maze.compass = [];
	}

});