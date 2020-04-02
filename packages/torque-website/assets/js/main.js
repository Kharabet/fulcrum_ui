const apiUrl = "https://api.bzx.network/v1";

const loader = document.querySelector('.loader');

loader.classList.add('visible');
(getTorqueBorrowApr)();
setTimeout(function () {
    loader.classList.remove('visible')
}, 500);

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


    toggleSwitch.addEventListener('change', switchTheme, false);

    //accordion
    var accordions = document.querySelectorAll('#accordion .accordion-toggle');
    for (var i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", updateAccordion, false);
    }

    var url = document.querySelectorAll('.nav-menu');
    for (var i = 0; i < url.length; i++) {
        if (url[i].getAttribute("href") == window.location.pathname)
            url[i].classList.add("active-url");
    }


    const formLoan = document.querySelector('.form-loan');
    if (formLoan)
        formLoan.addEventListener("input", onLoanInputChange, false);


    const itemForm = document.querySelectorAll('.item-form');
    itemForm.forEach(item => {
        item.querySelector('.select-styled').addEventListener("click", onStyledSelectClick);
        item.querySelectorAll('.li-options').forEach(option => option.addEventListener("click", onItemFormLiClick));
    });

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
});

const modal = document.querySelector(".modal");
modal.onclick = function (event) {
    const listSelect = document.querySelectorAll("ul.select-options");
    const selectStyled = document.querySelectorAll(".select-styled");
    const options = document.querySelectorAll(".li-options");
    for (let i = 0; i < listSelect.length; i++) {
        if (event.target !== listSelect)
            listSelect[i].style.display = "none";
    }
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('hidden');
    }
    selectStyled.forEach(item => item.classList.remove('active'));
    if (event.target !== listSelect) {
        document.body.classList.remove('open-modal');
    }
}


async function collateralEstimate(loanAsset, collateralAsset, amount) {
    const requestUrl = `${apiUrl}//borrow-deposit-estimate?borrow_asset=${loanAsset}&collateral_asset=${collateralAsset}&amount=${amount}`;
    const collateralEstimateResponse = await fetch(requestUrl);
    const responseJson = await collateralEstimateResponse.json();
    const errorLargeLoan = 'Loan is too large';
    return (!responseJson.success)
        ? errorLargeLoan
        : (new Number(responseJson.data.depositAmount)).toFixed(2);
}
async function onLoanInputChange(e) {
    const form = e.currentTarget;
    const inputLoan = form.querySelector('.input-loan');
    const inputLoanValue = parseInt(inputLoan.value);
    inputLoanValue > 0
        ? form.classList.add('active')
        : form.classList.remove('active');
    updateCollateralInput();
}

async function updateCollateralInput() {
    const form = document.querySelector('.form-loan');
    const inputLoan = form.querySelector('.input-loan');
    const inputCollateral = form.querySelector('.input-collateral');
    const loanAsset = form.querySelector(".item-form.loan .select-styled").dataset.asset;
    const collateralAsset = form.querySelector(".item-form.collateral .select-styled").dataset.asset;

    const inputLoanValue = parseInt(inputLoan.value);
    if (inputLoanValue === 0 || inputLoan.value.length === 0) {
        if (inputCollateral.classList.contains('error'))
            inputCollateral.classList.remove('error')
        inputCollateral.value = 0;
    }
    if (inputLoanValue > 0) {
        const collateralEstimateValue = await collateralEstimate(loanAsset, collateralAsset, inputLoanValue);
        isNaN(collateralEstimateValue)
            ? inputCollateral.classList.add('error')
            : inputCollateral.classList.remove('error');
        inputCollateral.value = collateralEstimateValue;
    }
}

function setAriaAttr(el, ariaType, newProperty) {
    el.setAttribute(ariaType, newProperty);
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
function renderBorrowApr(apr) {
    const aprComponents = document.querySelectorAll(".apr-component");
    aprComponents.forEach(aprComponent => {
        if (!aprComponent.dataset.asset) return;
        const asset = aprComponent.dataset.asset;
        if (apr[asset] !== undefined) {
            const aprValue = aprComponent.querySelector(".apr-value");
            aprValue.textContent = parseFloat(apr[asset]).toFixed(2);
        }
    })
}

function onStyledSelectClick(event) {
    event.stopPropagation();
    const current = event.currentTarget;
    const select = current.closest(".select");
    const listSelect = select.querySelector("ul.select-options");
    const options = select.querySelectorAll(".li-options");
    const loanAsset = document.querySelector(".item-form.loan .select-styled").dataset.asset;
    const collateralAsset = document.querySelector(".item-form.collateral .select-styled").dataset.asset;
    for (let i = 0; i < options.length; i++) {
        if (options[i].dataset.asset && (options[i].dataset.asset === loanAsset || options[i].dataset.asset === collateralAsset))
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

async function onItemFormLiClick(event) {
    event.stopPropagation();
    const li = event.currentTarget;
    const itemForm = li.closest('.item-form');
    const select = li.closest(".select");
    const listSelect = select.querySelector("ul.select-options");
    const options = select.querySelectorAll(".li-options");
    const selectStyled = select.querySelector(".select-styled");
    const asset = li.dataset.asset;
    selectStyled.textContent = li.textContent;
    selectStyled.style.backgroundImage = `url(/images/${asset.toLowerCase()}.svg)`;
    selectStyled.classList.remove('active');
    listSelect.style.display = 'none';
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('hidden');
    }
    selectStyled.dataset.asset = asset;
    if (itemForm.classList.contains("loan")) {
        const form = li.closest('form.form-loan');
        const aprComponent = form.querySelector(".apr-component");
        aprComponent.dataset.asset = asset;
        loader.classList.add('visible');
        if (window.borrowAPR && window.borrowAPR[asset])
            aprComponent.querySelector(".apr-value").textContent = parseFloat(window.borrowAPR[asset]).toFixed(2);
        setTimeout(function () {
            loader.classList.remove('visible')
        }, 500);
    }
    updateCollateralInput();
    document.body.classList.remove('open-modal');
}

async function getTorqueBorrowApr() {
    const requestUrl = `${apiUrl}/torque-borrow-rate-apr`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    (!responseJson.success)
        ? console.error(responseJson.message)
        : renderBorrowApr(responseJson.data);
    window.borrowAPR = responseJson.data;
}
