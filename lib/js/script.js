$(function(){
	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');
	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		step(2);
	});
	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt');
		step(2);
	});
	$('#step2 .button').click(function(){
		$(this).parent().find('input').click();
	});
	var file = null;
	$('#step2').on('change', '#encrypt-input', function(e){
		if(e.target.files.length!=1){
			$('#modal-info').html('<div class="alert alert-info fade in pass">'+
      					'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
      					'<p>Choose a file to encrypt!</p>'+
      				'</div>');
			var time = setInterval(function(){$('.alert').alert('close'); clearInterval(time)},3000);
			return false;
		}
		file = e.target.files[0];
		if(file.size > 2048*2048){
			$('#modal-info').html('<div class="alert alert-info fade in">'+
      					'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
      					'<p>Choose files smaller than 2mb.</p>'+
      				'</div>');
			var time = setInterval(function(){$('.alert').alert('close'); clearInterval(time)},3000);
			return;
		}
		step(3);
	});
	$('#step2').on('change', '#decrypt-input', function(e){
		if(e.target.files.length!=1){
			$('#modal-info').html('<div class="alert alert-info fade in">'+
			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
			'<p>Choose a file to decrypt</p>'+      				
			'</div>');
			var time = setInterval(function(){$('.alert').alert('close'); clearInterval(time)},3000);
			return false;
		}
		file = e.target.files[0];
		step(3);
	});

	$('a.button.process').click(function(){
		var input = $(this).parent().find('input[type=password]'),
			a = $('#step4 a.download'),
			password = input.val();
		input.val('');
		if(password.length<5){
			$('#modal-info').html('<div class="alert alert-info fade in">'+
			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
			'<p>Choose a longer password</p>'+      				
			'</div>');
			var time = setInterval(function(){$('.alert').alert('close'); clearInterval(time)},3000);
			return;
		}
		var reader = new FileReader();
		if(body.hasClass('encrypt')){
			reader.onload = function(e){
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encryptor');
				step(4);
			};
			reader.readAsDataURL(file);
		}else {
			reader.onload = function(e){
				var decrypted = CryptoJS.AES.decrypt(e.target.result, password).toString(CryptoJS.enc.Latin1);
				if(!/^data:/.test(decrypted)){
					$('#modal-info').html('<div class="alert alert-info fade in" >'+
					'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
					'<p>Invalid pass phrase or file. Please try again.</p>'+      				
					'</div>');
					var time = setInterval(function(){$('.alert').alert('close'); clearInterval(time)},5000);
					return false;
				}
				a.attr('href', decrypted);
				a.attr('download', file.name.replace('.encryptor',''));
				step(4);
			};
			reader.readAsText(file);
		}
	});

	back.click(function(){
		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});
		step(1);
	});

	function step(i){
		if(i == 1){	back.fadeOut();	}
		else{back.fadeIn();	}
		stage.css('top',(-(i-1)*100)+'%');
	}
});
