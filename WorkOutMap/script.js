"use strict";

// prettier-ignore
let workout

class WorkOut {
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(distance, duration, coords) {
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;

    }
    _setDescription() {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        // this.description = `${"hello".toUpperCase()}${"hello".slice(1)} on ${
        //   months[this.date.getMonth()]
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]
            } ${this.date.getDate()} `;
    }
}

class Running extends WorkOut {
    type = "running";

    constructor(distance, duration, coords, cadence) {
        super(distance, duration, coords);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends WorkOut {
    type = "cycling";

    constructor(distance, duration, coords, elevationGain) {
        super(distance, duration, coords);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();

    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
    #map;
    #mapEvent;
    #zoom = 13
    #workouts = [];

    constructor() {
        this._getPosition();
        form.addEventListener("submit", this._newWorkOut.bind(this));
        inputType.addEventListener("change", this._toggleElevationField);
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))
        this._getLocalStorage()

    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function (e) {
                    alert("Could not get your position");
                }
            );
        }
    }

    _loadMap(position) {
        const { longitude, latitude } = position.coords;
        const cords = [latitude, longitude];
        this.#map = L.map("map").setView(cords, this.#zoom);

        L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        this.#map.on("click", this._showForm.bind(this));
        
        this.#workouts.forEach((workout) => {
            this._renderWorkOutMarker(workout)

        })
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
    }

    _hideForm(mapE) {

        inputDistance.value =
            inputDuration.value =
            inputCadence.value =
            inputElevation.value =
            "";
        form.style.display = "none"
        form.classList.add("hidden");
        setTimeout(() => form.style.display = "grid"
            , 1000)

    }

    _toggleElevationField() {
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    }

    _newWorkOut(e) {
        e.preventDefault();
        
            const validInputs = (...inputs) =>
                inputs.every((input) => Number.isFinite(input));
            const allPositives = (...inputs) => inputs.every((input) => input > 0);
            const { lat, lng } = this.#mapEvent.latlng;

            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;

            if (type === "running") {
                const cadence = +inputCadence.value;
                if (
                    !validInputs(distance, duration, cadence) ||
                    !allPositives(distance, duration, cadence)
                ) {
                    return alert("Inputs have to be positive numbers");
                }

                workout = new Running(distance, duration, [lat, lng], cadence);
            }

            if (type === "cycling") {
                const elevation = +inputElevation.value;
                if (
                    !validInputs(distance, duration, elevation) ||
                    !allPositives(distance, duration)
                ) {
                    return alert("Inputs have to be positive numbers");
                }
                workout = new Cycling(distance, duration, [lat, lng], elevation);
            }
            this.#workouts.push(workout);
            this._renderWorkOutMarker(workout);
            this._renderWorkOut(workout);
            this._hideForm();
            this._setLocalStorage()



    }

    _renderWorkOutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                })
            )
            .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
                } ${workout.description}`)
            .openPopup();
    }

    _renderWorkOut(workout) {
        let html = `<li class="workout workout--${workout.type}" data-id=${workout.id
            }>
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
            }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

        if (workout.type == "running") {
            html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace.toFixed(1)}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
  </li>`;
        }

        if (workout.type == "cycling") {
            html += `  <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li> `;
        }

        form.insertAdjacentHTML("afterend", html);
    }


    _moveToPopup(e) {
        const workOutEl = e.target.closest('.workout')
        if (!workOutEl) {
            return
        }


        const workout = this.#workouts.find((workout) => workout.id === workOutEl.dataset.id)
        this.#map.setView(workout.coords, this.#zoom, {
            animate: true,
            pan: {
                duration: 1
            }
        }
        )


    }

    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts))

    }

    _getLocalStorage() {

        const data = JSON.parse(localStorage.getItem('workouts'))
        if (!data) {
            return
        }
        this.#workouts = data

        this.#workouts.forEach((workout) => {
            this._renderWorkOut(workout)

        })

    }
}

const app = new App();
