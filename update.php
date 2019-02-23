<?php

   /*
      Jonty Shah
      CSE 154 AI
      TA: Christine Ta
      Homework 7
      05/31/17

      This is a php file that updates the pokedex table with thw new nickname
      passed as parameter by the client. The file also takes the name of the pokemon
      who's nickname is to be updated by the paramter. It is neccessary to pass
      both the parameters.

   */

   # links the common.php to this file.
   include "common.php";

   # sets the PDO connection with the mysql.
   $db = connection();

   if(!isset($_POST["name"]) || !isset($_POST["nickname"])){
      printError("Missing name and nickname parameters");
   }

   $name = $_POST["name"];
   $nickname = $_POST["nickname"];

   # prints error if name not found in the Pokedex table.
   notFound($name);

   # updates the nickname in the Pokedex table.
   $db->query("Update Pokedex set nickname ='$nickname' where name='$name'");

   # gets the name in the table and prints a success message.
   $temp = getName($name);
   printSuccess("Success! Your $temp is now named $nickname !");

?>