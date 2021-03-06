var mac = '';

$(document).ready(function(){
	esTelefono = false;
	conexionG = ""; //WEB
	if (location.href.indexOf("http://") == -1){
		esTelefono = true;
		conexionG = "http://www.blued.es/mambo/worker/"; //ANDROID 
		
	}
	if (esTelefono == true){

		document.addEventListener("deviceready", onWebReady, false);
	}else{

		onWebReady();
	}
});


function onWebReady(){
	FastClick.attach(document.body);
	checkUser('inicio');
	getGeo()
}

var enviando = false;
function checkUser(tipo_){
	if (tipo_ == 'boton'){
		localStorage.setItem('recordar',$('#remember').is(':checked'));
	}
	if (!enviando){
		enviando = true;
		$.ajax({
			type: "POST",
			async: false,
			url: conexionG + 'checkuser.php',
			data: { 
				user_: $('#user').val(),
				password_: $('#pass').val(),
				type_: tipo_,
				remember_: localStorage.getItem('recordar')
			},
			error: function(){

			},
			success: function(data){
				enviando = false;
				if (data == 'ok'){
					$("#login").css('display','none');
					menu();
					
				}else{
					$("#login").css('display','block');
					$("#inicio").css('display','none');
				}
			},
			timeout: 6000
		});	
	}
}
function cerrarSesion(){
	$.ajax({
		type: "POST",
		async: false,
		url: 'salir.php',
		data: { 
		},
		error: function(){

		},
		success: function(data){
			checkUser('boton');
		},
		timeout: 6000
	});	
}

function menu(){
	$("#login").css('display','none');
	$("#inicio").css('display','block');
	$('.contenedor').css('display','none');
	$('#menu').css('display','block');
	
}

function login(){
	$("#login").css('display','block');
	$("#inicio").css('display','none');
}

function cierraEsto(obj){
	$( obj ).addClass('ocultar');
	setTimeout(function(){
		$(obj).parent().fadeOut(200,function(){
			$('#menu').css('display','block');
			$(obj).parent().empty();
		});	
	},200);
}
function repostajes(){
	$('.contenedor').css('display','none');
	$('#repostajes').css('height','100%')
	$('#repostajes').html("<div style='float:left; width:100%; line-height:100%; height:100%; text-align:center;'>cargando...</div>");
	$('#repostajes').css('display','none');
	$('#repostajes').fadeIn(function(){
		$.ajax({
			type: "POST",
			async: false,
			url: conexionG + 'muestrarepostajes.php',
			data: { 
			},
			error: function(){

			},
			success: function(data){
				$('#repostajes').html(data);
				$('#repostajes').append('<div onclick="cierraEsto(this)" class="circback circulo circ1" style="position:fixed; opacity:0; top:-20px; right:20px;"><img style="margin:4px;"src="img/whiteCross32__.png"></div>');
				setTimeout(function(){
					$( ".circback" ).animate({
						opacity: 1,
						top: "+=40"
						}, 300, function() {
						// Animation complete.
					});
				},300);
			},
			timeout: 6000
		});	
	});
}
function muestraVehiculos(){
	$('.contenedor').css('display','none');
	$('#vehiculos').css('height','100%')
	$('#vehiculos').html("<div style='float:left; width:100%; line-height:100%; height:100%; text-align:center;'>cargando...</div>");
	$('#vehiculos').css('display','none');
	$('#vehiculos').fadeIn(function(){
		$.ajax({
			type: "POST",
			async: false,
			url: conexionG + 'muestravehiculos.php',
			data: { 
			},
			error: function(){

			},
			success: function(data){
				$('#vehiculos').html(data);
				$('#vehiculos').append('<div onclick="cierraEsto(this)" class="circback circulo circ1" style="position:fixed; opacity:0; top:-20px; right:20px;"><img style="margin:4px;"src="img/whiteCross32__.png"></div>');
				setTimeout(function(){
					$( ".circback" ).animate({
						opacity: 1,
						top: "+=40"
						}, 300, function() {
						// Animation complete.
					});
				},300);
			},
			timeout: 6000
		});	
	});
}
var onSuccess = function(position) {
	/*alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
	suc(position.coords.latitude,position.coords.longitude,position.coords.speed,position.timestamp);
};



var countSuccess = 0;
var insertString = '';
function suc(la,lo,sp,ti){
	var lat_ = la;
	var spe_ = sp;
	if (spe_ > 0){}else{		spe_ = 0;	}
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {		dd='0'+dd	} 	if(mm<10) {		mm='0'+mm	} 
	today = yyyy+''+mm+''+dd;	
	
	var currentdate = new Date(); 
	var sec_ = currentdate.getSeconds(); if (sec_ < 10){sec_ = '0'+sec_;}
	var hor_ = currentdate.getHours(); if (hor_ < 10){hor_ = '0'+hor_;}
	var min_ = currentdate.getMinutes(); if (min_ < 10){min_ = '0'+min_;}
	var horas = hor_ + ":" + min_ +"."+ sec_;

	insertString += ',("'+lat_+'","'+lo+'","'+today+'","'+horas+'","'+spe_+'")';
	//console.log(insertString);
	countSuccess++;
	
	if (countSuccess > 10){
		grabaGeo();
		countSuccess = 0;
	}
}
function clickGpsPos(){
	if ($('.iconGpsPos').hasClass('enGris')){
		$('.iconGpsPos').removeClass('enGris');
	}else{
		$('.iconGpsPos').addClass('enGris');
	}
}
var err = 0;
function onError(error) {
	err++;
    /*alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n'); */
}

//navigator.geolocation.getCurrentPosition(onSuccess, onError);
function getGeo(){
	if (!$('.iconGpsPos').hasClass('enGris')){
		setTimeout(function(){
			navigator.geolocation.getCurrentPosition(onSuccess, onError,{ enableHighAccuracy: true });
			//navigator.geolocation.watchPosition(onSuccess, onError,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
			getGeo()
		},6000);
	}
}
function grabaGeo(){
	var agrabar = insertString;
	insertString = '';
	setTimeout(function(){
		$.ajax({
			type: "POST",
			async: false,
			url: conexionG + 'grabageo.php',
			data: {
				insert_: agrabar.substr(1)
			},
			error: function(){
			},
			success: function(data){
				//alert(data)
			},
			timeout: 6000
		});	
	})	
}