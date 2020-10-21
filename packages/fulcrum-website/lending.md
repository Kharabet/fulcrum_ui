---
layout: lending
featured-image: /images/ogp.png
metadescription: "Earn interest on your idle crypto and stablecoins. Flexible High-Yield Returns – No Minimum Deposit, no lock up period, withdraw anytime."
title: DeFi Crypto Lending Platform Fulcrum | bZx
permalink: lending
---

<section class="bg-primary bg-secondary-image pb-90 pb-xs-45">
    {% include header.html %}
    <div class="container pt-90 pb-60 pb-xs-0 text-xs-center">
        <div class="row">
            <div class="col col-10 col-xs-12">
                <div class="pl-55 pl-lg-0">
                    <h1 class="mb-40">Earn Interest on Crypto</h1>
                    <p class="fs-16 lh-160 mb-50 mx-xs-auto mb-xs-30 c-secondary mw-390">Flexible, high-yield returns – no minimum deposit, no lock-up period, withdraw anytime.</p>
                    <div class="flex fd-xs-c">
                        <div class="flex ai-c wrap-white mr-25 mx-xs-auto apr-component" data-token="dai">
                            <div class="icon-66 icon-sm-40 mr-15 flex ai-c">
                                {% include svg/dai.svg %}
                            </div>
                            <div class="flex">
                                <p class="fs-40 lh-100 c-primary-blue mr-15 mr-sm-5"><span class="fw-800 apr-value">7.2</span>%</p>
                                <span class="fs-18 lh-140 fw-600 c-gray">APR</span>
                            </div>
                        </div>
                        <div class="flex ai-c wrap-white mr-25 mx-xs-auto apr-component" data-token="usdc">
                            <div class="icon-66 icon-sm-40 mr-15 flex ai-c">
                                {% include svg/usdc.svg %}
                            </div>
                            <div class="flex">
                                <p class="fs-40 lh-100 c-primary-blue mr-15 mr-sm-5"><span class="fw-800 apr-value">6.5</span>%</p>
                                <span class="fs-18 lh-140 fw-600 c-gray">APR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container pt-60 pt-xs-30 pb-120 pb-xs-75">
        <div class="row fd-md-c">
            <div class="col col-5 col-lg-3 col-md-12">
                <div class="pl-55 pl-lg-0">
                    <h2 class="mb-md-25">Fulcrum <br /> supports lending</h2>
                </div>
            </div>
            <div class="col col-7 col-lg-9 col-md-12 apr-wrapper">
                {% for token in site.data.products %}
                    {% if token.visibilityApr %}
                        <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="{{token.name}}">
                            <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                                {% include svg/{{token.name}}.svg %}
                            </div>
                            <div class="wrap-apr-value">
                                <p class="lh-100 fw-700 c-gray text-uppercase">{{token.name}}</p>
                                <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                            </div>
                        </div>
                    {% endif %}
                {% endfor %}
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row fw-sm-w">
            <div class="col col-6 col-sm-12 fd-c">
                <h2 class="circle mb-25"><span class="green left-165 top-r-10"></span>Who are <br />the borrowers?</h2>
                <div class="pl-90 pl-md-60 c-primary">
                    <p class="mb-10">Borrowers are individuals who want to use their digital assets to build leveraged positions. This is also referrred to as “margin trading.” Fulcrum enables borrowers to create a leveraged position by borrowing assets from lenders.</p>
                </div>
            </div>
            <div class="col col-6 col-sm-12 fd-c">
                <h2 class="circle mb-25"><span class="big purple left-35 bottom-r-50 "></span>Where does the <br/> interest come from? </h2>
                <div class="pl-90 pl-md-60 c-primary">
                    <p class="mb-10">The interest paid to lenders comes from the fees paid by borrowers in exchange for access to liquidity when trading on margin. Fulcrum extends the bZx protocol by giving users the ability to create tokenized loans and margin positions.
              </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!--section class="bg-secondary before-primary">
    <div class="container">
        <div class="row">
            <div class="col col-12">
                <div class="item-green py-40 p-sm-30 flex jc-c">
                    <div class="col-10 col-md col-md-12 fd-c jc-sb">
                        <p class="fs-24 fs-xs-20 fw-800 lh-150 mb-xs-15">Battle-Tested</p>
                        <p class="fs-44 fs-xs-28 fw-900 mb-15 lh-140 c-light-green">Currently in Fulcrum</p>
                        <div class="flex jc-sb fd-sm-c fs-44 fs-md-36 fw-900 lh-140">
                            <div class="flex-xs fw-400">
                                $<span class="fw-900 tvl-value" data-token="all">3,000,000</span>
                            </div>
                            <div class="flex ai-c">
                                <div class="icon-40 icon-xs-30 icon-border-2 mr-10 mr-xs-20">
                                    {% include svg/eth.svg %}
                                </div>
                                <span class="tvl-value" data-token="eth">10,000</span>
                            </div>
                            <div class="flex ai-c">
                                <div class="icon-40 icon-xs-30 icon-border-2 mr-10 mr-xs-20">
                                    {% include svg/dai.svg %}
                                </div>
                                <span class="tvl-value" data-token="dai">10,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section-->

<section class="bg-secondary pt-105 pb-75 pb-xs-60 text-center">
    <div class="container">
        <h2 class="mb-75 mb-xs-50 circle"><span class="purple center top-r-60"></span>How safe is it?</h2>
        <div class="flex fw-md-w jc-sb">
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-40 mb-xs-15">
                    {% include svg/icon-safe-4.svg %}
                </div>
                <h3 class="mb-20">Overcollateralized</h3>
                <p>Borrowers must maintain the collateral-to-loan ratio specified by the terms of the loan or the collateral will be liquidated to repay the lender and maintain sufficient liquidity for dApps using the protocol.
                </p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-40 mb-xs-15">
                    {% include svg/icon-safe-5.svg %}
                </div>
                <h3 class="mb-20">Secure Oracles</h3>
                <p>Chainlink’s <a href="https://feeds.chain.link/">decentralized oracle network</a> is used for price information.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-40 mb-xs-15">
                    {% include svg/icon-safe-1.svg %}
                </div>
                <h3 class="mb-20">Audited Smart Contracts</h3>
                <p>The bZx base protocol has been successfully audited by leading blockchain security auditor ZK Labs, headed by Matthew DiFerrante, Dean Eigenmann, Nick Johnson, and Harry Roberts and available <a href="https://github.com/mattdf/audits/blob/master/bZx/bzx-audit.pdf">here.</a></p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-40 mb-xs-15">
                    {% include svg/icon-safe-2.svg %}
                </div>
                <h3 class="mb-20">Insurance fund</h3>
                <p>10% of the interest paid by borrowers goes to an Insurance Fund for mitigating potential losses suffered by lenders in the event that undercollateralized loans are not properly liquidated.
      </p>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-60 pb-90" id="calculator-earn">
    <div class="container">
        <div class="row">
        <div class="col col-12 text-center">
            <h2 class="mb-40 mx-auto">How much can I earn?</h2>
        </div>
        </div>
        <div class="row jc-c mb-40">
            <div class="col col-10 col-lg-12">
                <div class="flex item-calc jc-sb">
                    <div class="coins-calc">
                        <p class="fs-18 mb-15 mb-md-0 c-dark-gray text-md-center">Asset</p>
                        <div class="flex fw-w jc-md-c">
                            {% for token in site.data.products  %}
                                {% if token.visibilityEarn %}
                                    <div class="flex fd-c mb-10">
                                        <button class="coin-calc" data-token="{{token.name}}">
                                            {% include svg/{{token.name}}.svg %}
                                        </button>
                                        <span>{{token.name}}</span>
                                    </div>
                                {% endif %}
                            {% endfor %}
                        </div>
                    </div>
                    <div class="flex fd-c input-calc">
                        <p class="fs-18 mb-15 mb-md-0 c-dark-gray text-md-center">Quantity</p>
                        <input type="number" class="input-quantity" value="5000" />
                        <div class="border-range-quantity">                            
                            <input class="range-quantity" type="range" value="5000" min="1" max="1000000"/>
                            <div class="left-range-quantity"></div>
                            <div class="right-range-quantity"></div>
                            <div class="track-range-quantity"></div>
                        </div>
                    </div>
                    <div class="result-calc">
                        <p class="fs-18 text-md-center">Earn up to:</p>
                        <p class="fs-66 lh-140 fw-400 text-md-center wrapper"><span class="fw-400 earn-usd-item">$<span class="fw-900 earn-usd-value">30.56</span></span></p>
                        <p class="fs-24 lh-140 fw-600 text-right month">/month</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="wrapper-finance">
            <div class="row">
                <div class="col col-12 jc-c">
                    <h5 class="fw-900 mb-35">Compare vs. traditional finance</h5>
                </div>
            </div>
            <div class="row">
                <div class="col col-12">
                    <div class="flex jc-sb fd-md-c mx-auto">
                        <div class="item-earn fulcrum active">
                            <div class="head-earn">
                                {% include svg/fulcrum.svg %}
                            </div>
                            <div class="body-earn">
                                <p class="fs-13">Lending stablecoins <br /> with Fulcrum</p>
                            </div>
                            <div class="footer-earn">
                                <p class="fs-32 fs-md-20 mb-5 mb-md-0">$<span class="fw-800 earn-usd-value">301</span></p>
                                <p class="fs-18 fs-md-20"><span class="fw-800 apr-value">6</span>%</p>
                            </div>
                        </div>
                        <div class="item-earn">
                            <div class="head-earn">
                                {% include svg/td-bank.svg %}
                            </div>
                            <div class="body-earn">
                                <p class="fs-20 fs-md-13">TD Bank</p>
                            </div>
                            <div class="footer-earn">
                                <p class="fs-32 fs-md-20 mb-5 mb-md-0">$<span class="fw-800 earn-usd-value">109</span></p>
                                <p class="fs-18 fs-md-20"><span class="fw-800 apr-value">2.2</span>%</p>
                            </div>
                        </div>
                        <div class="item-earn">
                            <div class="head-earn">
                                {% include svg/sofi.svg %}
                            </div>
                            <div class="body-earn">
                                <p class="fs-20 fs-md-13">SoFi</p>
                            </div>
                            <div class="footer-earn">
                                <p class="fs-32 fs-md-20 mb-5 mb-md-0">$<span class="fw-800 earn-usd-value">103</span></p>
                                <p class="fs-18 fs-md-20"><span class="fw-800 apr-value">2.06</span>%</p>
                            </div>
                        </div>
                        <div class="item-earn">
                            <div class="head-earn">
                                {% include svg/wealthfront.svg %}
                            </div>
                            <div class="body-earn">
                                <p class="fs-20 fs-md-13">Wealthfront</p>
                            </div>
                            <div class="footer-earn">
                                <p class="fs-32 fs-md-20 mb-5 mb-md-0">$<span class="fw-800 earn-usd-value">90</span></p>
                                <p class="fs-18 fs-md-20"><span class="fw-800 apr-value">1.09</span>%</p>
                            </div>
                        </div>
                        <div class="item-earn">
                            <div class="head-earn">
                                {% include svg/betterment.svg %}
                            </div>
                            <div class="body-earn">
                                <p class="fs-20 fs-md-13">Betterment</p>
                            </div>
                            <div class="footer-earn">
                                <p class="fs-32 fs-md-20 mb-5 mb-md-0">$<span class="fw-800 earn-usd-value">2.50</span></p>
                                <p class="fs-18 fs-md-20"><span class="fw-800 apr-value">0.05</span>%</p>
                            </div>
                        </div>
                        <div class="item-earn">
                            <div class="head-earn">
                                {% include svg/industry-average.svg %}
                            </div>
                            <div class="body-earn">
                                <p class="fs-20 fs-md-13">Industry Average</p>
                            </div>
                            <div class="footer-earn">
                                <p class="fs-32 fs-md-20 mb-5 mb-md-0">$<span class="fw-800 earn-usd-value">2.45</span></p>
                                <p class="fs-18 fs-md-20"><span class="fw-800 apr-value">0.04</span>%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>



<section class="bg-primary text-center pt-60 pb-60 pb-md-30 pt-120">
    <div class="container">
        <div class="row">
            <div class="col col-12 fd-c">
                <h2 class="circle mb-15 mb-sm-25 jc-c"><span class="blue center top-r-60"></span>How do I lend crypto with Fulcrum?</h2>
                <p class="fs-20 fs-sm-16 lh-150 c-secondary-blue mb-75 mb-sm-60">Three clicks. No minimum deposit, no lock-up period, withdraw anytime</p>
            </div>
        </div>
        <div class="row jc-c">
            <div class="col col-10 col-lg-12 flex jc-sa fd-md-c">
                <div class="flex fd-c mb-md-55">
                    <div class="svg-blur mb-45">
                        <span class="lend-count">1</span>
                        {% include svg/lend-step-1.svg %}
                    </div>
                    <p class="c-dark-gray mt-25 mw-400 mx-auto">Choose the asset you want to lend</p>
                </div>
                <div class="flex fd-c mb-md-55">
                    <div class="svg-blur mb-45">
                        <span class="lend-count">2</span>
                        {% include svg/lend-step-2.svg %}
                    </div>
                    <p class="c-dark-gray mt-25 mw-400 mx-auto">Enter the quantity and confirm transaction</p>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="bg-primary py-60 pt-xs-0 pb-xs-45 text-center">
    <div class="container">
        <div class="row">
        <div class="col col-12 fd-c">
                        <a href="https://app.fulcrum.trade/lend" class="button button-secondary button-lg mb-15 mx-auto order-sm-1">Lend</a>
            <p class="fs-13 lh-150 text-center c-gray mb-10 mb-sm-25">To Earn interest</p>
        </div>
        </div>
    </div>
</section>
