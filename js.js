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

function repostajes(){
	$('.contenedor').css('display','none');
	$('#repostajes').css('display','block');
	$('#repostajes').html("Espera mientras se cargan los datos...");
	setTimeout(function(){
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
			},
			timeout: 6000
		});	
	})
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
	var hor_ = currentdate.getHours(); if (hor_ < 10){hor_ = '0'+hor_;}
	var min_ = currentdate.getMinutes(); if (min_ < 10){min_ = '0'+min_;}
	var horas = + hor_ + ":" + min_;

	insertString += ',("'+lat_+'","'+lo+'","'+today+'","'+horas+'","'+spe_+'")';
	//console.log(insertString);
	countSuccess++;
	$('#posicionesRecogidas').text(countSuccess);
	if (countSuccess > 10){
		grabaGeo();
		countSuccess = 0;
	}
}
function verPosicionesQuery(){
	alert(insertString)
}
// onError Callback receives a PositionError object
//
var err = 0;
function onError(error) {
	err++;
    /*alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n'); */
}

//navigator.geolocation.getCurrentPosition(onSuccess, onError);
function getGeo(){
	setTimeout(function(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError,{ enableHighAccuracy: true });
		//navigator.geolocation.watchPosition(onSuccess, onError,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
		getGeo()
	},6000);
}
function grabaGeo(){
	var agrabar = insertString;
	insertString = '';
	alert(agrabar)
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