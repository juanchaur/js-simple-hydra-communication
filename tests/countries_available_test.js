(function(win, doc, ns, hydra)
{
    function commonSetUp() {
        var self = this;
        this.oModule = null;
        hydra.setTestFramework( 'jstestdriver' );
        hydra.module.test( "countries_available", function( oModule ) {
            self.oModule = oModule;
        });
    };
    
    function commonTearDown() {};
            
    TestCase("Modules_countries_available", sinon.testCase( {
        setUp : function () {
            commonSetUp.call( this );
            /*:DOC +=
            <section id="countries_available" class="hidden">
                <header>
                    <h1>Countries available</h1>
                </header>
                <select multiple="multiple">
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                </select>
            </section>
            <input type="button" id="add_country" class="hidden" value="Add"/>
            */
            this.oCountriesAvailable = doc.getElementById( 'countries_available' );
            this.oAddButton = doc.getElementById( 'add_country' );
            this.oCountryList = this.oCountriesAvailable.getElementsByTagName( 'select' )[ 0] ;
            this.aOptions = [ this.oCountryList.options[ 0 ], this.oCountryList.options[ 1 ] ];
            this.oModule.init();
        },
        tearDown: function () {
            commonTearDown.call( this );
            this.oCountriesAvailable = null,
            this.oAddButton = null;            
        },
        "test that the changes in the radio buttons shows/hides the country list and the add button" : function() {
            assertClassName( 'hidden', this.oCountriesAvailable );
            assertClassName( 'hidden', this.oAddButton );           
            hydra.bus.publish('target_by_country', 'state_changed', {} );
            assertEquals( "", this.oCountriesAvailable.className );           
            assertEquals( "", this.oAddButton.className );
            hydra.bus.publish('target_by_country', 'state_changed', {} );
            assertClassName( "hidden", this.oCountriesAvailable );           
            assertClassName( "hidden", this.oAddButton );
        },
        "test that clicking add button with no options selected makes nothing" : function() {
            sinon.spy( hydra.bus, 'publish' );
            $(this.oAddButton).trigger( 'click' );
            assertFalse(hydra.bus.publish.withArgs( 'ad_creation', 'add_countries' ).calledOnce );
            hydra.bus.publish.restore();
        },
        "test that clicking add button with some countries selected disables them from the list of available" : function() {
            //With only one country selected
            this.aOptions[ 0 ].selected = true;
            assertFalse( this.aOptions[ 0 ].disabled );
            assertFalse( this.aOptions[ 1 ].disabled );
            $( this.oAddButton).trigger( 'click' );
            assertTrue( this.aOptions[ 0 ].disabled );
            assertFalse( this.aOptions[ 1 ].disabled );
            
            //With more than one country selected
            this.aOptions[ 0 ].disabled = false;
            this.aOptions[ 0 ].selected = true;
            this.aOptions[ 1 ].selected = true;
            assertFalse(this.aOptions[ 0 ].disabled );
            assertFalse(this.aOptions[ 1 ].disabled );
            $(this.oAddButton).trigger( 'click' );
            assertTrue(this.aOptions[ 0 ].disabled );
            assertTrue(this.aOptions[ 1 ].disabled );
        },
        "test that clicking add button with some countries selected deselected them" : function() {
            this.aOptions[ 0 ].selected = true;
            this.aOptions[ 1 ].selected = true;
            $(this.oAddButton).trigger('click');
            assertFalse(this.aOptions[ 0 ].selected );
            assertFalse(this.aOptions[ 1 ].selected );
        },
        "test that clicking add button with some countries selected sends them with an event publication" : function() {
            //With one country selected
            this.aOptions[ 0 ].selected = true;
            sinon.spy( hydra.bus, 'publish' );
            $( this.oAddButton ).trigger( 'click' );
            assertTrue(hydra.bus.publish.withArgs( 'ad_creation', 'add_countries', {'aSelectedCountries' : [ 'Australia' ] } ).calledOnce );
            
            //With more than one country selected
            this.aOptions[ 0 ].disabled = false;
            this.aOptions[ 0 ].selected = true;
            this.aOptions[ 1 ].selected = true;
            $(this.oAddButton).trigger( 'click' );
            assertTrue(hydra.bus.publish.withArgs( 'ad_creation', 'add_countries', {'aSelectedCountries' : [ 'Australia', 'Austria' ] } ).calledOnce);
            hydra.bus.publish.restore();
        },
        "test that the countries received in a 'remove_countries' event publication are successfully restored" : function() {
            //Only one country restored disabled and then restored
            this.aOptions[ 1 ].selected = true;
            $( this.oAddButton ).trigger( 'click' );
            assertTrue( this.aOptions[ 1 ].disabled );
            hydra.bus.publish( 'ad_creation', 'remove_countries', { 'aSelectedCountries' : [ 'Austria' ] } );
            assertFalse( this.aOptions[ 1 ].disabled );
            
            //More than one country disabled but only one restored
            this.aOptions[ 0 ].selected = true;
            this.aOptions[ 1 ].selected = true;
            $(this.oAddButton).trigger('click');
            assertTrue(this.aOptions[ 0 ].disabled );
            assertTrue(this.aOptions[ 1 ].disabled );
            hydra.bus.publish( 'ad_creation', 'remove_countries', {'aSelectedCountries' : [ 'Australia' ] } );
            assertFalse( this.aOptions[ 0 ].disabled );
            assertTrue( this.aOptions[ 1 ].disabled );
            
            //More than one country disabled and more than one country restored
            this.aOptions[ 0 ].selected = true;
            this.aOptions[ 1 ].selected = true;
            $( this.oAddButton ).trigger( 'click' );
            assertTrue( this.aOptions[ 0 ].disabled );
            assertTrue( this.aOptions[ 1 ].disabled );
            hydra.bus.publish( 'ad_creation', 'remove_countries', { 'aSelectedCountries' : [ 'Australia', 'Austria' ] } );
            assertFalse( this.aOptions[ 0 ].disabled );
            assertFalse( this.aOptions[ 1 ].disabled );
        }
    } ) );
} )( window, document, Namespace, Hydra );
