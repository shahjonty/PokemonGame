<?php

    /*
        Jonty Shah
        CSE 154 AI
        TA: Christine Ta
        Homework 7
        05/31/17

        This is a php file that selects all the data available
        in the table Pokedex and displays it in the JSON format.

    */

    # links the common.php to this file.
    include "common.php";

    if(!isset($_POST["name"])){
        printError("Missing name parameter");
    }

    $name = $_POST["name"];

    if(!isset($_POST["nickname"])) {
        $nickname = strtoupper($name);
    } else {
        $nickname = $_POST["nickname"];
    }

    $time = getTime();
    $temp = getName($name);

    # prints an error message.
    notFoundInsert($name, "Error: Pokemon $temp already found.");

    # inserts the pokemon in the table and prints a success message.
    insertPoke($name, $nickname, $time);
    printSuccess("Success! $name added to your Pokedex!");

?>