var mac = '';

$(document).ready(function(){
	esTelefono = false;
	conexionG = ""; //WEB
	if (location.href.indexOf("http://") == -1){
		esTelefono = true;
		conexionG = "http://www.blued.es/mambo/worker/"; //ANDROID 
		
	}
	if (esTelefono == true){
		alert("android")
		document.addEventListener("deviceready", onWebReady, false);
	}else{
		alert("web");
		onWebReady();
	}
});


function onWebReady(){
	FastClick.attach(document.body);
	checkUser('inicio');
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
	$.ajax({
		type: "POST",
		async: false,
		url: conexionG + 'muestrarepostajes.php',
		data: { 
		},
		error: function(){

		},
		success: function(data){
			alert(data)
			$('#repostajes').html(data);
		},
		timeout: 6000
	});	
}