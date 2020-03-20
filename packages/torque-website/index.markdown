---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
<section class="bg-primary bg-primary-image">
    {% include header.html %}
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
                    <div class="item-form loan">
                        <span>Loan</span>
                        <div class="input-with-select">
                            <input placeholder="0" type="number" class="input input-loan" />
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
                            <input placeholder="0" type="number" class="input input-collateral" readonly/>
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
                    <div class="item-result apr-component"  data-token="dai">
                        <span>APR <span class="c-gradient fw-900">FIXED</span></span>
                        <div><span class="value-result apr-value">2.54</span>%</div>
                    </div>
                    <span class="cube">{% include svg/big-cube.svg %}</span>
                </form>
                </div>
            </div>
        </div>
    </div>
    <div class="container pt-15 pt-xs-30 pb-45 pb-xs-75">
        <div class="row fd-md-c">
            <div class="col col-5 col-lg-3 col-md-12">
                <h2 class="triangle mb-md-25">
                <span class="t-r-75 l-r-125">{% include svg/big-triangle.svg %}</span>
                Crypto-backed loans with fixed interest rates 
                </h2>
            </div>
            <div class="col col-7 col-lg-9 col-md-12 apr-wrapper">
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="bat">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/bat.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">BAT</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="knc">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/knc.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">KNC</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="rep">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/rep.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">REP</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">5.3</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="zrx">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/zrx.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">ZRX</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">1.6</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="eth">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/eth.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">ETH</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="link">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/link.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">LINK</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="susd">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/susd.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">sUSD</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                    </div>
                </div>
                <div class="flex mr-20 mb-40 mb-xs-30 apr-component" data-token="wbtc">
                    <div class="icon-50 mr-15 mr-xl-5 mr-xs-9">
                        {% include svg/wbtc.svg %}
                    </div>
                    <div class="wrap-apr-value">
                        <p class="lh-100 fw-700 c-gray">WBTC</p>
                        <p class="fs-24 fs-xl-21 lh-125 apr-value-after"><span class="fw-800 apr-value">4.2</span>%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="py-60">
        <div class="container container-lg">
            <div class="row">
                <div class="col jc-sb w-100">
                    <div class="flex fd-c">
                        <a href="#" class="button button-blue button-md">
                            <div class="flex fd-c">
                                <span>New user?</span>
                                <p>Borrow</p>
                            </div>
                            {% include svg/arrow-in-circle.svg %}
                        </a>
                        <span class="info-after-button">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                    </div>    
                    <div class="flex fd-c">
                        <a href="#" class="button button-green button-md">
                            <div class="flex fd-c">
                                <span>Existing user?</span>
                                <p>Select Wallet</p>
                            </div>
                            {% include svg/arrow-in-circle.svg %}
                        </a>
                        <span class="info-after-button">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                    </div>        
                    <div class="flex fd-c">
                        <a href="#" class="button button-purple button-md">
                            <div class="flex fd-c">
                                <span>Already have a loan?</span>
                                <p>Refinance</p>
                            </div>
                            {% include svg/arrow-in-circle.svg %}
                        </a>
                        <span class="fs-13 lh-150 c-gray mt-20 ml-40">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                    </div>          
                </div>
            </div>
        </div>
    </div>
    <div class="pt-90 pb-30">
        <div class="container">
            <div class="row">
                <div class="col col-12">
                    <h2 class="triangle mb-75 mb-xs-50">
                    <span class="l-r-125">{% include svg/small-triangle.svg %}</span>                    
                    Why Torque? </h2>
                </div>
            </div>
        </div>
        <div class="container container-lg">
            <div class="row">
                <div class="col flex fw-w">
                    <div class="item-reason">
                        <div class="icon-reason mb-50 mb-xs-15">
                            {% include svg/icon-safe-1.svg %}
                        </div>
                        <div class="content-reason">
                            <h3 class="mb-10">Fixed APR </h3>
                            <p>Enjoy zero fees on tokenized margin loans and margin positions with Fulcrum.</p>
                        </div>
                    </div>
                    <div class="item-reason">
                        <div class="icon-reason mb-50 mb-xs-15">
                            {% include svg/icon-safe-1.svg %}
                        </div>
                        <div class="content-reason">
                            <h3 class="mb-10">Non custodial</h3>
                            <p>Enjoy zero fees on tokenized margin loans and margin positions with Fulcrum.</p>
                        </div>
                    </div>
                    <div class="item-reason">
                        <div class="icon-reason mb-50 mb-xs-15">
                            {% include svg/icon-safe-1.svg %}
                        </div>
                        <div class="content-reason">
                            <h3 class="mb-10">Three clicks. <br /> No Accounts. No fees</h3>
                            <p>Enjoy zero fees on tokenized margin loans and margin positions with Fulcrum.</p>
                        </div>
                    </div>
                    <div class="item-reason">
                        <div class="icon-reason mb-50 mb-xs-15">
                            {% include svg/icon-safe-1.svg %}
                        </div>
                        <div class="content-reason">
                            <h3 class="mb-10">Partial Liquidations</h3>
                            <p>Enjoy zero fees on tokenized margin loans and margin positions with Fulcrum.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-90 pb-75 py-xs-75 ta-c">
    <div class="container">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="triangle mb-65 mb-xs-50">
                <span class="t-r-55 r-r-75">{% include svg/small-triangle.svg %}</span>
                Security Is Our Priority</h2>
            </div>
        </div>
        <div class="row jc-sb fw-md-w ai-xl-fe">
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-1.svg %}
                </div>
                <h3 class="mb-20">Audited Smart Contracts</h3>
                <p>The bZx base protocol has been <a href="https://github.com/mattdf/audits/blob/master/bZx/bzx-audit.pdf">successfully audited</a> by leading blockchain security auditor ZK Labs.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-5.svg %}
                </div>
                <h3 class="mb-20">Oracles</h3>
                <p>If undercollateralized loans are not properly liquidated, lenders are repaid from a pool funded by 10% of the interest paid by borrowers.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-2.svg %}
                </div>
                <h3 class="mb-20">Insurance Fund</h3>
                <p>If undercollateralized loans are not properly liquidated, lenders are repaid from a pool funded by 10% of the interest paid by borrowers.</p>
            </div>
            <div class="col col-3 col-md-6 col-sm-12 item-safe fd-c">
                <div class="icon-safe mb-50 mb-xs-15">
                    {% include svg/icon-safe-3.svg %}
                </div>
                <h3 class="mb-20">Open source</h3>
                <p>As one of the founding principles of DeFi, we’re committed to interoperability and the development of open source code - <a href="https://github.com/bZxNetwork">see for yourself!</a>
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

<section class="bg-secondary pt-120 pb-45 ta-c">
    <div class="container">
        <div class="row">
            <div class="col col-12 fd-c jc-c">
                <h2 class="mb-25">How to borrow</h2>
                <p class="fs-20 lh-150 fw-600 c-secondary-blue mb-75">Three clicks. No Accounts. No fees.</p>
            </div>
        </div>
        <div class="row">
            <div class="col col-9 mx-a jc-sb">
                <div class="flex fd-c mb-md-55">
                    <div class="svg-blur mb-45">
                        <span class="lend-count">1</span>
                        <div>
                        {% include svg/step-1.svg %}
                        </div>
                    </div>
                    <p class="c-dark-gray mt-25">Sellect an asset with fixed APR</p>
                </div>
                <div class="flex fd-c">
                    <div class="svg-blur mb-45">
                        <span class="lend-count">2</span>
                        <div>
                        {% include svg/step-2.svg %}
                        </div>
                    </div>
                    <p class="c-dark-gray mt-25">Enter amount to borrow and confirm transaction at Metamask</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary pt-45 pb-90">
    <div class="container container-md">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="mb-30">Start now</h2>            
            </div>
        </div>
        <div class="row">
            <div class="col jc-sb w-100">
                <div class="flex fd-c">
                    <a href="#" class="button button-blue button-lg">
                        <div class="flex fd-c">
                            <span>New user?</span>
                            <p>Borrow</p>
                        </div>
                        {% include svg/arrow-in-circle.svg %}
                    </a>
                    <span class="info-after-button">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>          
                <div class="flex fd-c">
                    <a href="#" class="button button-purple button-lg">
                        <div class="flex fd-c">
                            <span>Already have a loan?</span>
                            <p>Refinance</p>
                        </div>
                        {% include svg/arrow-in-circle.svg %}
                    </a>
                    <span class="fs-13 lh-150 c-gray mt-20 ml-40">Up to 5x Leverage, zero platform fees, <br /> and perfect liquidity</span>
                </div>          
            </div>
        </div>
    </div>
</section>

<section class="bg-secondary py-105 pt-xs-90 ta-c">
    <div class="container container-sm">
        <div class="row">
            <div class="col col-12 jc-c">
                <h2 class="cube mb-50 mb-xs-40">
                <span class="t-r-75 center">{% include svg/small-cube.svg %}</span>
                Frequently Asked Questions
                </h2>
            </div>
        </div>
        <div class="row jc-c">
            <div class="col col-12">
                <div id="accordion">
                    <div class="accordion-item active">
                        <h4 class="accordion-toggle">
                            What does going long or short mean in trading?
                            <span class="accordion-position"></span>
                        </h4>
                        <div class="accordion-content" aria-hidden="false">
                            <p>Margin trading has two main aspects: leverage and shorting. When trading with leverage, a trader borrows assets to increase the amount of assets they are trading. By doing so, they magnify the gains or losses of their trade. The borrowed assets are known as a margin loan. To obtain the margin loan, the trader puts up assets that serve as collateral. The terms of the margin loan specify a collateral-to-loan ratio. If the trade falls below the specified ratio, the trade is liquidated and the lender gets repaid using the trader's collateral. Margin trading also includes shorting. When shorting, a trader essentially sells assets they do not own. The short investor borrows an asset and sells it with the expectation that the asset will lose value. </p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h4 class="accordion-toggle">
                            How are positions liquidated? Is there liquidity risk?
                            <span class="accordion-position"></span>
                        </h4>
                        <div class="accordion-content" aria-hidden="true">
                            <p>Positions are liquidated using KyberSwap. When a trader goes under margin maintenance (15%), they are only partially liquidated, bringing their current margin to 25%. Only liquidating as much as necessary reduces the risk of slippage from large liquidations. Anyone can initiate a margin call: the process is permissionless and incentivized. The incentive to liquidators is a refund of your gas * 2. There’s also no capital costs or risks like those experienced when liquidating positions on other protocols. This ensures redundancy in the margin calling process. Moreover, there is an insurance fund which protects lenders. In the case that a lender would lose their principal, the insurance fund will automatically disburse funds to the lender. This insurance is funded by a smart contract holding 10% of all interest that is paid by borrowers to lenders.</p>
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
                    Help center
                    <div class="icon-arrow">
                        {% include svg/arrow.svg %}
                    </div>
                </a>
            </div>
        </div>
    </div>
</section>
<script>
    let products = {{ site.data.products | jsonify }}; 
    const onStyledSelectClick = (event) => {
        event.stopPropagation();    
        const current = event.currentTarget;  
        const select = current.closest(".select");  
        const listSelect = select.querySelector("ul.select-options");
        const options = select.querySelectorAll(".li-options");
        const asset = current.dataset.asset;
        for (let i = 0; i < options.length; i++) {
            if(options[i].dataset.asset && options[i].dataset.asset === asset)
                options[i].classList.add('hidden');
        }
        if (current.classList.contains("active")) {
          current.classList.remove("active");
          listSelect.style.display = 'none';
        } else {
          current.classList.add("active");
          listSelect.style.display = 'block';
        }
        document.body.classList.add('open-modal');
    }    
    const onLiClick = (event) => {
        event.stopPropagation();
        const current = event.currentTarget;
        const select = event.currentTarget.closest(".select");
        const listSelect = select.querySelector("ul.select-options");
        const options = select.querySelectorAll(".li-options");
        const selectStyled = select.querySelector(".select-styled");
        const asset = event.currentTarget.dataset.asset;
        selectStyled.textContent = current.textContent;
        selectStyled.style.backgroundImage = `url(/images/${asset.toLowerCase()}.svg)`;
        selectStyled.classList.remove('active');
        listSelect.style.display = 'none';        
        for (let i = 0; i < options.length; i++) {
            options[i].classList.remove('hidden');
        }
        selectStyled.dataset.asset = asset;
        document.body.classList.remove('open-modal');
    }
    let select = document.querySelectorAll('.select-styled');
    let options = document.querySelectorAll('.li-options');
    var modal = document.querySelector('.modal');
    select.forEach(selected => selected.addEventListener("click", onStyledSelectClick));
    options.forEach(option => option.addEventListener("click", onLiClick));
    window.onclick = function(event) {
        const listSelect = document.querySelectorAll("ul.select-options");
        const selectStyled = document.querySelectorAll(".select-styled");
        for (let i = 0; i < listSelect.length; i++) {
            if (event.target !== listSelect)
                listSelect[i].style.display = "none";
        }
        selectStyled.forEach(item => item.classList.remove('active'));
        if (event.target !== listSelect) {
            document.body.classList.remove('open-modal');
        }
    }
</script>