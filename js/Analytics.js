Analytics = (function() {
	var init = function() {
		
    }
    
	/**
	 * Sends a Google Analytics screen change
	 * @param {string} screen     The name of the screen view, when it changes
	 */
	var sendAnalyticsScreen = function(screen) {
	    ga('send', 'screenview', { screenName: screen });
	}
	
	/**
	 * Sends a Google Analytics custom event
	 * @param {string} category     Typically the object that was interacted with (e.g. 'Video')
	 * @param {string} action       The type of interaction (e.g. 'play')
	 * @param {string} label        Useful for categorizing events (e.g. 'Fall Campaign')
	 */
	var sendAnalyticsEvent = function(category, action, label) {
	    if (label){
	        ga('send', {
	          hitType: 'event',
	          eventCategory: category,
	          eventAction: action,
	          eventLabel: label
	        });
	    } else {
	        ga('send', {
	          hitType: 'event',
	          eventCategory: category,
	          eventAction: action
	        });
	    }
	}
	
	/**
	 * Sends a Google Analytics custom timing event
	 * @param {string} category     A string for categorizing all user timing variables into logical groups (e.g. 'JS Dependencies')
	 * @param {string} variable     A string to identify the variable being recorded (e.g. 'load')
	 * @param {string} label        A string that can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN')
	 * @param {string} value        The number of milliseconds in elapsed time to report to Google Analytics (e.g. 20)
	 */
	var sendAnalyticsTiming = function(category, variable, label, value) {
	    if (label){
	        ga('send', {
	          hitType: 'timing',
	          timingCategory: category,
	          timingVar: variable,
	          timingLabel: label,
	          timingValue: value
	        });
	    } else {
	        ga('send', {
	          hitType: 'timing',
	          timingCategory: category,
	          timingVar: variable,
	          timingValue: value
	        });
	    }
	}
	
    return {
        init: init,
        sendAnalyticsScreen: sendAnalyticsScreen,
        sendAnalyticsEvent: sendAnalyticsEvent,
        sendAnalyticsTiming: sendAnalyticsTiming
    }

})();