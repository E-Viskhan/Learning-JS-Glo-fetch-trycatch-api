const select = document.getElementById('cars');
const selectedCars = document.querySelector('.selected-cars');
const chooseCarText = document.querySelector('.choose-car');

const getData = ({ url, method = 'GET' }) => {
  return fetch(url, { method })
    .then(data => data.json())
    .then(carsObj => carsObj.cars)
    .catch(() => console.log('Ошибка при получении данных. Вероятно нерправильная ссылка'));
};

const url = 'https://bfs01.getcourse.ru/public/files/12250/88/84120897322424565eb4cddeea2b910a.json?e=1641585599&s=z0XXuqx8O8HwjGlJZwvcLQ';

const fillSelect = () => {
  getData({ url }).then(cars => {
    cars.forEach(car => {
      const option = document.createElement('option');
      option.className = 'cars__brand';
      option.textContent = car.brand;
      option.value = car.brand;
      select.insertAdjacentElement('beforeend', option);
    });
  });
};

const showCarInfo = e => {
  selectedCars.innerHTML = '';

  if (e.target.value === 'default') {
    chooseCarText.classList.remove('d-none');
    return;
  }

  chooseCarText.classList.add('d-none');

  getData({ url })
    .then(cars => {
      cars.forEach(car => {
        if (car.brand === e.target.value) {
          const selectCar = `
            <div class="selected-cars__car">
              <span class="selected-cars__name">${car.brand + ' ' + car.model}</span>
              <span class="selected-cars__price">${car.price + '$'}</span>
            </div>`;
          selectedCars.insertAdjacentHTML('beforeend', selectCar);
        }
      });
    });

};

fillSelect();
select.addEventListener('change', (e) => { showCarInfo(e); });