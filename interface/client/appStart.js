

// STOP here if not MAIN WINDOW
if(location.hash)
    return;


// set browser as default tab
if(!LocalStore.get('selectedTab'))
    LocalStore.set('selectedTab', 'wallet');

/**
The init function of Mist

@method mistInit
*/
mistInit = function(){
    console.info('Initialise Mist');

    if (0 <= location.search.indexOf('reset-tabs')) {
        console.info('Resetting UI tabs');
        
        Tabs.remove({});
    }


    if(!Tabs.findOne('browser')) {
        console.debug('Insert tabs');

        Tabs.insert({
            _id: 'browser',
            url: 'https://ethereum.org',
            position: 0
        });
    }

    Tabs.upsert({_id: 'wallet'}, {
        url: 'https://wallet.ethereum.org',
        position: 1,
        permissions: {
            admin: true
        }
    });


    EthAccounts.init();
    EthBlocks.init();
};


Meteor.startup(function(){
    console.info('Meteor starting up...');

    // check that it is not syncing before
    web3.eth.getSyncing(function(e, sync) {
        if(e || !sync)
            mistInit();
    });


    console.debug('Setting language');

    // SET default language
    if(Cookie.get('TAPi18next')) {        
        TAPi18n.setLanguage(Cookie.get('TAPi18next'));
    } else {
        var userLang = navigator.language || navigator.userLanguage,
        availLang = TAPi18n.getLanguages();

        // set default language
        if (_.isObject(availLang) && availLang[userLang]) {
            TAPi18n.setLanguage(userLang);
        } else if (_.isObject(availLang) && availLang[userLang.substr(0,2)]) {
            TAPi18n.setLanguage(userLang.substr(0,2));
        } else {
            TAPi18n.setLanguage('en');
        }
    }
    // change moment and numeral language, when language changes
    Tracker.autorun(function(){
        if(_.isString(TAPi18n.getLanguage())) {
            var lang = TAPi18n.getLanguage().substr(0,2);
            moment.locale(lang);
            numeral.language(lang);
            EthTools.setLocale(lang);
        }
    });
});

