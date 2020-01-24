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

var api_url = "http://192.168.201.11:8080/api";


(async function getData() {
    var data = await Promise.all([getAPR(), getUsdRates(), getTVL()]);
    window.apr = data[0];
    window.usdRates = data[1];
    window.tvl = data[2];
})();


async function getAPR() {
    var response = await fetch(api_url + '/apr');
    var apr = await response.json();
    var result = {};
    Object.entries(apr).forEach(function (item) {
        result[item[0]] = new Number(item[1]).toFixed(2);
    });
    return result;
};

async function getUsdRates() {
    var response = await fetch(api_url + '/usd-rates');
    var rates = await response.json();
    var result = {};
    Object.entries(rates).forEach(function (item) {
        result[item[0]] = new Number(item[1]).toFixed(2);
    });
    return result;
};

async function getTVL() {
    var response = await fetch(api_url + '/tvl-usd');
    var tvl = await response.json();
    var result = {};
    Object.entries(tvl).forEach(function (item) {
        result[item[0]] = new Number(item[1]).toFixed(2);
    });
    return result;
};

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
}

function renderTVL() {
    if (!window.tvl) return
    var tvl = window.tvl;
    var tvlValueElements = document.querySelectorAll(".tvl-value");
    tvlValueElements.forEach(function (item) {
        var token = item.dataset.token;
        if (tvl[token])
            item.textContent = numberWithCommas(new Number(tvl[token]).toFixed(0));
    });

    clearInterval(window.tvlRenderer);
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


        if (window.tvl) {
            if (liveTVL === 0) liveTVL = new Number(window.tvl["all"]);
            var daiSecAPR = window.apr["dai"] / 365 / 24 / 60 / 60 / 100;
            liveEarnings += liveTVL * daiSecAPR;
            liveTVL += liveEarnings;
            console.log("liveEarnings: " + liveEarnings);
            document.querySelector(".live-earnings-value").textContent = numberWithCommas(liveEarnings.toFixed(0));

        }
    }
    setInterval(visibleTimer, 1000);
}

function changePositionBorderThumb(range, current) {
    leftRangeQuantity.style.left = 'calc(' + current.value / (range.max) * 100 + '% - 12px - (16px *' + (current.value - (range.max) / 2) / range.max + '))'; //12 - half of width thumb with border, 16 - width thumb without border
    rightRangeQuantity.style.left = 'calc(' + current.value / (range.max) * 100 + '% - 12px + 20px - (16px *' + (current.value - (range.max) / 2) / range.max + '))'; //12 - half of width thumb with border, 16 - width thumb without border 
    trackRangeQuantity.style.width = 'calc(' + current.value / (range.max) * 100 + '% - 12px - (16px *' + (current.value - (range.max) / 2) / range.max + '))';;
}

window.addEventListener('load', function () {

    window.aprRenderer = setInterval(renderAPR, 100);
    window.tvlRenderer = setInterval(renderTVL, 100);

    //change active button-coin
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
        if (e.currentTarget.value > rangeMax)
            e.currentTarget.value = rangeMax;

        quantityRange.value = e.currentTarget.value;
        updateEarningsCalc(e.currentTarget.value);

        changePositionBorderThumb(quantityRange, e.currentTarget);
    }

    timer();
});


function updateEarningsCalc(quantity) {

    var apr = window.apr;
    var token = document.querySelector(".coin-calc.active").dataset.token;
    if (!apr || !apr[token])
        return null;
    var monthAPR = apr[token] / 12 / 100;
    var usdAmount = quantity * window.usdRates[token];

    var earnings = formatUsdPrice(usdAmount * monthAPR);

    document.querySelector(".item-earn.fulcrum .earn-usd-value").textContent = earnings;
    document.querySelector(".result-calc .earn-usd-value").textContent = earnings;
    updateTraditionalFinance(usdAmount);
    // return earnings;
};

function updateTraditionalFinance(usdAmount) {
    var traditionalFinanceElements = document.querySelectorAll(".item-earn:not(.fulcrum)");
    traditionalFinanceElements.forEach(function (elem) {
        var apr = new Number(elem.querySelector(".apr-value").textContent.replace(",", "."));
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

function formatUsdPrice(value) {
    return new Number(value).toFixed(2).replace(".", ",");
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}