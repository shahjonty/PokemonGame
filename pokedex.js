//  Jonty Shah 1531562
//  CSE 154 AI
//  TA: Christine Ta
//  Homework 5
//  05/10/17

// This is a javascript file for the pokedex.
// This files handles the script part of the webpage.
// This file handles the reset of the health of pokemon to orginal value
// after game ends.

(function() {

   // To enforce strict JScript rules
   "use strict";

   var found = ["bulbasaur", "charmander",  "squirtle"];
   var gameId;
   var playerId;

   var LOW = 20;
   var MAX = 100;
   var TOTAL = 4;

   var hp1; // keeps track of originial health
   var hp2; // keeps track of original health

   // initiate the pokedex once the browser loads
   window.onload = function() {
      populate();
   };

   // This function collects the data that it gets from the Ajax promise
   // The data is then sorted appropriately to be displayed on the pokedex
   // Sets apt classes to the icons to highlight whether the pokemon is found
   function getimg(text) {
      var names = text.split(":");
      var images = [];

      for(var i = 0; i < names.length; i++){

         if(names[i].indexOf(".png") != -1){
            var temp = names[i].slice(0, names[i].indexOf(".png") + 4);
            images[i - 1] = temp;
         }

      }

      for(var j = 0; j < images.length; j++) {
         var img = document.createElement("img");
         var str = "sprites/";
         var check = images[j].slice(0, images[j].indexOf(".png"));

         img.setAttribute("src", str.concat(images[j]));
         img.setAttribute("id", check );

         if(found.indexOf(check) == -1){
            img.classList.add("unfound");
         } else {
            img.onclick = card;
         }

         img.classList.add("sprite");
         document.getElementById("pokedex-view").appendChild(img);
      }
   }

   // This function uses Ajax promise to get specific data of the pokemon clicked
   function card() {
      var name = this.id;
      var pokePromise = new AjaxGetPromise("https://webster.cs.washington.edu/pokedex/pokedex.php?pokemon=" +
      name);

      pokePromise
         .then(JSON.parse)
         .then(getimgdata)
         .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
   }


   // This function uses an ajaxGetPromise to retreive all the data of all the pokemons
   function populate() {
      var pokePromise = new AjaxGetPromise(
         "https://webster.cs.washington.edu/pokedex/pokedex.php?pokedex=all");

      pokePromise
         .then(getimg)
         .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
   }

   // This function displays the specific pokemon data on the card
   // Also displays the start button so the game can be initiated
   function getimgdata(text) {
      cardHelper("#my-card",text);

      document.getElementById("start-btn").classList.remove("hidden");
      document.getElementById("flee-btn").classList.add("hidden");
      document.getElementById("start-btn").onclick = gameStart;
   }

   // Switches the view to game mode where the opponent's card is displayed
   // the pokedex and the start button are hidden, flee button displayed
   // Uses an ajaxPostPromise to retrieve opponents data so the game can be played
   function gameStart() {
      document.getElementById("pokedex-view").classList.add("hidden");
      document.getElementById("their-card").classList.remove("hidden");

      document.getElementById("results-container").classList.remove("hidden");
      document.getElementById("start-btn").classList.add("hidden");

      document.getElementById("flee-btn").classList.remove("hidden");
      document.getElementById("flee-btn").onclick = finish;

      document.getElementById("title").innerHTML = "Pokemon Battle Mode!";

      document.querySelector("#my-card .hp-info").classList.remove("hidden");
      document.querySelector("#my-card .buffs").classList.remove("hidden");

      var name = document.querySelector("#my-card .name").innerHTML.toLocaleLowerCase();
      var pokePromise =
      new AjaxPostPromise("https://webster.cs.washington.edu/pokedex/game.php",{ startgame:
      "true",mypokemon:name} );

      pokePromise
         .then(JSON.parse)
         .then(game)
         .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
    }

   // This function displays the opponents card data and initiates the battle
   // When the user clicks a move button
   function game(data) {
      gameId = data.guid;
      playerId = data.pid;

      var index = cardHelper("#their-card",data.p2);

      for(var z = 0; z < index; z++){
         document.querySelectorAll("#my-card .moves button")[z].onclick = gamePlay;
      }
   }

   // Using an Ajax Post promise this function updates the data from the server
   // to ensure that the game play moves forward appropriately
   function gamePlay() {
      document.getElementById("loading").classList.remove("hidden");

      var name = this.children[0].innerHTML.toLocaleLowerCase().replace(" ","");
      var pokePromise =
      new AjaxPostPromise("https://webster.cs.washington.edu/pokedex/game.php",{guid:
      gameId,pid:playerId,movename:name} );

      pokePromise
         .then(JSON.parse)
         .then(gameMove)
         .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
   }

   // It gets the data as a parameter and makes the changes to the game state
   // according to the move selected by user. It makes changes for both the cards
   // the payer and the opponent. It also displays and hides various different element
   // in the game. It also keeps track of the current state of the game.
   function gameMove(text) {
      document.getElementById("loading").classList.add("hidden");

      var currentHp = text.p1["current-hp"];
      var currentHp2 = text.p2["current-hp"];

      hp1 = text.p2["hp"] + "HP";
      hp2 = text.p1["hp"] + "HP";

      healthHelper("#my-card","p1",text,currentHp);
      healthHelper("#their-card","p2",text,currentHp2);

      buffHelper("#my-card",text.p1.buffs,text.p1.debuffs);
      buffHelper("#their-card",text.p2.buffs,text.p2.debuffs);

      var result;

      if(currentHp == 0 || currentHp2 == 0) {

         if(currentHp2 > 0){
            result = "You lost!";
         } else {
            result = "You won!";
            var string = text.p2.name.toLocaleLowerCase();

            if(found.indexOf() == -1){

               found.push(string);
               document.getElementById(string).classList.remove("unfound");
               document.getElementById(string).onclick = card;
            }
         }

         document.getElementById("endgame").classList.remove("hidden");
         document.getElementById("title").innerHTML = result;
      }
      document.getElementById("endgame").onclick = end;

   }

   // This function is called upon the game end and it resets various elements to
   // their original state. Specially the HP of the pokemon after the game end and
   // switching back to pokedex view.
   function end() {
      document.getElementById("pokedex-view").classList.remove("hidden");
      document.getElementById("their-card").classList.add("hidden");

      document.getElementById("results-container").classList.add("hidden");
      document.getElementById("endgame").classList.add("hidden");

      document.getElementById("start-btn").classList.remove("hidden");
      document.getElementById("flee-btn").classList.add("hidden");

      document.getElementById("title").innerHTML = "Your Pokedex";

      document.querySelector("#my-card .hp-info").classList.add("hidden");
      document.querySelector("#my-card .buffs").classList.add("hidden");

      document.querySelector("#results-container #p1-turn-results").innerHTML = "";
      document.querySelector("#results-container #p2-turn-results").innerHTML = "";

      document.querySelector("#their-card .buffs").innerHTML = "";
      document.querySelector("#my-card .buffs").innerHTML = "";

      document.querySelector("#my-card .health-bar").style.width = "100%";
      document.querySelector("#their-card .health-bar").style.width = "100%";

      document.querySelector("#their-card .health-bar").classList.remove("low-health");
      document.querySelector("#my-card .health-bar").classList.remove("low-health");

      document.querySelector("#their-card .hp").innerHTML = hp2;
      document.querySelector("#my-card .hp").innerHTML = hp1;
   }

   // Using an Ajax Post promise this function updates the data from the server
   // to ensure that the game play moves forward appropriately and when the
   // user forfeits the battle.
   function finish(){

      var pokePromise =
      new AjaxPostPromise("https://webster.cs.washington.edu/pokedex/game.php",{guid:
      gameId,pid:playerId,movename:"flee"} );

      pokePromise
         .then(JSON.parse)
         .then(gameMove)
         .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
      }

   // This function is used to display proper information on the cards.
   function cardHelper(id, text){
      document.querySelector(id.concat(" .name")).innerHTML = text.name;
      document.querySelector(id.concat(" .pokepic")).src = text.images.photo;

      document.querySelector(id.concat(" .type")).src = text.images.typeIcon;
      document.querySelector(id.concat(" .weakness")).src = text.images.weaknessIcon;

      document.querySelector(id.concat(" .hp")).innerHTML = text.hp + "HP";
      document.querySelector(id.concat(" .info")).innerHTML = text.info.description;

      var move = text.moves;
      var index = move.length;

      for(var i = 0; i < TOTAL; i++){
         document.querySelectorAll(id.concat(" .moves button"))[i].classList.remove("hidden");
         if(i < index) {
            document.querySelectorAll(id.concat(" .moves button .move"))[i].innerHTML
            = move[i].name;

            document.querySelectorAll(id.concat(" .moves button img"))[i].src =
            "icons/" + move[i].type + ".jpg";

            if(move[i].dp != null) {
               document.querySelectorAll(id.concat(" .moves button .dp"))[i].innerHTML =
               move[i].dp + " DP";
            } else {
               document.querySelectorAll(id.concat(" .moves button .dp"))[i].innerHTML = "";
            }

         } else {
            document.querySelectorAll(id.concat(" .moves button"))[i].classList.add("hidden");
         }
      }
      return index;
   }

   // This function is used to keep the current health information
   // of the pokemon.
   function healthHelper(id,part,text,temp3){
      var data = text.results;

      document.getElementById(part + "-turn-results").classList.remove("hidden");
      document.querySelector(id + " .hp").innerHTML = temp3 + "HP";

      var z = data[part + "-move"];

      if(z.indexOf("flee") != -1) {
         document.getElementById(part + "-turn-results").innerHTML = "lose case";
      } else if(z == ""){
         document.getElementById(part + "-turn-results").innerHTML="";
      } else {
         document.getElementById(part + "-turn-results").innerHTML =
         "Player " + part.substring(1) + " played " + data[part + "-move"] +
         " and " + data[part + "-result"] + "!";
      }

      var temp = document.querySelector(id + " .health-bar");
      var num =  ((parseInt(temp3) / parseInt(hp1)) * 100);

      if(num > MAX){
         num = MAX;
      }

      temp.style.width = num + "%";
      if(num < LOW){
         temp.classList.add("low-health");
      } else if(temp.classList.contains("low-health")) {
         temp.classList.remove("low-health");
      }

   }

   // this function keeps the current buffs of the game
   // according to the move selected by the user.
   function buffHelper(id,buff,debuff) {
      var elem = document.querySelector(id + " .buffs");

      for(var j = elem.childNodes.length; j > 0; j--) {
         elem.removeChild(elem.childNodes.item(j - 1));
      }

      buffHelper2(buff,elem,"buff","debuff");
      buffHelper2(debuff,elem,"debuff","buff");
   }

   // this function adds and removes classes for the buffs
   // according to the move selected by the user.
   function buffHelper2(buff,elem,part,part2){

      if(buff != null){

         for(var i = 0; i < buff.length; i++){
            var d =  document.createElement("div");

            d.classList.add(buff[i]);
            d.classList.add(part);

            if(d.classList.contains(part2)){
               d.classList.remove(part);
            }

            elem.appendChild(d);
         }
      }
   }

})();