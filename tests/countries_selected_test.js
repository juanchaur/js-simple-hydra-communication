(function(win, doc, ns, hydra)
{
    function commonSetUp() {
        var self = this;
        this.oModule = null;
        hydra.setTestFramework( 'jstestdriver' );
        hydra.module.test( "countries_selected", function( oModule ) {
            self.oModule = oModule;
        });
    };
    
    function commonTearDown() {};
            
    TestCase("Modules_countries_selected", sinon.testCase( {
        setUp : function () {
            commonSetUp.call( this );
            /*:DOC +=
            <input type="button" id="remove_country" class="hidden" value="Remove"/>
            <section id="countries_selected" class="hidden">
                <header>
                    <h1>Countries selected</h1>
                </header>
                <select multiple="multiple">
                </select>
            </section>
            */
            this.oCountriesSelected = doc.getElementById( 'countries_selected' );
            this.oRemoveButton = doc.getElementById( 'remove_country' );
            this.oCountryList = this.oCountriesSelected.getElementsByTagName( 'select' )[ 0 ];
            this.oModule.init();
        },
        tearDown: function () {
            commonTearDown.call( this );
            this.oCountriesSelected = null,
            this.oRemoveButton = null;            
        },
        "test that the changes in the radio buttons shows/hides the country list and the remove button" : function() {
            assertClassName( 'hidden', this.oCountriesSelected );
            assertClassName( 'hidden', this.oRemoveButton );           
            hydra.bus.publish('target_by_country', 'state_changed', {} );
            assertEquals( "", this.oCountriesSelected.className );           
            assertEquals( "", this.oRemoveButton.className );
            hydra.bus.publish( 'target_by_country', 'state_changed', {} );
            assertClassName( "hidden", this.oCountriesSelected );           
            assertClassName( "hidden", this.oRemoveButton );
        },
        "test that clicking remove button with no options selected makes nothing" : function() {
            sinon.spy( hydra.bus, 'publish' );
            $( this.oRemoveButton).trigger( 'click' );
            assertFalse( hydra.bus.publish.withArgs( 'ad_creation', 'remove_countries' ).calledOnce );
            hydra.bus.publish.restore();
        },
        "test that clicking remove button with some countries selected removes them" : function() {
            var nLength,
                i = 0,
                aOptions;
                
            /*:DOC oOption1 = <option value="Australia">Australia</option>*/
            /*:DOC oOption2 = <option value="Austria">Austria</option>*/
            /*:DOC oOption3 = <option value="Brazil">Brazil</option>*/
            this.oCountryList.appendChild( this.oOption1 );
            this.oCountryList.appendChild( this.oOption2 );
            this.oCountryList.appendChild( this.oOption3 );
            assertEquals(3, this.oCountryList.options.length);
            
            //With only one country selected
            this.oOption1.selected = true;
            $(this.oRemoveButton).trigger('click');
            aOptions = this.oCountryList.options;
            assertEquals(2, aOptions.length);          
            
            for(nLength = aOptions.length; i < nLength; i++)
            {
                assertNotEquals("Australia", aOptions[i].value);
            }
            
            //With more than one country selected
            this.oOption2.selected = true;
            this.oOption3.selected = true;
            $(this.oRemoveButton).trigger( 'click');
            aOptions = this.oCountryList.options;
            assertEquals( 0, aOptions.length );
        },
        "test that clicking remove button with some countries selected sends them with an event publication" : function() {
            /*:DOC oOption1 = <option value="Australia">Australia</option>*/
            /*:DOC oOption2 = <option value="Austria">Austria</option>*/
            /*:DOC oOption3 = <option value="Brazil">Brazil</option>*/
            this.oCountryList.appendChild( this.oOption1 );
            this.oCountryList.appendChild( this.oOption2 );
            this.oCountryList.appendChild( this.oOption3 );
            assertEquals( 3, this.oCountryList.options.length );
            sinon.spy( hydra.bus, 'publish' );
            
            //With one country selected
            this.oOption1.selected = true;
            $(this.oRemoveButton).trigger( 'click' );
            assertTrue(hydra.bus.publish.withArgs( 'ad_creation', 'remove_countries', { 'aSelectedCountries' : [ 'Australia' ] } ).calledOnce);
            
            //With more than one country selected
            this.oOption2.selected = true;
            this.oOption3.selected = true;
            $(this.oRemoveButton).trigger( 'click' );
            assertTrue(hydra.bus.publish.withArgs( 'ad_creation', 'remove_countries', {'aSelectedCountries' : ['Austria', 'Brazil'] ).calledOnce);
            
            hydra.bus.publish.restore();
        },
        "test that the countries received in a 'add_countries' event publication are successfully\ 
        added to the list" : function()
        {
            var aOptions;
            
            //Only one country received
            assertEquals( 0, this.oCountryList.options.length );
            hydra.bus.publish( 'ad_creation', 'add_countries', {'aSelectedCountries' : ['Australia'] } );
            aOptions = this.oCountryList.options;
            assertEquals( 1, aOptions.length );
            assertEquals( 'Australia', aOptions[ 0 ].value );
            
            //More than one country received
            hydra.bus.publish('ad_creation', 'add_countries', {'aSelectedCountries' : ['Austria', 'Brazil']});
            aOptions = this.oCountryList.options;
            assertEquals(3, aOptions.length);
            assertEquals('Australia', aOptions[0].value);
            assertEquals('Austria', aOptions[1].value);
            assertEquals('Brazil', aOptions[2].value);
        }
    }));
})(window, document, Namespace, Hydra);
