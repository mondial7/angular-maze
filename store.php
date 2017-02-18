<?php

/**
 * Quick & Dirty solution to save mazes' code on a json file
 * No security issue has been addressed
 */

// Collect and format maze data
$maze_data = json_decode(file_get_contents("php://input"), true);
$maze = $maze_data['maze'];

// Storing file
$mazes_file = 'mazelist.json';

// Get current maze data
$mazes = json_decode(file_get_contents($mazes_file), true);

// Make title unique
for ($i=0; $i < count($mazes); $i++) { 
	if ($mazes[$i]['name'] == $maze['name']) {
		exit("Please choose another name.\nAnother maze with the same name already exists.");
	}
}

// Add new id to the maze
$maze['id'] = count($mazes) + 1;

// Append new mazes
$mazes[] = $maze;

// Store the updated set of maze
file_put_contents($mazes_file, json_encode($mazes));

// Sdt output
echo 'Maze saved';