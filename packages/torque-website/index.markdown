---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<div class="container pt-90 pb-60">
    <div class="row">
        <div class="col col-8 col-xs-12">
            <div class="pl-55 pl-lg-0 w-100 text-xs-center">
                <h1 class="mb-40">Borrowing Made Simple</h1>
                <p class="fs-16 fs-xs-12 lh-160 mb-50 c-secondary"><span class="fw-700">Torque</span> is the first crypto loan platform with indefinite-term loans and fixed interest rates. Get an instant crypto-backed loan with no credit checks.</p>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col col-12">
            <div class="mw-100 px-55">
            <form class="form-loan">
                <div class="item-form">
                    <span>Loan</span>
                    <div >
                        <input />
                        <div class="select-loan">
                            <div class="selected-loan">
                                {% include svg/dai.svg %}
                                DAI
                            </div>
                            <ul class="ul-select-loan">
                                <li>
                                    {% include svg/bat.svg %}
                                    BAT
                                </li>
                                <li>
                                    {% include svg/dai.svg %}                            
                                    DAI
                                </li>
                                <li>
                                    {% include svg/sai.svg %}                           
                                    SAI
                                </li>
                                <li>
                                    {% include svg/link.svg %}                        
                                    LINK
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="item-connect"> 
                    {% include svg/connect.svg %}
                </div>
                <div class="item-form">
                    <span>Collateral</span>
                    <div>
                        <input />
                        <div class="select-loan">
                            <div class="selected-loan">
                                {% include svg/eth.svg %}
                                ETH
                            </div>
                            <ul class="ul-select-loan">
                                <li>
                                    {% include svg/bat.svg %}
                                    BAT
                                </li>
                                <li>
                                    {% include svg/dai.svg %}                            
                                    DAI
                                </li>
                                <li>
                                    {% include svg/sai.svg %}                           
                                    SAI
                                </li>
                                <li>
                                    {% include svg/link.svg %}                        
                                    LINK
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="item-result">
                    <span>APR <span class="c-gradient fw-900">FIXED</span></span>
                    <div class="value-result">2.54%</div>
                </div>
            </form>
            </div>
        </div>
    </div>
</div>

<div class="container pt-15 pt-xs-30 pb-45 pb-xs-75">
    <div class="row fd-md-c">
        <div class="col col-5 col-lg-3 col-md-12">
            <div class="pl-55 pl-lg-0">
                <h2 class="mb-md-25">Crypto-backed loans with fixed interest rates </h2>
            </div>
        </div>
        <div class="col col-7 col-lg-9 col-md-12 apr-wrapper">
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="bat">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/bat.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">BAT</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="knc">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/knc.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">KNC</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="rep">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/rep.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">REP</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="zrx">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/zrx.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">ZRX</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">1.6</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="eth">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/eth.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">ETH</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="link">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/link.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">LINK</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="susd">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/susd.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">sUSD</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                </div>
            </div>
            <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="wbtc">
                <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                    {% include svg/wbtc.svg %}
                </div>
                <div class="wrap-apr-value">
                    <p class="lh-100 fw-700 c-gray">WBTC</p>
                    <p class="fs-24 fs-xl-21 c-primary lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="py-60">
    <div class="container">
        <div class="row">
            <div class="col jc-sb mx-a">
                <div class="flex fd-c mr-35">
                    <a href="#" class="button button-blue button-md">
                        <div class="flex fd-c">
                            <span>New user?</span>
                            <p>Borrow</p>
                        </div>
                        {% include svg/button-arrow.svg %}
                    </a>
                    <span class="info-after-button">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>    
                <div class="flex fd-c mr-35">
                    <a href="#" class="button button-green button-md">
                        <div class="flex fd-c">
                            <span>Existing user?</span>
                            <p>Select Wallet</p>
                        </div>
                        {% include svg/button-arrow.svg %}
                    </a>
                    <span class="info-after-button">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>        
                <div class="flex fd-c">
                    <a href="#" class="button button-purple button-md">
                        <div class="flex fd-c">
                            <span>Already have a loan?</span>
                            <p>Refinance</p>
                        </div>
                        {% include svg/button-arrow.svg %}
                    </a>
                    <span class="fs-13 lh-150 c-gray mt-20 ml-40">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>          
            </div>
        </div>
    </div>
<div>
<section class="pt-45 pb-90">
    <div class="container">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="mb-30">Start now</h2>            
            </div>
        </div>
        <div class="row">
            <div class="col jc-sb mx-a">
                <div class="flex fd-c mr-115">
                    <a href="#" class="button button-blue button-lg">
                        <div class="flex fd-c">
                            <span>New user?</span>
                            <p>Borrow</p>
                        </div>
                        {% include svg/button-arrow.svg %}
                    </a>
                    <span class="info-after-button">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>          
                <div class="flex fd-c">
                    <a href="#" class="button button-purple button-lg">
                        <div class="flex fd-c">
                            <span>Already have a loan?</span>
                            <p>Refinance</p>
                        </div>
                        {% include svg/button-arrow.svg %}
                    </a>
                    <span class="fs-13 lh-150 c-gray mt-20 ml-40">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>          
            </div>
        </div>
    </div>
<section>