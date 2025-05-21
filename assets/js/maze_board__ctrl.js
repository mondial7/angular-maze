Maze.controller('mazeBoard',function($scope){

	$scope.blocks = ["PATH","WALL","GOAL","START","FINISH","OPEN_PATH","OPEN_GOAL","OPEN_FINISH"];

	$scope.evalPath = function(blockID,blockRow,blockCol){

		// Check if is the finish
		if(blockID == 7){
			return $scope.finish();
		}

		// Check if is an open path and right path -> 5 or (if is a goal) 6
		if(blockID != 5 && blockID != 6){
			return;
		}

		// Move
		
		var mtx = $scope.maze.matrix;
		
		// Find new open path around the current position (compass)
		var lowerRow = (blockRow > 0) ? (blockRow - 1) : 0;
		var upperRow = (blockRow < ($scope.maze.matrix.length-1)) ? (blockRow + 1) : ($scope.maze.matrix.length-1);
		var lowerCol = (blockCol > 0) ? (blockCol - 1) : 0;
		var upperCol = (blockCol < ($scope.maze.matrix[0].length-1)) ? (blockCol + 1) : ($scope.maze.matrix[0].length-1);

		// Find the new open path (digonal directions are not allowed)
		var adjList = [[upperRow,blockCol],[lowerRow,blockCol],[blockRow,upperCol],[blockRow,lowerCol]];

		// Counter to check if there are only walls around you
		var walls_counter = 0;

		for (var i = adjList.length - 1; i >= 0; i--) {
			var block = mtx[adjList[i][0]][adjList[i][1]];
			if(block == 0){
				block = 5;
			} else if(block == 2){
				block = 6;
			} else if(block == 4){
				block = 7;
			} else if(block ){
				walls_counter++;
			}
			mtx[adjList[i][0]][adjList[i][1]] = block;
		}

		// If you have only walls around you you have lost because you cannot move anymore
		if(walls_counter == 4){
			return lost(0); 
		}

		// Current block become a wall
		mtx[$scope.maze.compass[0]][$scope.maze.compass[1]] = 1;

		// Update goal counter
		if(mtx[blockRow][blockCol] == 6){
			$scope.maze.goals -= 1;
		}

		// Update new current block
		mtx[blockRow][blockCol] = 3;
		$scope.maze.compass[0] = blockRow;
		$scope.maze.compass[1] = blockCol;

		// Normalize the matrix restoring the open path to normal path if no more adjacent to the current block
		for (var i = (mtx.length-1); i >= 0; i--) {
			for (var k = (mtx[i].length - 1); k >= 0; k--) {
				var t = [i,k];
				if( !inMatrix(t,adjList) ){
					if(mtx[i][k] == 5){
						mtx[i][k] = 0;
					} else if(mtx[i][k] == 6){
						mtx[i][k] = 2;
					} else if(mtx[i][k] == 7){
						mtx[i][k] = 4;
					}
				}
			};
		};

		// Update maze matrix
		$scope.maze.matrix = mtx;

	}

	$scope.finish = function(){

		// Check if all goals where achieved
		if($scope.maze.goals == 0){
			// Show success celebration instead of alert
			if (window.showMazeSuccess) {
				window.showMazeSuccess();
			} else {
				// Fallback if function not available
				alert("Congrats! You did it!");
			}
		} else {
			lost(1);
		}

		// Reset game
		$scope.resetGame();

	}

	function lost(message_type){
		if (typeof MazeToast !== 'undefined') {
			if(message_type == 1){
				MazeToast.show('Oops!', 'You lost, goals left: ' + $scope.maze.goals, 'error');
			} else {
				MazeToast.show('Oops!', 'You lost, you have never reached the finish', 'error');
			}
		} else {
			// Fallback to alert if MazeToast not available
			if(message_type == 1){
				alert("You lost, goals left: "+$scope.maze.goals);
			} else {
				alert("You lost, you have never reached the finish");
			}
		}
	}

	function inMatrix(obj,arr){
		for (var i = arr.length - 1; i >= 0; i--) {
			if(compareArr(arr[i],obj)){
				return true;
			}
		}
		return false;
	}

	function compareArr(a,b){
		for (var i = a.length - 1; i >= 0; i--) {
			if(a[i] != b[i]){
				return false;
			}
		}
		return true;
	}

});