/**
 *
 *	Lecteur de musique, par Florian CHEVALLIER
 *
 *
 */
 $(document).ready(function(){

 	// On récupère notre audio, et sa source
 	var audio = document.getElementById('audio');
 	var src = $("#audio source").attr("src");

 	// On set le volume en fonction du localstorage
 	audio.volume=(localStorage.getItem('volume')||1);
 	
 	//Force l'évenement du changement de volume.
 	$(audio).trigger('volumechange');﻿  


 	

 	/*
 	 * Les différentes actions lorsque l'on clique 	  	
 	 */


 	// Le bouton play
 	$('#play').click(function(e){
 		playPause(src);
 	});

 	// Le bouton stop
 	$('#stop').click(function(e){
 		stopPlaying();
 	});

 	// Le bouton vers la droites
 	$('#right').click(function(e){n 
 		playForward();
 	});

 	// le bouton vers la gauche
 	$('#left').click(function(e){
 		playBackward();
 	});
 	
 	// Notre slider. Pour le son
 	$('#slider').click(function(e){
 		var newVol = Math.abs(0.8 - Math.round(e.offsetY / $(this).height()*10) / 10);
 		audio.volume=newVol;
 	});﻿

 	// La progressbar, pour le temps de la musique
 	$('#loading').click(function(e) {

 		// On récupère la position en X
 		var posX = $(this).offset().left, posY = $(this).offset().top;
 		var d = e.pageX - posX;
 		var v = $(this).width() / audio.duration;

 		// t (px/s) = d(px) / v (s). Merci la physique du collège
 		var t = d / v;
 		audio.currentTime = t;
 		$("#progress").css("width", d + "px");
 	});



 	// Le bouton pour le volume
 	$("#bouton").draggable({
 		containment:"parent", 		
 		drag:function(evt,ui){

 			// On calcule le volume en fonction de la position du bouton
 			var newVol = Math.round(ui.position.top / $(this).parent().height()*10) / 10;
			
			// Pour partir d'en bas vers en haut (jamais fait autant de maths dans un programme, tient.)
			newVol = Math.abs(0.8 - newVol);
			if (ui.position.top == 40) {
				newVol = 0;
			}

			// On set le volume
			audio.volume=newVol;
		}
	});


 	

	/*
 	 * Les différents eventListener. La liste est dispo ici : http://www.w3.org/wiki/HTML/Elements/audio#Media_Events	
 	 */

 	 // À chaque fois que le temps s'update (toutes les secondes, quoi)
 	audio.addEventListener('timeupdate',function (){
		
		// On récupère la taille de notre progressBar	 	
	 	var widthProgressBar = parseInt($("footer#loading").css("width"));

	 	// - 4 pour ne pas aller jusqu'au bout. Moche sinon.
	 	// Vitesse = distance sur temps. Eh oui !
 		var v = (widthProgressBar - 4) / audio.duration;

 		// la taille de notre progressBar (la vitesse * nombre de secondes)
 		var size = audio.currentTime * v;
		$("#progress").css("width",size + "px");

		// et c'est le temps qui court… court… qui nous rend sérieux !
 		var time = convertTime(audio.duration - audio.currentTime);
 		$("#time").text(time);


 		$("p#musicName").text(src); // Pour que le nom reste affiché en cas de « echap »
 		

 	});

 	// Une fois que toutes les metadatas sont chargées. Genre la durée, tout ça.
 	audio.addEventListener('loadedmetadata', function(){
 		var time = convertTime(audio.duration);
 		$("#time").text(time);
 	});


 	// Dès que le volume change
 	audio.addEventListener('volumechange', function(){

 		// On récupère la taille de notre sliders
 		var hauteur = parseInt($("#slider").css("height"));

 		// On calcule la nouvelle position du bouton
 		var pos = Math.abs(hauteur - audio.volume * hauteur) - 14;

 		// On change la place de notre bouton
 		$("#bouton").css("top",  pos+"px");

 		// Qu'on enregistre dans le localstorage 
 		localStorage.setItem('volume',audio.volume);
 	});


 	/*
 	 * Les différents listener pour les touches	
 	 */

 	$(document).keydown(function(e){

 		console.log(e.KeyCode);

		// touche « haut »
		if (e.keyCode == 38) { 
			volume(0.01, "up");
		}

		// touche « bas »
		if (e.keyCode == 40) { 
			volume(0.01, "down");
		}

		// touche « espace »	
		if (e.keyCode == 32) {
			playPause(src);
		}

		// touche « echap »
		if (e.keyCode == 27) {
			stopPlaying();
		}

		// touche « droite »
		if (e.keyCode == 39) {
			playForward();
		}

		// Touche « gauche »
		if (e.keyCode == 37) {
			playBackward();
		}
	});


 });

/* 
 * Toutes nos fonctions ! :)
 *
 */

// Optimisation ! :D
function volume(vitesse,direction) {
	audio.volume = direction == "up" ? audio.volume + vitesse : audio.volume - vitesse;
}

/*
 * src : la source de la musique
 *
 */
function playPause(src) {
	if(!audio.paused){
		$("#pause").attr("id","play");
		audio.pause(); 
	}
	else {
		$("div#play").attr("id","pause");
		$("p#musicName").text(src);
		var time = convertTime(audio.duration - audio.currentTime);
		$("#time").text(time);
		audio.play(); 
	}
}


///

function stopPlaying() {
	if($("#pause")){
		$("#pause").attr("id","play");
		audio.pause();
		audio.currentTime=0;
	}
	else {
		$("div#play").attr("id","pause");
		audio.pause();
		audio.currentTime=0;
	}
	$("p#musicName").text(" ");
	$("p#time").text(" ");
}

//

function playForward() {
	audio.currentTime += 20;
}

//


function playBackward() {
	audio.currentTime -= 20;
}

//


function convertTime(time) {
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	seconds = Math.round(seconds,2);
	var hours = Math.floor(time / 3600);
	time = time - hours * 3600;

	if (seconds < 10) {
		seconds = "0"+seconds;
	}
	var time = minutes+"\."+seconds;
	return time;
}