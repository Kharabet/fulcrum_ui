var api_url = "https://fulcrum-api-dev.herokuapp.com/api";

var getApiEndpoints = {
    'tvl': getTVL,
    'apr': getAPR,
    'rates': getUsdRates
}

async function getData(options) {
    var apiInvokers = options.map(function (item) {
        if (getApiEndpoints[item])
            return { name: item, promise: getApiEndpoints[item].call() };
    });
    var data = await Promise.all(apiInvokers.map(function(item){return item.promise}));
    apiInvokers.forEach(function (item, index) {
        window[item.name] = data[index];
    })
}


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


function renderTVL() {
    if (!window.tvl) return
    var tvl = window.tvl;
    var tvlValueElements = document.querySelectorAll(".tvl-value");
    tvlValueElements.forEach(function (item) {
        var token = item.dataset.token;
        if (tvl[token])
            item.textContent = numberWithCommas(new Number(tvl[token]).toFixed(0));
    });

    if (window.tvlRenderer)
        clearInterval(window.tvlRenderer);

    ///set data polling to update widgets every 60 secs
    if (!window.tvlPolling)
        window.tvlPolling = setInterval(updateTvl, 1000 * 60);
}

async function updateTvl() {
    await (getData)(['tvl']);
    renderTVL();
}


(getData)(['tvl']);

window.addEventListener('load', function () {
    
    window.tvlRenderer = setInterval(renderTVL, 100);

    //switch theme
    var toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    if (currentTheme === null) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleSwitch.checked = false;
    }
    if (currentTheme)
        if (currentTheme === 'dark')
            toggleSwitch.checked = true;

    function switchTheme(e) {

        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);


    //mobile menu
    var openMenu = document.querySelector("#hamburger-menu-open");
    var closeMenu = document.querySelector("#hamburger-menu-close");
    var body = document.querySelector('body');
    openMenu.onclick = function () {
        openMenu.style.display = 'none';
        closeMenu.style.display = 'block';
        body.classList.toggle("open-menu");
    }
    closeMenu.onclick = function () {
        openMenu.style.display = 'block';
        closeMenu.style.display = 'none';
        body.classList.toggle("open-menu");
    }

    var url = document.querySelectorAll('.nav-menu');
    for (var i = 0; i < url.length; i++) {
        if (url[i].getAttribute("href") == window.location.pathname)
            url[i].classList.add("active-url");
    }
});


function formatUsdPrice(value) {
    return new Number(value).toFixed(2);
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getFontSize(el) {
    return window.getComputedStyle(el, null).getPropertyValue('font-size');
}
