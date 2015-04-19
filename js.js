var mac = '';
$(document).ready(function(){
	esTelefono = false;
	conexionG = ""; //WEB
	if (location.href.indexOf("http://") == -1){
		esTelefono = true;
		conexionG = "http://www.blued.es/mambo/worker/"; //ANDROID
	}
	if (esTelefono == true){
		document.addEventListener("deviceready", onDeviceReady, false);
	}else{
		onWebReady();
	}
});

$.event.special.tap = {
  // Abort tap if touch moves further than 10 pixels in any direction
  distanceThreshold: 10,
  // Abort tap if touch lasts longer than half a second
  timeThreshold: 500,
  setup: function() {
    var self = this,
      $self = $(self);

    // Bind touch start
    $self.on('touchstart', function(startEvent) {
      // Save the target element of the start event
      var target = startEvent.target,
        touchStart = startEvent.originalEvent.touches[0],
        startX = touchStart.pageX,
        startY = touchStart.pageY,
        threshold = $.event.special.tap.distanceThreshold,
        timeout;

      function removeTapHandler() {
        clearTimeout(timeout);
        $self.off('touchmove', moveHandler).off('touchend', tapHandler);
      };

      function tapHandler(endEvent) {
        removeTapHandler();

        // When the touch end event fires, check if the target of the
        // touch end is the same as the target of the start, and if
        // so, fire a click.
        if (target == endEvent.target) {
          $.event.simulate('tap', self, endEvent);
        }
      };

      // Remove tap and move handlers if the touch moves too far
      function moveHandler(moveEvent) {
        var touchMove = moveEvent.originalEvent.touches[0],
          moveX = touchMove.pageX,
          moveY = touchMove.pageY;

        if (Math.abs(moveX - startX) > threshold ||
            Math.abs(moveY - startY) > threshold) {
          removeTapHandler();
        }
      };

      // Remove the tap and move handlers if the timeout expires
      timeout = setTimeout(removeTapHandler, $.event.special.tap.timeThreshold);

      // When a touch starts, bind a touch end and touch move handler
      $self.on('touchmove', moveHandler).on('touchend', tapHandler);
    });
  }
};

function onDeviceReady(){
	//mac = device.uuid;
	//FastClick.attach(document.body);
	onWebReady();
}

function onWebReady(){
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
					$("#inicio").css('display','block');
					
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