<?php

    /*
        Jonty Shah
        CSE 154 AI
        TA: Christine Ta
        Homework 7
        05/31/17

        This is a php file that is a common file containing functions that
        can be accesssed by the different php files.

    */

    error_reporting(E_ALL);

    # sets the connection with the mysql.
    function connection(){
        $db = new PDO("mysql:dbname=hw7;host=localhost;charset=utf8", "root", "");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    }

    # it gets and returns the current time and date.
    function getTime() {
        date_default_timezone_set('America/Los_Angeles');
        return date('y-m-d H:i:s');
    }

    # This function prints error if the pokemon is not found in the table.
    function notFound($name){
       $initial = getCount($name);
        if(!$initial){
           printError("Error: Pokemon $name not found in your Pokedex.");
        }
    }

    # This function returns the count of the pokemon name
    # available in the Pokedex table.
    function getCount($name){
        $temp = select($name);
        $initial = $temp->rowCount();
        return $initial;
    }

    # This function takes in string as parameter and prints a 400
    # request error.
    function printError($text){
        header("HTTP/1.1 400 bad request");

        $error = array("error" => $text);
        die(json_encode($error));
    }

    # This function prints error if the pokemon is already
    # available in the Pokedex.
    function notFoundInsert($name, $text){
        $initial = getCount($name);
        if($initial){
           printError($text);
        }
    }

    # This function takes in a string as parameter and prints
    # the success meassage in the JSON format.
    function printSuccess($text){
        $print = array("success" => $text);
        header("Content-type: application/json");
        print json_encode($print);
    }

    # This function takes in a name of the pokemon as parater and deletes
    # that pokemon from the Pokedex table.
    function deletePoke($name){
        $db = connection();
        $db->query("DELETE FROM Pokedex WHERE name = '$name'");
    }

    # This function takes in a name, nickname and time as parameter and inserts them
    # in the Pokedex table.
    function insertPoke($name, $nickname, $time){
        $db = connection();
        $sql = "INSERT INTO Pokedex(name,nickname,datefound) VALUES('$name','$nickname','$time')";
        $db-> query($sql);
    }

    # This function gets the name as avaialble in the table and returns it.
    function getName($name){
        $db = select($name);
        foreach($db as $temps){
            return $temps["name"];
        }
    }

    # This function selects the given pokemon from the table and returns it.
    function select($name) {
        $db = connection();
        $temp = $db-> query("Select name from Pokedex where name='$name'");
        return $temp;
    }

?>