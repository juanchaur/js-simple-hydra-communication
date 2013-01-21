
var Namespace = Namespace || {};
Namespace.modules = Namespace.modules || {};

/**
 * This module is used to manage the countries to select and the add button behavior. This is used to
 * hide and show the list of the countries available and also the button by publishing an event.
 * @param  {Hydra's bus} oBus 
 * @return {Module}
 */
Namespace.modules.countries_available = function( oBus ) {
    "use strict";
    var oCountriesAvailable,
        aListOfCountries,
        oAddButton,
        bVisible;
    /**
     * Publishes an event when the add button has been clicked
     */
    function _setAddBehaviour()
    {
        /**
         * Gets all the countries selected and sends them through an event publication with the
         * corresponding channel. 
         */
        oAddButton.on('click', function() {
            var aSelectedCountries = _getSelectedCountriesAndDisable();
            if( aSelectedCountries.length > 0 ) {
                oBus.publish('ad_creation', 'add_countries', { 'aSelectedCountries' : aSelectedCountries } );
            }
        });
    }
    /**
     * Enables the countries that were disabled.
     * @param {Array} aCountries The list of countries removed from the "countries selected" list.
     * @return {None}
     */
    function _enableCountries( aCountries ) {
        var nLength = aListOfCountries.length,
        i = 0;
                   
        for( ; i < nLength; i++ ) {
            //If the country is in the list of the countries received from the event
            if( aCountries.indexOf( aListOfCountries[i].value ) !== -1 ) {
                aListOfCountries[ i ].disabled = false;
            }
        }
    }
    /**
     * Disables a given country from the available list
     * @param  {Object} oCountry country to be disable
     * @return {None}
     */
    function _disableCountry( oCountry ) {
        oCountry.disabled = 'disabled';
    }
    /**
     * Disables all the selected countries
     * @return {Array} returns an array containing the name of the countries that have been disabled.
     */
    function _getSelectedCountriesAndDisable() {
        var nLength = aListOfCountries.length,
            aSelectedCountries = [],
            oOption,
            i = 0;

        for( ; i < nLength; i++ ) {
            oOption = aListOfCountries[ i ];
            if( oOption.selected ) {
                _disableCountry( oOption) ;
                aSelectedCountries.push( oOption.value );
                oOption.selected = false;
            } 
        }
        return aSelectedCountries;
    }
    /**
     * Privileged methods
     */
    return {
        oEventsCallbacks : {
            /**
             * shows or hides the list of countries and the button.
             */
            'state_changed' : function()
            {
                bVisible = !bVisible;
                if( bVisible ) {
                    oCountriesAvailable.removeClass( 'hidden' );
                    oAddButton.removeClass( 'hidden' );
                } else { 
                    oCountriesAvailable.addClass( 'hidden' );
                    oAddButton.addClass( 'hidden' );
                }
            },
            /**
             * Enables the countries received from the event
             * @param  {Object} oData Data containing the countries that can be enable
             * @return {None}
             */
            'remove_countries' : function(oData) {
                _enableCountries(oData.aSelectedCountries);
            }
        },
        /**
         * Initializes the given module and subscribe it to a specify channel to get whether the yes/no
         * button is click so the list of countries can be showed or hidden.
         * @return {None}
         */
        init : function() {
            bVisible = false;
            oCountriesAvailable = $(document.getElementById('countries_available'));
            aListOfCountries = oCountriesAvailable[0].getElementsByTagName('select')[0].options;
            oAddButton = $(document.getElementById('add_country'));
            oBus.subscribe('target_by_country', this);
            oBus.subscribe('ad_creation', this);
            _setAddBehaviour();
        }
    };
};
/**
 * Registers the module into Hydra
 */
Hydra.module.register('countries_available', Namespace.modules.countries_available);

