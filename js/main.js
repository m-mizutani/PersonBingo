// initial parameters
var stop_duration = 10; // second
var person_data = 'person.json';

// global variables
var person_list = null;
var result_list = [];
var status = null;
var current = null;
var next_bingo = 0;

function set_random_image() {
    var tgt = Math.floor (Math.random() * (person_list.length));
    if (current == tgt && person_list.length > 1) {
	set_random_image () ;
	return;
    }
    // console.log (person_list[tgt]);
    // console.log (person_list[tgt]['img']);
    $('#person_img').attr ('src', person_list[tgt]['img']);
    $('#person_name').text (person_list[tgt]['name']);    
    current = tgt;
}

function waiting () {
    if (status != 'wait') {
	return false;
    }
    set_random_image ();
    setTimeout (waiting, 1000);
}

function fast_loop () {
    if (status != 'loop') {
	return false;
    }

    set_random_image ();
    setTimeout (fast_loop, 20);    
}

function goto_wait () {
    $('#record').prepend ('<div class="person">' + 
			  '<p>' + person_list[current]['name'] + '</p>' +
			   '<img src="' + person_list[current]['img'] + '">' + 
			  '</div>');
    result_list.push (person_list[current]);
    person_list.splice (current, 1);

    console.log ('person_list = ' + person_list.length);
    if (person_list.length == 1) {
	set_random_image ();
	$('#status').text('Game set!');
	$('#start').addClass ('disabled_button');	    
	$('#sop').addClass ('disabled_button');	    
	status = 'finish';
    }
    else {
	$('#status').text('Ready!');
	$('#start').removeClass ('disabled_button');	    
	status = 'wait';
	waiting ();
    }
}

function count_down () {
    next_bingo--;
    if (next_bingo <= 0) {
	goto_wait ();	
    }
    else {
	$('#status').text('Next ... ' + next_bingo);
	setTimeout (count_down, 1000);
    }	    
}

function init () {
    console.log ('called init');
    status = 'init';


    $.ajax ({
	type: "GET",
	url: person_data, 
	success: function (res) {
	    person_list = res['person'];
	    console.log (res);
	    $('#status').text('Ready!');
	    status = 'wait';
	    waiting ();
	}});

    $('#start').click (function (res) {
	if (status == 'wait') {
	    status = 'loop';
	    $('#status').text('Click "Stop!"');
	    fast_loop ();
	    $('#start').addClass ('disabled_button');	    
	    $('#stop').removeClass ('disabled_button');	    
	}
    });

    $('#stop').click (function (res) {
	if (status == 'loop') {
	    $('#stop').addClass ('disabled_button');	    
	    status = 'stop';
	    next_bingo = stop_duration;
	    count_down ();
	    // setTimeout (goto_wait, stop_duration * 1000);
	}
    });   

    $('#stop').addClass ('disabled_button');	    
}

$(document).ready (function () {

    init ();
});