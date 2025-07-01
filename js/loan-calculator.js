// Global variables
let carList = null;
let carModel, carVariant, downPayment, interestRate, loanDuration;

// Number formatting options
const currencyOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

// Wait for DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready');

  // Cache DOM elements once
  carModel = document.getElementById('carModel');
  carVariant = document.getElementById('carVariant');
  downPayment = document.getElementById('downPayment');
  interestRate = document.getElementById('interestRate');
  loanDuration = document.getElementById('loanDuration');

  disableForm();
  attachEventListeners();
  loadCarList();
});

/**
 * Disable all form input elements
 */
function disableForm() {
  [carModel, carVariant, downPayment, interestRate, loanDuration].forEach(
    (el) => (el.disabled = true)
  );
}

/**
 * Enable specific form input elements after data is loaded
 */
function enableForm() {
  [carModel, downPayment, interestRate, loanDuration].forEach(
    (el) => (el.disabled = false)
  );
}

/**
 * Attach change event listeners to form inputs
 */
function attachEventListeners() {
  [carModel, carVariant, downPayment, interestRate, loanDuration].forEach((el) =>
    el.addEventListener('change', handleChange)
  );
  carModel.addEventListener('change', handleCarModelChange);
}

/**
 * Fetch car list JSON, store in carList, then populate form options
 */
async function loadCarList() {
  try {
    const response = await fetch('./data/car-list.json');
    if (!response.ok) throw new Error('Failed to load car data JSON');

    carList = await response.json();

    enableForm();
    populateCarModels();
    console.log('Car data loaded successfully');
  } catch (error) {
    console.error('Error loading car data:', error);
  }
}

/**
 * Populate car model options based on loaded carList
 */
function populateCarModels() {
  carList.forEach((car) => {
    const option = document.createElement('option');
    option.value = car.model;
    option.textContent = car.model;
    carModel.appendChild(option);
  });
}

/**
 * Handle when car model selection changes:
 * populate corresponding variant options
 */
function handleCarModelChange() {
  const selectedModel = carModel.value;
  const selectedCar = carList.find((car) => car.model === selectedModel);

  carVariant.innerHTML = '<option value="">Choose Variant</option>';

  if (selectedCar) {
    selectedCar.variants.forEach((variant) => {
      const option = document.createElement('option');
      option.value = variant.variant;
      option.textContent = `${variant.variant} - RM ${formatCurrency(
        variant.price
      )}`;
      carVariant.appendChild(option);
    });
    carVariant.disabled = false;
  } else {
    carVariant.disabled = true;
  }

  handleChange({ target: carModel });
}

/**
 * Main handler for form input changes
 */
function handleChange(event) {
  console.log(`${event.target.id} changed to: ${event.target.value}`);

  const price = getSelectedVariantPrice();
  const downPay = parseFloat(downPayment.value) || 0;
  const interRate = parseFloat(interestRate.value) || 0;
  const duration = parseFloat(loanDuration.value) || 0;

  if (!price || interRate === 0 || duration === 0) {
    updateLoanOutputs('-', '-', '-', '-');
    return;
  }

  const loanAmount = price - downPay;
  if (loanAmount <= 0) {
    updateLoanOutputs('-', '-', '-', '-');
    return;
  }

  const totalInterest = loanAmount * (interRate / 100) * (duration / 12);
  const totalPayment = loanAmount + totalInterest;
  const monthlyPayment = totalPayment / duration;

  updateLoanOutputs(monthlyPayment, loanAmount, totalInterest, totalPayment);
}

/**
 * Update loan result outputs
 */
function updateLoanOutputs(monthly, principal, interest, total) {
  setOutput('monthlyPayment', monthly);
  setOutput('totalLoan', principal);
  setOutput('totalInterest', interest);
  setOutput('totalCost', total);
}

/**
 * Helper to set formatted currency or placeholder
 */
function setOutput(id, value) {
  document.getElementById(id).textContent =
    value === '-'
      ? '-'
      : 'RM' + formatCurrency(Number(value));
}

/**
 * Format number as Malaysian currency with commas and 2 decimal places
 */
function formatCurrency(value) {
  return value.toLocaleString('en-MY', currencyOptions);
}

/**
 * Get price of selected car variant
 */
function getSelectedVariantPrice() {
  const selectedModel = carModel.value;
  const selectedVariant = carVariant.value;
  if (!selectedModel || !selectedVariant) return null;

  const selectedCar = carList.find((car) => car.model === selectedModel);
  if (!selectedCar) return null;

  const variantObj = selectedCar.variants.find(
    (variant) => variant.variant === selectedVariant
  );
  return variantObj ? variantObj.price : null;
}
