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
<section class="pt-45 pb-90">
    <div class="container">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="mb-30">Start now</h2>            
            </div>
        </div>
        <div class="row">
            <div class="col col-8 jc-sb mx-a">
                <div class="flex fd-c">
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