document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loadCarList();
});

function loadCarList() {
  fetch('./data/car-list.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((carList) => {
      console.log('Car list loaded:', carList);
      renderCarList(carList);
      AOS.refresh(); // <-- Add this
    })
    .catch((err) => console.error('Failed to load car list:', err));
}

function renderCarList(carList) {
  console.log('renderCarList called with:', carList);

  const container = document.getElementById('carListContainer');
  if (!container) {
    console.error('Missing container with id="carListContainer"');
    return;
  }

  carList.forEach((car, index) => {
    const firstPrice = car.variants[0].price;

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

    container.insertAdjacentHTML('beforeend', card);
  });
}


function formatCurrency(value) {
  return Number(value).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
