function timer() {
    var itemSecond = document.querySelector(".seconds");
    var itemMinute = document.querySelector(".minutes");
    var itemHour = document.querySelector(".hours");
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

window.addEventListener('load', function () {
    //change active button-coin
    var coins = document.querySelectorAll('#calculator-earn .coin-calc');
    var wrapperFinance = document.querySelector('.wrapper-finance');
    for (var i = 0; i < coins.length; i++) {
        coins[i].onclick = function () {
            var items = document.querySelectorAll('.coin-calc');
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove('active');
            }
            var getToken = this.getAttribute('data-token');
            getToken === 'dai' || getToken === 'susd' || getToken === 'usdc'
                ?
                wrapperFinance.style.display = 'block'
                :
                wrapperFinance.style.display = 'none';
            this.classList.add("active");
        };
    }

    var quantityInput = document.querySelector('.input-quantity');
    var quantityRange = document.querySelector('.range-quantity');

    if (quantityInput) {
        quantityRange.oninput = function () {
            var newVal = this.value;
            quantityInput.value = newVal;
        }
    }
    if (quantityRange) {
        quantityInput.oninput = function () {
            var newVal = this.value;
            quantityRange.value = newVal;
        }
    }

    if (document.querySelector(".seconds") && document.querySelector(".minutes") && document.querySelector(".hours"))
        timer();
});