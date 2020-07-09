var Generator = angular.module("mazeGenerator", []);

Generator.controller('generatorCtrl', function($scope, $http){

	$scope.blockNames = ["PATH","WALL","GOAL","START","FINISH"];
	$scope.blockTypeID = 1;

	$scope.maze = {
		name: `maze${Date.now()}`,
		matrix: [
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
		],
		goals: 0,
		compass: [],
	}

	$scope.printJsonMaze = function(){
		return angular.toJson($scope.maze);
	}

	$scope.isActive = function(blockTypeID){
		return blockTypeID === $scope.blockTypeID ? 'active' : '';
	}

	$scope.setBlockType = function(id){
		$scope.blockTypeID = id;
	}

	$scope.evalBlock = function(row,col) {
		// Check if we are removing one goal
		if($scope.maze.matrix[row][col] == 2){
			$scope.maze.goals -= 1;
		}

		switch ($scope.blockTypeID){
			case 2:
				// Add one more goal
				$scope.maze.goals += 1;
				break;
			case 3:
				// Update maze compass
				$scope.maze.compass[0] = row;
				$scope.maze.compass[1] = col;
			case 4:
				// Limit block to only one start and one finish
				// Delete the old start (or finish) block
				for (var i = 0; i < $scope.maze.matrix.length; i++) {
					for (var k = 0; k < $scope.maze.matrix[0].length; k++) {
						if($scope.maze.matrix[i][k] == $scope.blockTypeID){
							$scope.maze.matrix[i][k] = 0;
						}
					}
				}
				break;
		}

		// Update matrix values
		$scope.maze.matrix[row][col] = $scope.blockTypeID;
	}

	/**
	 * Set open paths on $scope.maze
	 * return number of open paths
	 * @returns Number
	 */
	function evalOpenPaths() {
		const x = $scope.maze.compass[0];
		const y = $scope.maze.compass[1];
		const potentialPathsCoords = [
			[x, y+1],
			[x, y-1],
			[x+1, y],
			[x-1, y],
		];
		let count = 0;
		potentialPathsCoords.forEach((coords) => {
			if (coords[0] >= 0 && coords[0] < $scope.maze.matrix[0].length
				&& coords[1] >= 0 && coords[1] < $scope.maze.matrix.length) {
					if ($scope.maze.matrix[coords[0]][coords[1]] === 0) {
						$scope.maze.matrix[coords[0]][coords[1]] = 5;
						count++;
					}
				}
		})
		return count;
	}

	$scope.save = function(){
	
		// @todo
		// Validate the maze
		// e.g. name
		if ($scope.maze.name == '') {
			alert('Please insert a name');
			return;
		}

		// Set the default first open paths
		if (evalOpenPaths() < 1) {
			alert('Please check the position of your starting point');
			return;
		}
		
		// Send data to server
		// $http
		// 	.post('./legacy-storage/store.php', {maze:$scope.maze})
		// 	.success(function(response){
	  //   	alert(response);
		// 	});
		
		console.log($scope.maze)

		// Store data on Firestore
		db.collection("mazelist").add({
			...$scope.maze,
			matrix: JSON.stringify($scope.maze.matrix),
		})
		.then(function(docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});

	}

	$scope.addLine = function(position){
		// positions: 1-top,2-right,3-bottom,4-left
		switch (position){

			case 1:
				// Generate row to insert on top of matrix
				var row = [];
				for (var i = 0; i < $scope.maze.matrix[0].length; i++) {
					row.unshift(0);
				};
				// Add new row at top of matrix
				$scope.maze.matrix.unshift(row);
				break;

			case 2:
				// Add one more element to each row of the matrix
				for (var i = 0; i < $scope.maze.matrix.length; i++) {
					$scope.maze.matrix[i].push(0);
				};
				break;

			case 3:
				// Genereta row to insert on bottom of the matrix
				var row = [];
				for (var i = 0; i < $scope.maze.matrix[0].length; i++) {
					row.unshift(0);
				};
				// Add new row at bottom of matrix
				$scope.maze.matrix.push(row);
				break;

			case 4:
				// Add one more element at the beginning of each row of the matrix
				for (var i = 0; i < $scope.maze.matrix.length; i++) {
					$scope.maze.matrix[i].unshift(0);
				};
				break;
		
		}
	}

	$scope.removeLine = function(position){

		// Min matrix is 4x4

		// positions: 1-top,2-right,3-bottom,4-left
		switch (position){

			case 1:
				if($scope.maze.matrix.length > 4){
					// Remove first row
					$scope.maze.matrix.shift($scope.maze.matrix[0]);
				}
				break;

			case 2:
				if($scope.maze.matrix[0].length > 4){
					// Remove one element to the end of each row
					for (var i = 0; i < $scope.maze.matrix.length; i++) {
						$scope.maze.matrix[i].pop();
					}
				}
				break;

			case 3:
				if($scope.maze.matrix.length > 4){
					// Remove last row
					$scope.maze.matrix.pop();
				}
				break;

			case 4:
				if($scope.maze.matrix[0].length > 4){
					// Remove fisrt element of each row
					for (var i = 0; i < $scope.maze.matrix.length; i++) {
						$scope.maze.matrix[i].shift($scope.maze.matrix[i][0]);
					}
				}
				break;
		
		}
	}

	$scope.draw = false;

	$scope.drawMode = function(status){
		$scope.draw = status;
	}

	$scope.evalBlockOver = function(row,col){

		if($scope.draw == true){
			$scope.evalBlock(row,col);
		}

	}

});