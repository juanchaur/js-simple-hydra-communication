(function(win, doc, ns, hydra) {
    function commonSetUp() {
        var self = this;
        
        this.oModule = null;
        hydra.setTestFramework('jstestdriver');
        hydra.module.test("country_targeting", function(oModule)
        {
            self.oModule = oModule;
        });
        
    };
    
    function commonTearDown() {};
            
    TestCase("Modules_country_targeting_init", sinon.testCase( {
        setUp : function () {
            commonSetUp.call(this);
        },
        tearDown: function () {
            commonTearDown.call( this );
        },
        "test that clicking on the radio buttons makes the module publish the proper event in proper channel" : function() {
            /*:DOC +=
            <section>
                <header>
                    <h1>Do you want to target by country?</h1>
                </header>
                <input type="radio" id="radio_yes" name="target_by_country" />
                <label for="radio_yes">Yes</label>
                <input type="radio" id="radio_no" name="target_by_country" checked />
                <label for="radio_no">No</label>
            </section>
            */
            
            this.oModule.init();
            sinon.spy(hydra.bus, 'publish');
            $(document.getElementById('radio_yes')).trigger('change');
            assertTrue(hydra.bus.publish.withArgs('target_by_country', 'state_changed').calledOnce);            
            $(document.getElementById('radio_no')).trigger('change');
            assertTrue(hydra.bus.publish.withArgs('target_by_country', 'state_changed').calledTwice);
            hydra.bus.publish.restore();            
        }
    }));
})(window, document, Namespace, Hydra);
