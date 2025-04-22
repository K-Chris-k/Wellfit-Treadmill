if (!customElements.get('count-down')) {
  customElements.define('count-down', class Countdown extends HTMLElement {
    constructor() {
      super();

      // Hide countdown immediately on construction before any content is visible
      this.style.display = 'none';

      if (!this.dataset.hasOwnTpl) {
        this.appendChild(document.getElementById('countdown-tpl').content.firstElementChild.cloneNode(true));
      }
      if (this.dataset.endtime) {
        this.initSingleCountdown();
      } else if (this.dataset.list) {
        this.initCountdownInList();
      } else {
        this.initFail();
      }
    }

    initSingleCountdown() {
      const pattern1 = /^\d{4}-\d{2}-\d{2}$/;
      const pattern2 = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
      const pattern3 = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(\:\d{2}|)(\+|-)\d{4}/;
      if (pattern1.test(this.dataset.endtime) || pattern2.test(this.dataset.endtime) || pattern3.test(this.dataset.endtime)) {
        var finalDate = this.dataset.endtime;
        if (pattern1.test(this.dataset.endtime)) {
          finalDate += ' 00:00:00' + this.dataset.timezone;
        } else if (pattern2.test(this.dataset.endtime)) {
          finalDate += this.dataset.timezone;
        }
        this.countDownDate = new Date(finalDate).getTime();
        this.initElements();
        this.interval = setInterval(this.run.bind(this), 1000);
      } else {
        this.initFail();
      }
    }

    initCountdownInList() {
      const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(\:\d{2}|)(\+|-)\d{4}/;
      const dataList = this.dataset.list.split(',');
      const now = new Date();
      let min;
      dataList.forEach(value => {
        if (pattern.test(value)) {
          let countdownDate = new Date(value);
          if (countdownDate > now) {
            if (!min || countdownDate <= min) {
              min = countdownDate;
            }
          }
        }
      });
      if (min) {
        this.countDownDate = min.getTime();
        this.initElements();
        this.interval = setInterval(this.run.bind(this), 1000);
      } else {
        this.initFail();
      }
    }

    initElements() {
      this.daysElement = this.querySelector('.countdown__days__value');
      this.hoursElement = this.querySelector('.countdown__hours__value');
      this.minutesElement = this.querySelector('.countdown__minutes__value');
      this.secondsElement = this.querySelector('.countdown__seconds__value');
      
      // Run calculation once before showing to ensure proper initial state
      this.runOnce();
    }

    runOnce() {
      const now = new Date().getTime();
      const distance = this.countDownDate - now;
      
      // If countdown is already expired, hide it completely
      if (distance < 0) {
        // Hide the countdown element completely
        if (this.dataset.expiredMsg) {
          this.showMessage(this.dataset.expiredMsg);
        } else {
          this.style.display = 'none';
        }
        clearInterval(this.interval);
        return;
      }
      
      const daysNumber = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hoursNumber = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesNumber = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secondsNumber = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Set initial values before showing
      const daysParent = this.daysElement?.closest('.countdown__days');
      if (daysNumber <= 0) {
        if (daysParent) {
          daysParent.classList.add('hidden');
        } else if (this.daysElement?.parentElement) {
          this.daysElement.parentElement.classList.add('hidden');
        }
      } else if (this.daysElement) {
        this.daysElement.textContent = daysNumber;
      }

      const hoursParent = this.hoursElement?.closest('.countdown__hours');
      if (hoursNumber <= 0 && daysNumber <= 0) {
        if (hoursParent) {
          hoursParent.classList.add('hidden');
        } else if (this.hoursElement?.parentElement) {
          this.hoursElement.parentElement.classList.add('hidden');
        }
      } else if (this.hoursElement) {
        this.hoursElement.textContent = hoursNumber;
      }

      if (this.minutesElement) {
        this.minutesElement.textContent = minutesNumber;
      }
      
      if (this.secondsElement) {
        this.secondsElement.textContent = secondsNumber;
      }
      
      // Show the countdown after initial setup
      this.style.display = '';
    }

    run() {
      const now = new Date().getTime();
      const distance = this.countDownDate - now;
      
      // If countdown is expired, hide it completely and clear interval
      if (distance < 0) {
        clearInterval(this.interval);
        if (this.dataset.expiredMsg) {
          this.showMessage(this.dataset.expiredMsg);
          this.classList.add('expired');
        } else {
          this.style.display = 'none';
        }
        return;
      }
      
      const daysNumber = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hoursNumber = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesNumber = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secondsNumber = Math.floor((distance % (1000 * 60)) / 1000);
      
      const daysParent = this.daysElement?.closest('.countdown__days');
      if (daysNumber <= 0) {
        if (daysParent) {
          daysParent.classList.add('hidden');
        } else {
          this.daysElement.parentElement.classList.add('hidden');
        }
      } else {
        if (daysParent) {
          daysParent.classList.remove('hidden');
        } else {
          this.daysElement.parentElement.classList.remove('hidden');
        }
        this.daysElement.textContent = daysNumber;
      }

      const hoursParent = this.hoursElement?.closest('.countdown__hours');
      if (hoursNumber <= 0 && daysNumber <= 0) {
        if (hoursParent) {
          hoursParent.classList.add('hidden');
        } else {
          this.hoursElement.parentElement.classList.add('hidden');
        }
      } else {
        if (hoursParent) {
          hoursParent.classList.remove('hidden');
        } else {
          this.hoursElement.parentElement.classList.remove('hidden');
        }
        this.hoursElement.textContent = hoursNumber;
      }

      this.minutesElement.textContent = minutesNumber;
      this.secondsElement.textContent = secondsNumber;
    }

    showMessage(msg) {
      this.querySelectorAll(':scope > *').forEach((ele) => ele.remove());
      const node = document.createTextNode(msg);
      this.appendChild(node);
    }

    initFail() {
      if (Shopify.designMode) {
        this.showMessage(window.accessibilityStrings.countdownErrorMsg);
      } else {
        this.remove();
      }
    }
  });
}