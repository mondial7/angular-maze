Maze.controller('mazeChooser',function($scope,$http){

	// Default maze list
	$scope.mazeList = [
		{id:1,name:"Maze 1",matrix:[[1,3,1,1,1,1,1,1,1,1],[1,5,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,1,0,1],[1,0,1,2,1,2,1,0,0,1],[1,0,1,0,0,0,1,0,1,1],[1,0,1,0,1,0,1,0,0,1],[1,0,0,0,1,0,1,1,2,1],[1,0,1,0,0,2,0,1,0,4],[1,0,0,2,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],goals:5,compass:[0,1]},
		{id:2,name:"Maze 2",matrix:[[1,3,1,1,1,1,1,1,1,1],[1,5,0,0,0,0,0,0,0,1],[1,0,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,0,1,0,1],[1,0,1,0,0,0,0,1,0,1],[1,0,2,0,1,1,0,1,2,1],[1,0,1,1,1,2,0,0,0,1],[1,0,0,0,0,0,1,1,0,4],[1,1,1,1,1,1,1,1,1,1]],goals:3,compass:[0,1]},
		{id:3,name:"Maze 3",matrix:[[1,3,1,1,1],[1,5,0,0,1],[4,0,1,0,1],[1,0,0,2,1],[1,1,1,1,1]],goals:1,compass:[0,1]}
	];

	// Load mazes
	// $http.get("./legacy-storage/mazelist.json").then(function(response) {
	// 	if (response.data !== null) {
	// 		$scope.mazeList = angular.fromJson(response.data);
	// 	}
	// });
	db.collection("mazelist").get().then(function(querySnapshot){
		const mazeList = [];
		querySnapshot.forEach(function(doc){
			const maze = {
				id: doc.id,
				...doc.data(),
				// parse matrix - stored as string in Firestore
				matrix: angular.fromJson(doc.data().matrix),
			};
			mazeList.push(maze);
		});
		$scope.mazeList = mazeList;
		$scope.$apply();
	});

	$scope.loadMaze = function(mazeID){
		// Select the right maze
		var newMaze;
		for (var i = 0; i < $scope.mazeList.length; i++) {
			if($scope.mazeList[i].id == mazeID){
				newMaze = angular.copy($scope.mazeList[i]);
			}
		};
		// Edit parent scope attribute -> mazeCtrl
		$scope.maze.matrix = newMaze.matrix;
		$scope.maze.name = newMaze.name;
		$scope.maze.id = newMaze.id;
		$scope.maze.goals = newMaze.goals;
		$scope.maze.compass = newMaze.compass;
	}

	$scope.isActive = function(mazeID){
		return mazeID === $scope.maze.id ? 'active' : '';
	}

});