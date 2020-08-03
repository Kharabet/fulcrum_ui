var itemSecond = document.querySelector(".seconds");
var itemMinute = document.querySelector(".minutes");
var itemHour = document.querySelector(".hours");
var quantityInput = document.querySelector('.input-quantity');
var quantityRange = document.querySelector('.range-quantity');
var leftRangeQuantity = document.querySelector('.left-range-quantity');
var rightRangeQuantity = document.querySelector('.right-range-quantity');
var trackRangeQuantity = document.querySelector('.track-range-quantity');

var coins = document.querySelectorAll('#calculator-earn .coin-calc');
var wrapperFinance = document.querySelector('.wrapper-finance');

var calcWidgetResult = document.querySelector(".result-calc .earn-usd-value");
var calcWidgetItem = document.querySelector(".result-calc .earn-usd-item");
var liveEarningsElem = document.querySelector(".live-earnings-value");

(getData)(['apr', 'rates']);

function renderAPR() {
    if (!window.apr) return
    var apr = window.apr;
    var aprComponentElements = document.querySelectorAll(".apr-component");
    aprComponentElements.forEach(function (item) {
        var token = item.dataset.token;
        if (apr[token])
            item.querySelector(".apr-value").textContent = formatUsdPrice(apr[token]);
    });


    var activeCalcWidgetToken = document.querySelector(".coin-calc.active").dataset.token;
    document.querySelector(".item-earn.fulcrum .apr-value").textContent = formatUsdPrice(apr[activeCalcWidgetToken]);

    updateEarningsCalc(quantityInput.value);

    clearInterval(window.aprRenderer);

    if (window.aprRenderer)
        clearInterval(window.aprRenderer);

    ///set data polling to update widgets every 60 secs
    if (!window.aprPolling)
        window.aprPolling = setInterval(updateData, 1000 * 60);

}

async function updateData() {
    await (getData)(['apr', 'rates']);
    renderAPR();
}


function timer() {
    var wrapHours = document.querySelector('.wrap-hours');
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    var liveEarnings = 0;
    var liveTVL = 0;
    function visibleTimer() {
        if (seconds === 59) {
            minutes += 1;
            seconds = -1;
        }
        if (minutes === 60) {
            hours += 1;
            minutes = 0;
            wrapHours.style.display = 'inline-block';
        }
        if (hours === 24) {
            seconds = -1;
            minutes = 0;
            hours = 0;
        }
        itemSecond.innerHTML = seconds < 9 ? '0' + ++seconds : ++seconds;
        itemMinute.innerHTML = hours > 0 ? minutes < 9 ? '0' + minutes : minutes : minutes;
        itemHour.innerHTML = hours;



    }

    function liveEarningsCounter() {
        if (window.tvl) {
            if (liveTVL === 0) liveTVL = new Number(window.tvl["all"]);
            var daiSecAPR = window.apr["dai"] / 365 / 24 / 60 / 60 / 100 / 100; //APR per 10ms
            liveEarnings += liveTVL * daiSecAPR;
            liveTVL += liveEarnings;
            liveEarningsElem.textContent = numberWithCommas(formatUsdPrice(liveEarnings));
        }
    }

    setInterval(liveEarningsCounter, 10);
    setInterval(visibleTimer, 1000);
}

function changePositionBorderThumb(range, current) {
    leftRangeQuantity.style.left = 'calc(' + current.value / (range.max) * 100 + '% - 12px - (16px *' + (current.value - (range.max) / 2) / range.max + '))'; //12 - half of width thumb with border, 16 - width thumb without border
    rightRangeQuantity.style.left = 'calc(' + current.value / (range.max) * 100 + '% - 12px + 20px - (16px *' + (current.value - (range.max) / 2) / range.max + '))'; //12 - half of width thumb with border, 16 - width thumb without border 
    trackRangeQuantity.style.width = 'calc(' + current.value / (range.max) * 100 + '% - 12px - (16px *' + (current.value - (range.max) / 2) / range.max + '))';;
}

window.addEventListener('load', function () {

    window.aprRenderer = setInterval(renderAPR, 100);

    //change active button-coin
    coins[0].classList.add('active');
    for (var i = 0; i < coins.length; i++) {
        coins[i].addEventListener('click', onWidgetAssetsClick, false);
    }
    changePositionBorderThumb(quantityRange, quantityRange);

    quantityRange.oninput = function (e) {
        quantityInput.value = e.currentTarget.value;
        changePositionBorderThumb(quantityRange, e.currentTarget);
        updateEarningsCalc(e.currentTarget.value);
    }

    quantityInput.oninput = function (e) {
        if (!e.currentTarget.value)
            quantityRange.value = 0;

        var rangeMax = new Number(quantityRange.getAttribute("max"));
        quantityRange.value = e.currentTarget.value;

        if (e.currentTarget.value > rangeMax){
            e.currentTarget.value = rangeMax;
            quantityRange.value = e.currentTarget.value;
        }
        if (e.currentTarget.value <= 0){
            e.currentTarget.value = '';
            quantityRange.value = 1;
        }
        updateEarningsCalc(e.currentTarget.value);
        changePositionBorderThumb(quantityRange, e.currentTarget);
    }
});


function updateEarningsCalc(quantity) {

    var apr = window.apr;
    var token = document.querySelector(".coin-calc.active").dataset.token;
    if (!apr || !apr[token])
        return null;
    var monthAPR = apr[token] / 12 / 100;
    var usdAmount = quantity * window.rates[token];

    var earnings = numberWithCommas(formatUsdPrice(usdAmount * monthAPR));

    document.querySelector(".item-earn.fulcrum .earn-usd-value").textContent = earnings;

    calcWidgetResult.textContent = earnings;
    updateCalcResultFontSize(calcWidgetItem);


    updateTraditionalFinance(usdAmount);
};

function updateTraditionalFinance(usdAmount) {
    var traditionalFinanceElements = document.querySelectorAll(".item-earn:not(.fulcrum)");
    traditionalFinanceElements.forEach(function (elem) {
        var apr = new Number(elem.querySelector(".apr-value").textContent);
        var monthAPR = apr / 12 / 100;
        var earnings = formatUsdPrice(usdAmount * monthAPR);
        elem.querySelector(".earn-usd-value").textContent = earnings;
    });
}

function onWidgetAssetsClick(e) {
    var items = document.querySelectorAll('.coin-calc');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    var token = e.currentTarget.getAttribute('data-token');
    wrapperFinance.style.display = 'none';

    if (['dai', 'susd', 'usdc'].includes(token)) {
        wrapperFinance.style.display = 'block';
        if (window.apr && window.apr[token])
            document.querySelector(".item-earn.fulcrum .apr-value").textContent = window.apr[token];
    }
    e.currentTarget.classList.add("active");

    updateEarningsCalc(quantityInput.value);

};


function updateCalcResultFontSize(element) {
    var wrapper = element.closest(".wrapper");
    var wrapperWidth = wrapper.offsetWidth;
    var desiredWidth = wrapperWidth - 40;
    var size;

    if (element.offsetWidth > wrapperWidth) {

        while (element.offsetWidth > desiredWidth) {
            size = parseInt(getFontSize(element), 10);
            element.style.fontSize = (size - 1) + 'px';
        }
        return;
    }
    if (element.offsetWidth < desiredWidth) {
        while (element.offsetWidth < desiredWidth) {
            size = parseInt(getFontSize(element), 10);
            if (size + 1 > 66) break;
            element.style.fontSize = (size + 1) + 'px';
        }
        return;
    }

};
