---
featured-image: /images/ogp.png
metadescription: "Torque is the first crypto loan platform with indefinite-term loans and fixed interest rates. Get an instant crypto-backed loan with no credit checks"
title: Torque Crypto Loans | Borrowing Made Simple | bZx
layout: home
---
<section class="bg-primary bg-primary-image">
    {% include header.html %}
    <div class="container pt-90 pb-90">
        <div class="row fd-c">
            <div class="col col-8 col-xl-10 col-md-12">
                <h1 class="mb-40">Borrowing Made Simple</h1>
            </div>
            <div class="col col-7 col-xl-9 col-md-12">
                <p class="fs-16 fs-xs-12 lh-160 mb-50 c-secondary"><span class="fw-700">Torque</span> is a powerful DeFi platform for borrowing assets with indefinite-term loans and fixed interest rates. Get an instant, crypto-backed loan with no KYC or credit checks</p>
            </div>
        </div>
        <div class="row">
            <div class="col col-10 col-xl-11 col-lg-12">
                <form class="form-loan">
                    <div class="item-form loan mb-sm-15">
                        <span>Loan</span>
                        <div class="input-with-select">
                            <input placeholder="0" type="number" step="any" class="input input-loan" />
                            <div class="select">
                                <div class="select-styled" data-asset="dai">
                                    DAI
                                </div>
                                <ul class="select-options">
                                    {% for product in site.data.products %}
                                        <li class="li-options" data-asset="{{ product.name }}">
                                            {% include svg/{{ product.name }}.svg %}
                                            {{ product.name }}
                                        </li>
                                    {% endfor %}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="item-connect">
                        {% include svg/connect.svg %}
                    </div>
                    <div class="item-form collateral">
                        <span>Collateral</span>
                        <div class="input-with-select">
                            <input placeholder="0" step="any" class="input input-collateral" readonly/>
                            <div class="select">
                                <div class="select-styled" data-asset="eth" >
                                    ETH
                                </div>
                                <ul class="select-options">
                                    {% for product in site.data.products %}
                                        <li class="li-options" data-asset="{{ product.name }}">
                                            {% include svg/{{ product.name }}.svg %}
                                            {{ product.name }}
                                        </li>
                                    {% endfor %}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="item-result apr-component"  data-asset="dai">
                        <span>APR <span class="c-gradient fw-900">FIXED</span></span>
                        <div class="wrap-loader">
                            <div class="loader">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span class="value-result apr-value">2.54</span>%
                        </div>
                    </div>
                    <span class="cube">{% include svg/big-cube.svg %}</span>
                </form>
            </div>
        </div>
    </div>
    <div class="container pb-45 pb-xs-0">
        <div class="row fw-w">
            <div class="col">
                <div class="apr-title">
                    <h2 class="big-triangle triangle mb-md-30">
                    <span class="t-r-75 l-r-125 l-r-xs-5">{% include svg/big-triangle.svg %}</span>
                    Crypto-backed loans with fixed interest rates
                    </h2>
                </div>
            </div>
            <div class="col fg-1">
                <div class="apr-wrapper">
                    {% for product in site.data.products %}
                        <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-asset="{{ product.name }}">
                            <div class="icon-50 mr-15 mr-xl-10 mr-xs-9">
                                {% include svg/{{ product.name }}.svg %}
                            </div>
                            <div class="wrap-apr-value">
                                <p class="lh-100 fw-700 c-gray">{{ product.name }}</p>
                                <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                            </div>
                        </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
    <div class="pt-60 pb-60 pt-lg-0">
        <div class="container">
            <div class="row fw-w fd-r fd-md-c">
                <div class="col">
                    <div class="flex fd-c mx-md-a mb-md-15">
                        <a href="#" class="button button-blue button-xl">
                            <div class="flex fd-c">
                                <span>New user?</span>
                                <p>Borrow</p>
                            </div>
                            {% include svg/arrow-in-circle.svg %}
                        </a>
                        <span class="info-after-button">Borrow crypto-assets and stablecoins with fixed interest</span>
                    </div>
                </div>
                <div class="col fg-1 fg-lg-initial jc-sb jc-lg-fs fd-md-c">
                    <div class="flex fd-c  mr-lg-30 mx-md-a mb-md-15">
                        <a href="#" class="button button-purple button-md">
                            <div class="flex fd-c">
                                <span>Already have a loan?</span>
                                <p>Refinance</p>
                            </div>
                            {% include svg/arrow-in-circle.svg %}
                        </a>
                        <span class="info-after-button">Stabilize your loan(s) by refinancing from variable to fixed rates</span>
                    </div>
                    <div class="flex fd-c mb-md-15 mx-md-a">
                        <a href="#" class="button button-green button-md">
                            <div class="flex fd-c">
                                <span>Existing user?</span>
                                <p>Select Wallet</p>
                            </div>
                            {% include svg/arrow-in-circle.svg %}
                        </a>
                        <span class="info-after-button">Add or subtract collateral and repay at any time</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pt-30 pb-45 pt-xs-0">
        <div class="container">
            <div class="row">
                <div class="col col-12">
                    <h2 class="small-triangle triangle mb-75 mb-xs-45">
                    <span class="l-r-125">{% include svg/small-triangle.svg %}</span>
                    Why Torque? </h2>
                </div>
            </div>
        </div>
        <div class="container container-lg">
            <div class="row">
                <div class="col flex fw-w">
                    <div class="item-reason">
                        <div class="icon-reason">
                            {% include svg/icon-torque-1.svg %}
                        </div>
                        <div class="content-reason">
                            <h3 class="mb-10">Fixed Interest</h3>
                            <p>With fixed interest you always know what you’re paying.</p>
                        </div>
                    </div>
                    <div class="item-reason">
                        <div class="icon-reason">
                            {% include svg/icon-torque-2.svg %}
                        </div>
                        <div class="content-reason">
                          <h3 class="mb-10">Partial Liquidations</h3>
                            <p>When volatility strikes, we keep your loans collateralized with minimal liquidation, only to bring collateral 10% above margin maintenance.</p>
                        </div>
                    </div>
                    <div class="item-reason">
                        <div class="icon-reason">
                            {% include svg/icon-torque-3.svg %}
                        </div>
                        <div class="content-reason">
                            <h3 class="mb-10">No KYC, Credit Checks</h3>
                            <p>We take decentralization seriously. Get a loan with no verification, KYC/AML or credit checks.</p>
                        </div>
                    </div>
                    <div class="item-reason">
                        <div class="icon-reason">
                            {% include svg/icon-torque-4.svg %}
                        </div>
                        <div class="content-reason">
                          <h3 class="mb-10">Non custodial</h3>
                            <p>Your keys, your coins, your loans. Always. Control your keys and assets with our non-custodial solution.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-90 pb-90 py-xs-45 ta-c">
    <div class="container">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="small-triangle triangle mb-65 mb-xs-45">
                <span class="t-r-55 t-r-xs-75 r-r-75 center-xs">{% include svg/small-triangle.svg %}</span>
                Security Is Our Priority</h2>
            </div>
        </div>
        <div class="row jc-sb fw-md-w ai-xl-fe">
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-1.svg %}
                </div>
                <h3 class="mb-20">Audited Smart Contracts</h3>
                <p>Our smart contracts have been audited by leading blockchain security auditors ZK Labs and Certik.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-5.svg %}
                </div>
                <h3 class="mb-20">Oracles</h3>
                <p>We work with industry-leading oracle providers to tackle the unique security challenges associated with oracles in a decentralized environment.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-2.svg %}
                </div>
                <h3 class="mb-20">Insurance Fund</h3>
                <p>10% of the interest paid by borrowers goes to an insurance fund used in the event that undercollateralized loans are not properly liquidated.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-3.svg %}
                </div>
                <h3 class="mb-20">Open source</h3>
                <p>Interoperability and Open Source are among the founding principles of DeFi, which bZx is proudly committed to - <a href="https://github.com/bZxNetwork">see for yourself!</a>
              </p>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary section-stats">
    <div class="container">
        <div class="row">
            <div class="col col-12">
                <div class="wrapper-stats">
                    <h2>Our stats</h2>
                    <div class="item-stats">
                        <div>$<span class="fw-900">5,056,560</span></div>
                        <span>Loans Originated</span>
                    </div>
                    <div class="item-stats">
                        <div>$<span class="fw-900">659,056,560</span></div>
                        <span>Loans Refinanced</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-120 pb-75 ta-c pt-xs-90">
    <div class="container">
        <div class="row">
            <div class="col col-12 fd-c jc-c">
                <h2 class="mb-25">How to Borrow</h2>
                <p class="fs-20 fs-xs-16 lh-150 fw-600 c-secondary-blue mb-75">Three clicks. No credit checks. Flexible collateral.</p>
            </div>
        </div>
        <div class="row">
            <div class="col col-12 mx-a jc-sa fd-md-c">
                <div class="flex fd-c wrapper-svg-blur mb-md-60">
                    <div class="svg-blur mb-45">
                        <span class="lend-count">1</span>
                        {% include svg/step-1.svg %}
                    </div>
                    <p class="c-dark-gray mt-25">Select an asset with fixed APR</p>
                </div>
                <div class="flex fd-c wrapper-svg-blur">
                    <div class="svg-blur mb-45">
                        <span class="lend-count">2</span>
                        {% include svg/step-2.svg %}
                    </div>
                    <p class="c-dark-gray mt-25">Enter amount to borrow and confirm transaction at Metamask</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-75 pb-105 pt-xs-30">
    <div class="container container-md">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="mb-30">Start Now</h2>
            </div>
        </div>
        <div class="row">
            <div class="col jc-sb w-100 fd-xs-c jc-xs-c al-xs-c">
                <div class="flex fd-c mb-xs-15">
                    <a href="#" class="button button-blue button-lg">
                        <div class="flex fd-c">
                            <span>New user?</span>
                            <p>Borrow</p>
                        </div>
                        {% include svg/arrow-in-circle.svg %}
                    </a>
                    <span class="info-after-button">Borrow crypto-assets and stablecoins with fixed interest</span>
                </div>
                <div class="flex fd-c">
                    <a href="#" class="button button-purple button-lg">
                        <div class="flex fd-c">
                            <span>Already have a loan?</span>
                            <p>Refinance</p>
                        </div>
                        {% include svg/arrow-in-circle.svg %}
                    </a>
                    <span class="info-after-button">Stabilize your loan(s) by refinancing from variable to fixed rates</span>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-105 pb-30 pt-xs-0 pb-xs-60 ta-c">
    <div class="container container-sm">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="cube mb-50 mb-xs-45">
                <span class="t-r-75 t-r-xs-50 center">{% include svg/small-cube.svg %}</span>
                Frequently Asked Questions
                </h2>
            </div>
        </div>
        <div class="row jc-c">
            <div class="col col-12">
                <div id="accordion">
                    <div class="accordion-item active">
                        <h4 class="accordion-toggle">
                          What are the fees involved when opening a loan on Torque?
                            <span class="accordion-position"></span>
                        </h4>
                        <div class="accordion-content" aria-hidden="false">
                            <p>There are no fees involved with opening the loan. You just pay the interest.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h4 class="accordion-toggle">
                          Can a loan be liquidated on Torque? How undercollaterized loans are liquidated?
                            <span class="accordion-position"></span>
                        </h4>
                        <div class="accordion-content" aria-hidden="true">
                            <p>Loan are liquidated if your position goes below margin maintenance. But only partially, enough to bring your margin up 10% above margin maintenance.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h4 class="accordion-toggle">
                            Are the smart contracts safe? Can I see the audits?
                            <span class="accordion-position"></span>
                        </h4>
                        <div class="accordion-content" aria-hidden="true">
                            <p>Yes. The base protocol audit is <a href="https://github.com/mattdf/audits/blob/master/bZx/bzx-audit.pdf">publicly available</a>. All custody is retained by the base protocol. Both the base protocol audit and iToken/pToken audit were conducted by <a href="https://github.com/mattdf/audits/blob/master/bZx/bzx-audit.pdf">ZK Labs</a>, a recognized leader in the space. Matthew DiFerrante, founder and lead auditor at ZK Labs, is a security engineer at the Ethereum Foundation and audits the Ethereum core protocol itself.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-60">
            <div class="col col-12 jc-c">
                <a href="https://help.bzx.network/en/" class="button button-sm button-white mx-auto">
                    Help Center
                    <div class="icon-arrow">
                        {% include svg/arrow.svg %}
                    </div>
                </a>
            </div>
        </div>
    </div>
</section>
