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
	suc(position.coords.latitude,position.coords.longitude,position.coords.speed,position.timestamp)
   /* alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
};
var countSuccess = 0;
var insertString = '';
function suc(la,lo,sp,ti){
	var lat_ = la;
	var spe_ = sp;
	if (spe_ > 0){}else{
		spe_ = 0;
	}
	insertString += ',("'+lat_+'","'+lo+'","'+spe_+'","'+ti+'")';
	countSuccess++;
	if (countSuccess > 10){
		grabaGeo();
		countSuccess = 0;
	}
}
// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

//navigator.geolocation.getCurrentPosition(onSuccess, onError);
function getGeo(){
	setTimeout(function(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		getGeo()
	},5000);
}
function grabaGeo(){
	var loc_lat = lat.join('|');
	var loc_lon = lon.join('|');
	var loc_spe = spe.join('|');
	var loc_tim = tim.join('|');
	lat = [];
	lon = [];
	spe = [];
	tim = [];
	setTimeout(function(){
		$.ajax({
			type: "POST",
			async: false,
			url: conexionG + 'grabageo.php',
			data: {
				insert_: insertString.substr(1)
			},
			error: function(){
			},
			success: function(data){
				alert(data)
			},
			timeout: 6000
		});	
	})	
}