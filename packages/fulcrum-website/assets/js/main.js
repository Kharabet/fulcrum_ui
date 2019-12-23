var chartData = {
    datasets: [{
        backgroundColor: 'transparent',
        borderColor: 'rgb(39, 107, 251)',
        borderWidth: 4,
        radius: 0,
        data: [{ x: 1, y: 7 }, { x: 2, y: 5 }, { x: 3, y: 9 }, { x: 4, y: 7 }]
    },
    {
        backgroundColor: 'transparent',
        borderColor: 'rgb(51, 223, 204)',
        borderWidth: 4,
        radius: 0,
        data: [{ x: 4, y: 7 }, { x: 5, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 1 }],
        borderDash: [15, 3]
    },
    {
        backgroundColor: 'transparent',
        borderColor: 'rgb(86, 169, 255)',
        borderWidth: 2,
        radius: 0,
        data: [{ x: 4, y: 7 }, { x: 5, y: 3 }, { x: 6, y: 9 }, { x: 7, y: 14 }],
        borderDash: [8, 4]
    }
    ]
}

const baseData = [
    { x: 1, y: 30 },
    { x: 2, y: 45 },
    { x: 3, y: 34 },
    { x: 4, y: 44 },
    { x: 5, y: 54 },
    { x: 6, y: 34 },
    { x: 7, y: 34 },
    { x: 8, y: 32 },
    { x: 9, y: 38 },
    { x: 10, y: 46 },
    { x: 11, y: 48 },
    { x: 12, y: 38 },
    { x: 13, y: 44 }
]
function timer() {
    let itemSecond = document.querySelector(".seconds");
    let itemMinute = document.querySelector(".minutes");
    let itemHour = document.querySelector(".hours");
    let wrapHours = document.querySelector('.wrap-hours');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
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
    setInterval(visibleTimer, 1000);
}

const getChartData = () => {
    //the only way to create an immutable copy of array with objects inside.
    var baseDashed = JSON.parse(JSON.stringify(baseData.slice(parseInt(baseData.length / 2))));
    var baseSolid = JSON.parse(JSON.stringify(baseData.slice(0, parseInt(baseData.length / 2 + 1))));


    var leverage = parseInt(document.querySelector(".button-group-gains .button-gains.active").dataset.leverage);
    var priceChange = parseInt(document.querySelector(".gain-range").value);
    baseDashed.forEach((item, index) => {
        if (index !== 0)
            item.y += item.y * priceChange / 100;
    })
    var leverageData = baseDashed.map((item, index) => {
        if (index === 0) { return { x: item.x, y: item.y } }
        return { x: item.x, y: item.y * (1 + priceChange * leverage / 100) }
    });

    return {
        datasets: [{
            backgroundColor: 'transparent',
            borderColor: 'rgb(39, 107, 251)',
            borderWidth: 4,
            radius: 0,
            data: baseSolid
        },
        {
            backgroundColor: 'transparent',
            borderColor: 'rgb(51, 223, 204)',
            borderWidth: 4,
            radius: 0,
            data: leverageData,
            borderDash: [15, 3]
        },
        {
            backgroundColor: 'transparent',
            borderColor: 'rgb(86, 169, 255)',
            borderWidth: 2,
            radius: 0,
            data: baseDashed,
            borderDash: [8, 4]
        }
        ]
    }
}

window.addEventListener('load', function () {
    //switch theme
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');
    var ctx = document.getElementById("myChart");
    var data = getChartData();
    if (ctx) {
        ctx.getContext("2d");

        var chart = new Chart(ctx, {
            type: "line",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scaleShowLabels: false,
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5
                    }
                },
                labels: {
                    render: 'title',
                    fontColor: ['green', 'white', 'red'],
                    precision: 2
                },
                animation: {
                    easing: "easeOutExpo",
                    duration: 500
                },
                annotation: {
                    annotations: [
                        {
                            drawTime: "afterDatasetsDraw",
                            type: "line",
                            mode: "vertical",
                            scaleID: "x-axis-0",
                            value: parseInt(baseData.length / 2) + 1,
                            borderWidth: 3,
                            borderColor: (localStorage.getItem('theme') === 'light') ? '#ffffff' : '#495460'
                        }
                    ]
                },
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: {
                            display: false
                        },
                        type: 'linear',
                        position: 'bottom'
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: {
                            display: false
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    }
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
        }
    }

    function updateChartData() {
        var data = getChartData();
        chart.data = data;
        chart.update();
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            chart.options.annotation.annotations[0].borderColor = '#ffffff';
        }
        else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            chart.options.annotation.annotations[0].borderColor = '#495460';
        }
        chart.update();
    }

    toggleSwitch.addEventListener('change', switchTheme, false);

    //accordion
    var accordions = document.querySelectorAll('#accordion .accordion-toggle');
    for (var i = 0; i < accordions.length; i++) {
        accordions[i].onclick = function () {
            var items = document.querySelectorAll('.accordion-item');
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove("active");
            }
            this.parentElement.classList.add("active");
        };
    }
    //change active button-coin
    var coins = document.querySelectorAll('#calculator-earn .coin-calc');
    for (var i = 0; i < coins.length; i++) {
        coins[i].onclick = function () {
            var items = document.querySelectorAll('.coin-calc');
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove("active");
            }
            this.classList.add("active");
        };
    }

    var qualityInput = document.querySelector('.input-quality');
    var qualityRange = document.querySelector('.range-quality');

    if (qualityInput) {
        qualityRange.oninput = function () {
            var newVal = this.value;
            qualityInput.value = newVal;
        }
    }
    if (qualityRange) {
        qualityInput.oninput = function () {
            var newVal = this.value;
            qualityRange.value = newVal;
        }
    }
    var gainRange = document.querySelector('.gain-range');
    var ethPrice = document.querySelector('.eth-price');
    var resultGain = document.querySelectorAll('.result-gain');
    var beforeGain = document.querySelector('.before-gain');
    var beforeDataGain = document.querySelector('.before-data-gain');
    var youGain = document.querySelector(".your-gain");

    if (gainRange) {
        gainRange.oninput = function () {
            updateChartData();
            youGain.innerHTML = parseInt(document.querySelector(".button-group-gains .button-gains.active").dataset.leverage) * this.value;
            ethPrice.innerHTML = this.value;
            beforeDataGain.innerHTML = Math.abs(this.value);
            beforeGain.style.display = 'flex';
            beforeGain.style.left = 'calc(50% + ' + this.value / 2 + '% - 33px - (12px *' + this.value / 100 + '))';
            if (this.value < 0) {
                for (var i = 0; i < resultGain.length; i++) {
                    resultGain[i].classList.add("negative");
                }
            } else {
                for (var i = 0; i < resultGain.length; i++) {
                    resultGain[i].classList.remove("negative");
                }
            }

        }
        gainRange.onchange = function () {
            beforeGain.style.display = 'none';
        }
    }
    //mobile menu
    let openMenu = document.querySelector("#hamburger-menu-open");
    let closeMenu = document.querySelector("#hamburger-menu-close");
    let body = document.querySelector('body');
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
    if (document.querySelector(".seconds") && document.querySelector(".minutes") && document.querySelector(".hours"))
        timer();

    var buttonsGains = document.querySelectorAll('.button-gains');
    for (var i = 0; i < buttonsGains.length; i++) {
        buttonsGains[i].onclick = function () {
            var itemGains = document.querySelectorAll('.button-gains');
            for (var i = 0; i < itemGains.length; i++) {
                itemGains[i].classList.remove("active");
            }
            this.classList.add("active");
            updateChartData();
        };
    }
});