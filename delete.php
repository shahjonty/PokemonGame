<?php

    /*
        Jonty Shah
        CSE 154 AI
        TA: Christine Ta
        Homework 7
        05/31/17

        This is a php file that deletes the pokemon according to the post
        parameters passed by the client. The file accepts two parameters
        mode and name. if passed in mode = removeall then it removes all the
        pokemon from the table otherwise it removes the pokemon if  passed in as name.

    */

    # links the common.php to this file.
    include "common.php";

    # sets the PDO connection with the mysql.
    $db = connection();

    if(!isset($_POST["name"]) && !isset($_POST["mode"]) ){
       printError("Missing name or mode parameters");
    }

    # it deletes the pokemon according to the parameters passed by the client
    # and gives precedence to the name parameterover mode.
    if(isset($_POST["name"])) {
        $name = $_POST["name"];

        notFound($name);

        $nam = getName($name);
        deletePoke($name);

        printSuccess("Success! $nam removed from your Pokedex!");

    } else if(isset($_POST["mode"])){
        $mode = $_POST["mode"];

       if(!strcmp($mode,"removeall")){
            $resultSet = $db->query("DELETE FROM Pokedex");
            printSuccess("Success! All Pokemon removed from your Pokedex!");

        } else {
            printError("Error: Unknown mode $mode.");
        }
    }

?>