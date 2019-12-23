const baseData = [
    { x: 1, y: 80 },
    { x: 2, y: 60 },
    { x: 3, y: 30 },
    { x: 4, y: 20 },
    { x: 5, y: 35 },
    { x: 6, y: 25 },
    { x: 7, y: 40 },
    { x: 8, y: 36 },
    { x: 9, y: 34 },
    { x: 10, y: 50 },
    { x: 11, y: 33 },
    { x: 12, y: 37 },
    { x: 13, y: 45 },
    { x: 14, y: 35 },
    { x: 15, y: 37 },
    { x: 16, y: 50 },
    { x: 17, y: 43 },
    { x: 18, y: 50 },
    { x: 19, y: 45 },
    { x: 20, y: 55 },
    { x: 21, y: 50 },
    { x: 22, y: 45 },
    { x: 23, y: 40 },
    { x: 24, y: 30 },
    { x: 25, y: 25 },
    { x: 26, y: 35 },
    { x: 27, y: 40 },
    { x: 28, y: 37 },
    { x: 29, y: 45 },
    { x: 30, y: 50 },
    { x: 31, y: 60 },
    { x: 32, y: 55 },
    { x: 33, y: 50 },
    { x: 34, y: 53 },
    { x: 35, y: 55 },
    { x: 36, y: 50 },
    { x: 37, y: 45 },
    { x: 38, y: 40 },
    { x: 39, y: 45 },
    { x: 40, y: 50 },
    { x: 41, y: 55 },
]

var gainRange = document.querySelector('.gain-range');
var ethPrice = document.querySelector('.eth-price');
var resultGain = document.querySelectorAll('.result-gain');
var beforeGain = document.querySelector('.before-gain');
var beforeDataGain = document.querySelector('.before-data-gain');
var leverageButton = () => document.querySelector(".button-group-gains .button-gains.active");
var yourGain = document.querySelector(".your-gain");
var gainText = document.querySelector(".gain-text");

window.addEventListener('load', function () {
    var ctx = document.getElementById("myChart");
    var data = getChartData();
    ctx.getContext("2d");

    window.chart = new Chart(ctx, {
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




    //accordion
    var accordions = document.querySelectorAll('#accordion .accordion-toggle');
    for (var i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", updateAccordion, false);
    }



    gainRange.addEventListener("input", function () {
        updateChartData();
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

    });

    gainRange.addEventListener("change", function () {
        beforeGain.style.display = 'none';
    })

    var buttonsGains = document.querySelectorAll('.button-gains');
    for (var i = 0; i < buttonsGains.length; i++) {
        buttonsGains[i].addEventListener("click", updateButtonGains, false);
    }
});


function updateButtonGains(e) {
    var itemGains = document.querySelectorAll('.button-gains');
    for (var i = 0; i < itemGains.length; i++) {
        itemGains[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    updateChartData();
}

function updateAccordion(e) {
    var items = document.querySelectorAll('.accordion-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
    }
    e.currentTarget.parentElement.classList.add("active");
}

function getChartData() {
    //the only way to create an immutable copy of array with objects inside.
    var baseDashed = JSON.parse(JSON.stringify(baseData.slice(parseInt(baseData.length / 2))));
    var baseSolid = JSON.parse(JSON.stringify(baseData.slice(0, parseInt(baseData.length / 2 + 1))));


    var leverage = parseInt(leverageButton().dataset.leverage);
    var priceChange = parseInt(gainRange.value);
    var gain = leverage * priceChange;
    yourGain.innerHTML = gain < -100 ? "100" : Math.abs(gain);
    gainText.innerHTML = gain < 0 ? "You Lose" : "You Gain"

    baseDashed.forEach((item, index) => {
        if (index !== 0)
            item.y += item.y * priceChange / 100;
    })
    var leverageData = baseDashed.map((item, index) => {
        if (index === 0) { return { x: item.x, y: item.y } }
        var gain = priceChange * leverage / 100;
        return { x: item.x, y: item.y * (1 + gain) }
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
            borderColor: priceChange >= 0 ? 'rgb(51, 223, 204)' : 'rgb(255,79,79)',
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

function updateChartData() {
    var data = getChartData();
    chart.data = data;
    chart.update();
}