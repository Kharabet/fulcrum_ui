const apiUrl = "https://fulcrum-api-dev.herokuapp.com/api";

async function getTorqueBorrowApr(){
    const requestUrl = `${apiUrl}/torque-borrow-rate-apr`;
    const respone = await fetch(requestUrl);
    const responseJson = await response.json();

}

function renderBorrowApr(apr){
    
}

window.addEventListener('load', function () {
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

    //accordion
    var accordions = document.querySelectorAll('#accordion .accordion-toggle');
    for (var i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", updateAccordion, false);
    }

    function setAriaAttr(el, ariaType, newProperty) {
        el.setAttribute(ariaType, newProperty);
    };
    function setAccordionAria(el, expanded) {
        switch (expanded) {
            case "true":
                setAriaAttr(el, 'aria-hidden', 'false');
                break;
            case "false":
                setAriaAttr(el, 'aria-hidden', 'true');
                break;
            default:
                break;
        }
    };
    function updateAccordion(e) {
        if (e.currentTarget.parentElement.classList.contains("active")) {
            setAccordionAria(e.currentTarget.nextElementSibling, "false");
            e.currentTarget.parentElement.classList.remove("active");
        } else {
            setAccordionAria(e.currentTarget.nextElementSibling, "true");
            e.currentTarget.parentElement.classList.add("active");
        }
    }

    var url = document.querySelectorAll('.nav-menu');
    for (var i = 0; i < url.length; i++) {
        if (url[i].getAttribute("href") == window.location.pathname)
            url[i].classList.add("active-url");
    }

    async function onLoanInputChange(e) {
        const form = e.currentTarget;
        const inputLoan = form.querySelector('.input-loan');
        const inputCollateral = form.querySelector('.input-collateral');
        const loanAsset = form.querySelector(".item-form.loan .select-styled").dataset.asset;
        const collateralAsset = form.querySelector(".item-form.collateral .select-styled").dataset.asset;
        const inputLoanValue = inputLoan.value;
        inputLoanValue.includes("")
            ? form.classList.remove('active')
            : form.classList.add('active');
        const collateralEstimateValue = await collateralEstimate(loanAsset, collateralAsset, inputLoanValue);
        inputCollateral.value = collateralEstimateValue;
    }

    async function collateralEstimate(loanAsset, collateralAsset, amount) {
        const requestUrl = `${apiUrl}//borrow-deposit-estimate?borrow_asset=${loanAsset}&collateral_asset=${collateralAsset}&amount=${amount}`;
        const collateralEstimateResponse = await fetch(requestUrl);
        const responseJson = await collateralEstimateResponse.json();
        const depositAmount = responseJson.depositAmount;
        return depositAmount;
    }

    const formLoan = document.querySelector('.form-loan');
    formLoan.addEventListener("input", onLoanInputChange, false);
});