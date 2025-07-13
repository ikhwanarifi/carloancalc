// Wait until the entire DOM content is loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loadCarList(); // Call function to load and display the car list
});

// Function to fetch car list data from a JSON file
function loadCarList() {
  fetch('./data/car-list.json') // Request car data from local JSON file
    .then((response) => {
      // Check if the response is OK (status code 200–299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((carList) => {
      console.log('Car list loaded:', carList);
      renderCarList(carList); // Pass the car list data to be rendered
      AOS.refresh(); // Refresh AOS (Animate On Scroll) library animations
    })
    .catch((err) => console.error('Failed to load car list:', err)); // Handle any errors
}

// Function to display car list on the webpage
function renderCarList(carList) {
  console.log('renderCarList called with:', carList);

  const container = document.getElementById('carListContainer'); // Get the container element
  if (!container) {
    console.error('Missing container with id="carListContainer"');
    return; // Stop if the container is not found
  }

  // Loop through each car object in the list
  carList.forEach((car, index) => {
    const firstPrice = car.variants[0].price; // Get the first variant's price

    // Create a HTML card for each car using template literals
    const card = `
      <div class="col-md-4">
        <div class="car-wrap rounded" data-aos="fade-up">
          <div class="img rounded d-flex align-items-end"
               style="background-image: url(images/${car.image}.jpg)"></div>
          <div class="text">
            <h2 class="mb-0"><a href="car-single.html">${car.model}</a></h2>
            <div class="d-flex mb-3">
              <span class="cat">From</span>
              <p class="price ml-auto">RM ${formatCurrency(firstPrice)}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', card); // Add the card to the container
  });
}

// Function to format numbers as Malaysian currency with 2 decimal places
function formatCurrency(value) {
  return Number(value).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
