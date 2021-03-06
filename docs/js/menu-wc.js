'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">stellar-sep-0010-server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' : 'data-target="#xs-controllers-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' :
                                            'id="xs-controllers-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' : 'data-target="#xs-injectables-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' :
                                        'id="xs-injectables-links-module-AppModule-833740e05ff5b10efdd25703bf6066183a6cf3b089fc89f2e3df18d0ce100553bf9e8bf2bc92f8b73005e706665de35a0bb2feece8ade7a7afafb21b25dbbb28"' }>
                                        <li class="link">
                                            <a href="injectables/ChallengeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' : 'data-target="#xs-controllers-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' :
                                            'id="xs-controllers-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' : 'data-target="#xs-injectables-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' :
                                        'id="xs-injectables-links-module-AuthModule-a7a1ccef5e217f71b95e0e534d39520b6eb6fa5328732268810a562bbbc90b86fac534b6dc30b0eebce7bb0f0d80f9cbdc041f48dc552930d3ec84621f8f0348"' }>
                                        <li class="link">
                                            <a href="injectables/ChallengeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChallengeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomValidatorsModule.html" data-type="entity-link" >CustomValidatorsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CustomValidatorsModule-62c56c9d22cd5a2b8d658853b70e8428793d1719a616ff8afb6780d3ebd54156b8fea5e0955ab57e6d545d629facc72fb239ac958cef1b1c3596247be118eef3"' : 'data-target="#xs-injectables-links-module-CustomValidatorsModule-62c56c9d22cd5a2b8d658853b70e8428793d1719a616ff8afb6780d3ebd54156b8fea5e0955ab57e6d545d629facc72fb239ac958cef1b1c3596247be118eef3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomValidatorsModule-62c56c9d22cd5a2b8d658853b70e8428793d1719a616ff8afb6780d3ebd54156b8fea5e0955ab57e6d545d629facc72fb239ac958cef1b1c3596247be118eef3"' :
                                        'id="xs-injectables-links-module-CustomValidatorsModule-62c56c9d22cd5a2b8d658853b70e8428793d1719a616ff8afb6780d3ebd54156b8fea5e0955ab57e6d545d629facc72fb239ac958cef1b1c3596247be118eef3"' }>
                                        <li class="link">
                                            <a href="injectables/hasValidSignatures.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >hasValidSignatures</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/isValidChallenge.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >isValidChallenge</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Challenge.html" data-type="entity-link" >Challenge</a>
                            </li>
                            <li class="link">
                                <a href="classes/isEd25519.html" data-type="entity-link" >isEd25519</a>
                            </li>
                            <li class="link">
                                <a href="classes/isNotMuxedAccount.html" data-type="entity-link" >isNotMuxedAccount</a>
                            </li>
                            <li class="link">
                                <a href="classes/isXDR.html" data-type="entity-link" >isXDR</a>
                            </li>
                            <li class="link">
                                <a href="classes/Token.html" data-type="entity-link" >Token</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});