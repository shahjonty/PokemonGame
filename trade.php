<?php

    /*
        Jonty Shah
        CSE 154 AI
        TA: Christine Ta
        Homework 7
        05/31/17

        This is a php file that trades pokemon. The user provides the
        name of the pokemon currently own and the pokemon name with which
        the client wants to trade. If the pokemon is not availble or is already
        found by the user then it prints error. It is also neccesary to pass both
        the parameters.

    */

    # links the common.php to this file.
    include "common.php";

    # sets the PDO connection with the mysql.
    $db = connection();

    if(!isset($_POST["mypokemon"])|| !isset($_POST["theirpokemon"])){
        printError("Missing mypokemon and theirpokemon parameters");
    }

    $mypokemon = $_POST["mypokemon"];
    $theirpokemon = $_POST["theirpokemon"];

    # prints error if the mypokemon is not present or theirpokemon is
    # already present.
    notFound($mypokemon);
    notFoundInsert($theirpokemon,"Error: You have already found $theirpokemon.");

    $upper = strtoupper($theirpokemon);
    $time = getTime();

    # deletes mypokemon and inserts their pokemon in the table.
    deletePoke($mypokemon);
    insertPoke($theirpokemon,$upper,$time);

    # prints success message.
    printSuccess( "Success! You have traded your $mypokemon for $theirpokemon!");

?>