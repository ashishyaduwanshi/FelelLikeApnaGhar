document.addEventListener("DOMContentLoaded", () => {
    let taxSwitch = document.getElementById("flexSwitchCheckDefault");
    if (taxSwitch) {
        taxSwitch.addEventListener("click", () => {
            let taxInfo = document.getElementsByClassName("tax-info");
            let priceElements = document.getElementsByClassName("price");

            for (let i = 0; i < taxInfo.length; i++) {
                let priceElement = priceElements[i];
                let basePrice = parseFloat(priceElement.getAttribute("data-base-price"));

                if (taxSwitch.checked) {
                    let totalPrice = basePrice * 1.18;
                    priceElement.innerText = totalPrice.toFixed(2);
                    taxInfo[i].style.display = "inline";
                } else {
                    priceElement.innerText = basePrice.toFixed(2);
                    taxInfo[i].style.display = "none";
                }
            }
        });

        // Store base prices in a data attribute for easy access
        let prices = document.getElementsByClassName("price");
        for (let price of prices) {
            price.setAttribute("data-base-price", price.innerText);
        }
    }
});




//code to adjust toggle 
document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const filtersSection = document.getElementById('filters');

    navbarToggler.addEventListener('click', function () {
        setTimeout(function () { // Allow the collapse animation to complete
            if (navbarCollapse.classList.contains('show')) {
                const navHeight = navbarCollapse.scrollHeight;
                filtersSection.style.marginTop = `${navHeight}px`;
            } else {
                filtersSection.style.marginTop = '0';
            }
        }, 250); // 350ms matches the Bootstrap collapse transition duration
    });

    // Listen to the collapse event to reset margin
    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
        filtersSection.style.marginTop = '0';
    });

    navbarCollapse.addEventListener('shown.bs.collapse', function () {
        const navHeight = navbarCollapse.scrollHeight;
        filtersSection.style.marginTop = `${navHeight}px`;
    });
});



