/**
 * Main function. Starts the hydra modules.
 * 
 * @param {Object} win Window
 * @param {Object} doc Document
 * @param {Object} ns The object with all the modules and functionalities
 * @param {Object} undefined Redefinition of undefined
 */
(function(win)
{   
    "use strict";
    var fpStartModules = function()
    {
        Hydra.module.start('country_targeting', 'country_targeting_instance');
        Hydra.module.start('countries_available', 'countries_available_instance');
        Hydra.module.start('countries_selected', 'countries_selected_instance');
    };
    
    win.onload = fpStartModules;
}(window));