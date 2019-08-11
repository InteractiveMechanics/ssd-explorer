Utilities = (function() {
	var timeout = [];
	var duration = 150000; // 2.5 minutes
    var longDuration = 160000; // 2.5 minutes + 10 seconds
	
	var init = function() {
        bindEvents();
    }
    
    var bindEvents = function() {
	    $(document).on('click tap drag', resetTimeout);
    }
    
    var resetTimeout = function() {
	    console.log("RESET");
	    
	    if (timeout) {
            $.each(timeout, function(index, value){
                clearTimeout(value);
                timeout.splice(index, 1);
            });
        }
        timeout.push(setTimeout(showMoreTimeModal, duration));
        timeout.push(setTimeout(resetInteractive, longDuration));
    }
    
    var showMoreTimeModal = function() {
	    console.log("SHOW MORE TIME MODAL");
    }

    var resetInteractive = function() {
	    UI.openAttract();
		UI.closePanels();
		UI.moveMapToLatLon(39.9502404, -75.1592545, 11.2, 0, 0, 0);
    }

    var resetBrowser = function() {
        location.reload();
    }
        
    return {
        init: init,
        resetInteractive: resetInteractive,
        resetTimeout: resetTimeout
    }

})();