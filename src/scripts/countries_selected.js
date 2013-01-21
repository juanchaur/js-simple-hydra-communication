var Namespace = Namespace || {};
Namespace.modules = Namespace.modules || {};


/**
 * This module is used to manage when the countries is added or removed from one list to another
 * @param  {Hydra's bus} oBus 
 * @return {Module}
 */
Namespace.modules.countries_selected = function(oBus)
{
    "use strict";
    var bVisible,
        oCountriesSelected,
        oCountryList,
        oRemove;
     /**
      * Returns an array containing the countries that are selected, and deletes them from the source list
      * @return {Array} Array of selected countries
      */
    function _getSelectedCountriesAndRemove() {
        var aOptions = oCountryList.options,
            nLength = aOptions.length,
            aSelectedCountries = [],
            aToDelete = [],
            oOption,
            i = 0;
            
        for( ; i < nLength; i++ ){
            oOption = aOptions[ i ];
            if(oOption.selected) {
                aSelectedCountries.push( oOption.value );
                aToDelete.push( oOption );
            } 
        }
        
        /* It has to be in this order because if we delete it in the for above, it could cause
         * troubles (we would be modifying the array of options).
         */ 
        while( aToDelete.length ) {
            oOption = aToDelete.pop();
            oCountryList.removeChild( oOption );
        }
        return aSelectedCountries;
    }
    /**
     * Publish an event when the remove button is clicked and remove the selected countries
     */
    function _setRemoveBehaviour()
    {
        /**
         * Gets all the countries selected and sends them through an event publication with the
         * corresponding channel. 
         */
        oRemove.on('click', function() {
            var aSelectedCountries = _getSelectedCountriesAndRemove();
            if( aSelectedCountries.length > 0 ) {
                oBus.publish('ad_creation', 'remove_countries', { 'aSelectedCountries' : aSelectedCountries } );
            }
        });
    }
    /**
     * Privileged methods
     */
    return {
        oEventsCallbacks : {
            'state_changed' : function() {
                bVisible = !bVisible;
                if( bVisible ) {
                    oCountriesSelected.removeClass( 'hidden' );
                    oRemove.removeClass( 'hidden' );
                } else {
                    oCountriesSelected.addClass( 'hidden' );
                    oRemove.addClass( 'hidden' );
                }
            },
            /**
             * Adds the countries received from the channel to the list of selected countries.
             * @param {Object} oData The object containing the list of countries.
             */
            'add_countries' : function( oData ) {
                var oDocFrag = document.createDocumentFragment(),
                    aSelectedCountries = oData.aSelectedCountries,
                    nLength = aSelectedCountries.length,
                    oOption,
                    i = 0;
                    
                for( ; i < nLength; i++ ) {
                    oOption = document.createElement( 'option' );
                    oOption.value = aSelectedCountries[ i ];
                    oOption.innerText = aSelectedCountries[ i ];
                    oDocFrag.appendChild( oOption );
                }
                oCountryList.appendChild( oDocFrag );
            }
        },
        /**
         * Initializes the module and suscribes it to the channels to know if the list must be
         * shown/hidden and if some countries must be added to/removed from the list. 
         */
        init : function() {
            bVisible = false;
            oCountriesSelected = $( document.getElementById( 'countries_selected' ) );
            oCountryList = oCountriesSelected[0].getElementsByTagName( 'select' )[ 0 ];
            oRemove = $( document.getElementById( 'remove_country' ) );
            oBus.subscribe( 'target_by_country', this );
            oBus.subscribe( 'ad_creation' , this );
            _setRemoveBehaviour();
        }
    };
};
/**
 * Register the module into Hydra
 */
Hydra.module.register('countries_selected', Namespace.modules.countries_selected);


