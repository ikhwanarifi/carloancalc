let carList = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('hi');
  disableForm();
  loadCarList(); // Begin loading data
});

async function loadCarList() {
  try {
    const response = await fetch('./data/car-list.json');
    if (!response.ok) throw new Error('Failed to load JSON');

    const carData = await response.json();
    carList = carData;

    // You can call another function here if needed
    enableForm();
    console.log('bye');
  } catch (error) {
    console.error('Error loading car data:', error);
  }
}

function disableForm() {
  const carModel = document.getElementById('carModel');
  const carVariant = document.getElementById('carVariant');
  const downPayment = document.getElementById('downPayment');
  const interestRate = document.getElementById('interestRate');
  const loanDuration = document.getElementById('loanDuration');

  carModel.disabled = true;
  carVariant.disabled = true;
  downPayment.disabled = true;
  interestRate.disabled = true;
  loanDuration.disabled = true;
}

function enableForm() {
  const carModel = document.getElementById('carModel');
  const carVariant = document.getElementById('carVariant');
  const downPayment = document.getElementById('downPayment');
  const interestRate = document.getElementById('interestRate');
  const loanDuration = document.getElementById('loanDuration');

  carModel.disabled = false;
  carVariant.disabled = false;
  downPayment.disabled = false;
  interestRate.disabled = false;
  loanDuration.disabled = false;

  carList.forEach((car) => {
    const option = document.createElement('option');
    option.value = car.model;
    option.textContent = car.model;
    carModel.appendChild(option);
  });

  // When model changes, populate variants
  carModel.addEventListener('change', function () {
    const selectedModel = this.value;
    const selectedCar = carList.find((car) => car.model === selectedModel);

    // Clear previous variants
    carVariant.innerHTML = '<option value="">Choose Variant</option>';

    if (selectedCar) {
      selectedCar.variants.forEach((variant) => {
        const option = document.createElement('option');
        option.value = variant.variant;
        option.textContent = `${
          variant.variant
        } - RM ${variant.price.toLocaleString()}`;
        carVariant.appendChild(option);
      });
      carVariant.disabled = false;
    } else {
      carVariant.disabled = true;
    }
  });
}

carModel.addEventListener('change', handleChange);
carVariant.addEventListener('change', handleChange);
downPayment.addEventListener('change', handleChange);
interestRate.addEventListener('change', handleChange);
loanDuration.addEventListener('change', handleChange);

function handleChange(event) {
  console.log(`${event.target.id} changed to: ${event.target.value}`);
  // Add your custom logic here
}

//
//
//
//
//
//
//

document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('calculateLoan')
    .addEventListener('click', calculateLoan);

  // Calculate on any input change
  document
    .querySelectorAll('.loan-calculator input, .loan-calculator select')
    .forEach((input) => {
      input.addEventListener('change', calculateLoan);
      input.addEventListener('keyup', calculateLoan);
    });

  // Initial calculation
  calculateLoan();

  function calculateLoan() {
    const price =
      parseFloat(document.getElementById('vehiclePrice').value) || 0;
    const downPayment =
      parseFloat(document.getElementById('downPayment').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 48;
    const interestRate =
      parseFloat(document.getElementById('interestRate').value) || 0;

    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const payments = loanTerm;

    // Calculate monthly payment
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
      (Math.pow(1 + monthlyRate, payments) - 1);

    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - principal;

    // Update the UI
    document.getElementById('monthlyPayment').textContent =
      '$' + monthlyPayment.toFixed(2);
    document.getElementById('totalLoan').textContent =
      '$' + principal.toFixed(2);
    document.getElementById('totalInterest').textContent =
      '$' + totalInterest.toFixed(2);
    document.getElementById('totalCost').textContent =
      '$' + (principal + totalInterest).toFixed(2);
  }
});
