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

function timer() {
    var wrapHours = document.querySelector('.wrap-hours');
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
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

function changePositionBorderThumb (range, current) {
    leftRangeQuantity.style.left = 'calc(' + current.value / range.max * 100 + '% - 12px - (16px *' + (current.value - range.max / 2) / range.max + '))'; //12 - half of width thumb with border, 16 - width thumb without border
    rightRangeQuantity.style.left = 'calc(' + current.value / range.max * 100 + '% - 12px + 20px - (16px *' + (current.value - range.max / 2) / range.max + '))'; //12 - half of width thumb with border, 16 - width thumb without border 
    trackRangeQuantity.style.width = 'calc(' + current.value / range.max * 100 + '% - 12px - (16px *' + (current.value - range.max / 2) / range.max + '))'; ;
}

window.addEventListener('load', function () {
    //change active button-coin
    for (var i = 0; i < coins.length; i++) {
        coins[i].onclick = function () {
            var items = document.querySelectorAll('.coin-calc');
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove('active');
            }
            var token = this.getAttribute('data-token');
            wrapperFinance.style.display = ['dai', 'susd', 'usdc'].includes(token)
                ? 'block'
                : 'none';
            this.classList.add("active");
        };
    }
    changePositionBorderThumb(quantityRange, quantityRange);

    quantityRange.oninput = function (event) {
        quantityInput.value = event.currentTarget.value;
        changePositionBorderThumb(quantityRange, event.currentTarget);
    }

    quantityInput.oninput = function (event) {
        if (!event.currentTarget.value)
            quantityRange.value = 0;

        if (event.currentTarget.value > 1000000)
            event.currentTarget.value = 1000000;

        quantityRange.value = event.currentTarget.value;
        changePositionBorderThumb(quantityRange, event.currentTarget);
    }

    timer();
});