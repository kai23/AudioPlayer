/**
 *
 *	Lecteur de musique, par Florian CHEVALLIER
 *
 *
 */
$(document).ready(function(){
	var audio = document.getElementById('audio');
	var src = $("#audio source").attr("src");
	audio.volume=(localStorage.getItem('volume')||1);
 	
 	//Forcing an audiochange event.
 	$(audio).trigger('volumechange');﻿  

	$('#play').on('click',function(e){
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
	});

	$('#stop').on('click',function(e){
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

	});


	$('#right').on('click',function(e){
		audio.currentTime += 20;
	});

	$('#left').on('click',function(e){
		audio.currentTime -= 20;
	});



	audio.addEventListener('timeupdate',function (){
		curtime = parseInt(audio.currentTime, 10);
		var v = 176 / audio.duration;
		var size = audio.currentTime * v;

		var time = convertTime(audio.duration - audio.currentTime);
		$("#time").text(time);


		$("p#musicName").text(src);
		$("#progress").css("width",size + "px");
	});

	audio.addEventListener('loadedmetadata', function(){
		var time = convertTime(audio.duration);
		$("#time").text(time);
	});

	$('#loading').click(function(e) {
		var posX = $(this).offset().left, posY = $(this).offset().top;
		var d = e.pageX - posX;
		var v = 176 / audio.duration;
		var t = d / v;
		audio.currentTime = t;
		$("#progress").css("width", d + "px");
	});
	$("#bouton").draggable({
		containment:"parent",
		appendTo:"#slider",
		drag:function(evt,ui){
			var newVol = Math.round(ui.position.top / $(this).parent().height()*10) / 10;
			// Pour partir d'en bas vers en haut
			newVol = Math.abs(0.8 - newVol);
			if (ui.position.top == 40) {
				newVol = 0;
			}	
			audio.volume=newVol;
		}
	});


	$('#slider').on('click',function(e){
		var newVol = Math.abs(0.8 - Math.round(e.offsetY / $(this).height()*10) / 10);
		audio.volume=newVol;
	});﻿


	audio.addEventListener('volumechange', function(){
		var hauteur = parseInt($("#slider").css("height"));
		var pos = Math.abs(hauteur - audio.volume * hauteur) - 14;
		$("#bouton").css("top",  pos+"px");
		localStorage.setItem('volume',audio.volume);
	});


	$(document).keydown(function(e){

	console.log(e.KeyCode);

	// touche « haut »
	if (e.keyCode == 38) { 
		audio.volume += 0.01;
	}

	// touche « bas »
	if (e.keyCode == 40) { 
		audio.volume -= 0.01;
	}

	// touche « espace »	
	if (e.keyCode == 32) {
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

	if (e.keyCode == 27) {
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

	if (e.keyCode == 39) {
		audio.currentTime += 20;
	}

	if (e.keyCode == 37) {
		audio.currentTime -= 20;
	}

});
});






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




