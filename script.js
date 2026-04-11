/**
 * Currency Converter Logic
 * Author: Antigravity
 * API: open.er-api.com (Free, no key required for basic usage)
 */

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const resultText = document.getElementById("result");
const exchangeRateText = document.getElementById("exchange-rate");
const themeToggle = document.getElementById("theme-toggle");
const loader = document.getElementById("loader");
const btnText = document.getElementById("btn-text");
const resultArea = document.getElementById("result-area");

// List of currencies with names and country codes
const currencies = {
    "USD": { name: "United States Dollar", country: "US" },
    "ETB": { name: "Ethiopian Birr", country: "ET" },
    "EUR": { name: "Euro", country: "FR" },
    "GBP": { name: "British Pound", country: "GB" },
    "INR": { name: "Indian Rupee", country: "IN" },
    "AUD": { name: "Australian Dollar", country: "AU" },
    "CAD": { name: "Canadian Dollar", country: "CA" },
    "JPY": { name: "Japanese Yen", country: "JP" },
    "CNY": { name: "Chinese Yuan", country: "CN" },
    "AED": { name: "UAE Dirham", country: "AE" },
    "SAR": { name: "Saudi Riyal", country: "SA" },
    "TRY": { name: "Turkish Lira", country: "TR" },
    "KES": { name: "Kenyan Shilling", country: "KE" },
    "ZAR": { name: "South African Rand", country: "ZA" }
};

// Populate dropdowns on load
function populateDropdowns() {
    for (let code in currencies) {
        let option1 = `<option value="${code}" ${code === "USD" ? "selected" : ""}>${code} - ${currencies[code].name}</option>`;
        let option2 = `<option value="${code}" ${code === "ETB" ? "selected" : ""}>${code} - ${currencies[code].name}</option>`;
        
        fromCurrency.insertAdjacentHTML("beforeend", option1);
        toCurrency.insertAdjacentHTML("beforeend", option2);
    }
}

// Update flags when selection changes
function updateFlag(element) {
    const currencyCode = element.value;
    const countryCode = currencies[currencyCode].country;
    const flagImg = element.parentElement.querySelector("img");
    flagImg.style.transform = "scale(0.5)";
    flagImg.style.opacity = "0";
    
    setTimeout(() => {
        flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
        flagImg.style.transform = "scale(1)";
        flagImg.style.opacity = "1";
    }, 200);
}

// Main function to get exchange rate
async function getExchangeRate() {
    let amountVal = amountInput.value;
    if (amountVal === "" || amountVal <= 0) {
        amountInput.value = "1";
        amountVal = 1;
    }

    // UI state: Loading
    convertBtn.classList.add("pulse");
    convertBtn.disabled = true;
    loader.style.display = "inline-block";
    btnText.innerText = "Processing...";
    
    const url = `https://open.er-api.com/v6/latest/${fromCurrency.value}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const rate = data.rates[toCurrency.value];
        const total = (amountVal * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Update UI with result
        exchangeRateText.innerText = `1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}`;
        resultText.innerText = `${amountVal} ${fromCurrency.value} = ${total} ${toCurrency.value}`;
        
        // Add success animation
        resultArea.classList.remove("pulse");
        void resultArea.offsetWidth; // Trigger reflow
        resultArea.classList.add("pulse");

    } catch (error) {
        console.error("Error fetching rate:", error);
        resultText.innerText = "Error: Use a valid amount";
        exchangeRateText.innerText = "Something went wrong. Try again later.";
    } finally {
        // UI state: Ready
        convertBtn.disabled = false;
        loader.style.display = "none";
        btnText.innerText = "Convert Now";
        convertBtn.classList.remove("pulse");
    }
}

// Event Listeners
window.addEventListener("load", () => {
    populateDropdowns();
    getExchangeRate();
});

fromCurrency.addEventListener("change", (e) => {
    updateFlag(e.target);
    getExchangeRate();
});

toCurrency.addEventListener("change", (e) => {
    updateFlag(e.target);
    getExchangeRate();
});

swapBtn.addEventListener("click", () => {
    // Swap values with a rotate animation already in CSS
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // Update flags
    updateFlag(fromCurrency);
    updateFlag(toCurrency);
    
    // Convert again
    getExchangeRate();
});

convertBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});

// Theme Togggle Logic
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = themeToggle.querySelector("i");
    
    // Animate icon switch
    icon.style.transform = "scale(0) rotate(-90deg)";
    setTimeout(() => {
        if (document.body.classList.contains("dark-mode")) {
            icon.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        } else {
            icon.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        }
        icon.style.transform = "scale(1) rotate(0deg)";
    }, 200);
});

// Check for saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
}
