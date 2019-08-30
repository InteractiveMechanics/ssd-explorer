Utilities = (function() {
	var timeout = [];
	var duration = 150000; // 2.5 minutes
    var longDuration = 165000; // 2.5 minutes + 15 seconds
	
	var init = function() {
        bindEvents();
    }
    
    var bindEvents = function() {
	    $(document).on('click tap drag', resetTimeout);
    }
    
    var resetTimeout = function() {
	    if (timeout) {
            $.each(timeout, function(index, value){
                clearTimeout(value);
                timeout.splice(index, 1);
            });
        }
        
        hideMoreTimeModal();
        timeout.push(setTimeout(showMoreTimeModal, duration));
        timeout.push(setTimeout(resetInteractive, longDuration));
    }
    
    var showMoreTimeModal = function() {
		$('#outro').removeClass('d-none');
	    setTimeout(function() {
		    $('#outro').addClass('show');
	    }, 100);
    }
    
    var hideMoreTimeModal = function() {
	    $('#outro').removeClass('show');
	    setTimeout(function() {
		    $('#outro').addClass('d-none');
	    }, 500);
    }

    var resetInteractive = function() {
	    hideMoreTimeModal();
	    
	    Search.clearSearchResults();
	    UI.openAttract();
		UI.closePanels();
		UI.destroyGallery();
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