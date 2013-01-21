var Namespace = Namespace || {};
Namespace.modules = Namespace.modules || {};

/**
 * This module activates and deactivates the option of selecting countries.
 * @param {Object} oBus Hydra's bus.
 */
Namespace.modules.country_targeting = function(oBus)
{
    "use strict";
    var oRadioYes,
        oRadioNo;
    
    return {
        /**
         * Makes every radio button publish an event when selected. That way the selection of
         * countries can be enabled or disabled.
         */
        init : function() {
            oRadioYes = $( document.getElementById( 'radio_yes' ) );
            oRadioNo = $( document.getElementById( 'radio_no' ) );

            oRadioYes.on( 'change', function() {
                oBus.publish('target_by_country', 'state_changed', {} );
            });
            oRadioNo.on( 'change', function() {
                oBus.publish( 'target_by_country', 'state_changed', {}) ;
            });
        }
    };
};
/**
 * Register the module into Hydra
 */
Hydra.module.register('country_targeting', Namespace.modules.country_targeting);