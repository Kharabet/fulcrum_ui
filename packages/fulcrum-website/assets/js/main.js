window.onload = function () {
    //switch theme
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
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
    timer();
};

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