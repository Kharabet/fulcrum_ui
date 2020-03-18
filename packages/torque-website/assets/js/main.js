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
    
    function setAriaAttr (el, ariaType, newProperty) {
        el.setAttribute(ariaType, newProperty);
    };
    function setAccordionAria (el, expanded) {
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
        if(e.currentTarget.parentElement.classList.contains("active")){        
            setAccordionAria(e.currentTarget.nextElementSibling, "false");
            e.currentTarget.parentElement.classList.remove("active");
        }else{
            setAccordionAria(e.currentTarget.nextElementSibling, "true");
            e.currentTarget.parentElement.classList.add("active");
        }
    }
});