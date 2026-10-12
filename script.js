"use strict";
 
const incrementBtnEls = document.querySelectorAll(".pomodoro-app-settings-btn-increment");
const decrementBtnEls = document.querySelectorAll(".pomodoro-app-settings-btn-decrement");
const numberInputsEls = document.querySelectorAll('input[type="number"]');
const settingsModalEl = document.querySelector(".pomodoro-app-settings");
const pomodoroAppEl = document.querySelector(".pomodoro-app");
const openSettingsModalBtnEl = document.querySelector(".pomodoro-app-settings-btn");
const closeSettingsModalBtnEl = document.querySelector(".pomodoro-app-settings-close-btn");
const fontRadioBtnsEls = document.querySelectorAll('.pomodoro-app-settings-font input[type="radio"]');
const pomodoroAppCta = document.querySelector(".pomodoro-app-cta");
const pomodoroAppWrapper = document.querySelector(".pomodoro-app-timer");
const pomodoroAppCtaBtns = document.querySelectorAll(".pomodoro-app-cta-button");
const colorRadioBtnsEls = document.querySelectorAll('.pomodoro-app-settings-color input[type="radio"]')
const pomodoroAppTime = document.querySelector(".pomodoro-app-time");
const submitBtnEl = document.querySelector(".pomodoro-app-submit-btn") 
const pomodoroAppControls = document.querySelector(".pomodoro-app-controls")
const progressBarEl = document.querySelector(".progress-ring__circle");
const titleTag = document.querySelector("title");
const audio = new Audio('pomodoro-timer-end.wav');

fontRadioBtnsEls[0].checked = true;
let hasThisFont = "kumbh"
let hasThisColor = "red";
let hasThisTime;
let timerId
let totalTime;
let overlay;
let numberInputElValue;

pomodoroAppCta.classList.add("ff-kumbh")
pomodoroAppCtaBtns[0].classList.add("bg-red")
pomodoroAppWrapper.classList.add("progress-bar-red")
pomodoroAppWrapper.classList.add("ff-kumbh")
pomodoroAppControls.classList.add("color-red")

function closeModal() {
  settingsModalEl.classList.remove("active");
  pomodoroAppEl.classList.remove("overlay");
}

document.addEventListener('click', function(e) {
  if(e.target.classList.contains('overlay')) {
    closeModal();
  }
})

pomodoroAppCtaBtns.forEach((item,index) => {
  hasThisTime =  numberInputsEls[0].value
  hasThisTime = hasThisTime * 60;
  formattext();

  item.addEventListener('click', function(){
    clearInterval(timerId)
    pomodoroAppControls.innerHTML = "Start";
    hasThisTime =  numberInputsEls[index].value
    hasThisTime = hasThisTime * 60;
    totalTime = hasThisTime;
    formattext();   
    progressBarEl.style.strokeDashoffset =  0; 
  })
})

incrementBtnEls.forEach((incrementBtnEl, incrementBtnElIndex) => {
  incrementBtnEl.addEventListener("click", function () {
    const temp = numberInputsEls[incrementBtnElIndex];
    temp.stepUp();
  });
});

decrementBtnEls.forEach((decrementBtnEl, decrementBtnElIndex) => {
  decrementBtnEl.addEventListener("click", function () {
    const temp = numberInputsEls[decrementBtnElIndex];
    temp.stepDown();
  });
});

openSettingsModalBtnEl.addEventListener("click", function () {
  settingsModalEl.classList.toggle("active");
  pomodoroAppEl.classList.toggle("overlay");
});

closeSettingsModalBtnEl.addEventListener("click", function() {
  settingsModalEl.classList.remove("active");
  pomodoroAppEl.classList.remove("overlay");
})

fontRadioBtnsEls.forEach((fontBtn) => {
  fontBtn.addEventListener('click', function() {
    let inputElValue  =  fontBtn.value === "kumbh" ? "kumbh" : fontBtn.value === "roboto" ? "roboto" : fontBtn.value === "mono" ? "mono" : "Invalid";
    pomodoroAppCta.classList.remove(`ff-${hasThisFont}`)
    pomodoroAppWrapper.classList.remove(`ff-${hasThisFont}`)
    pomodoroAppCta.classList.add(`ff-${inputElValue}`)
    pomodoroAppWrapper.classList.add(`ff-${inputElValue}`)
    hasThisFont = inputElValue
  })
})

colorRadioBtnsEls.forEach((colorBtn) => {
  let colorValue = colorBtn.value == "red" ? "red" : colorBtn.value == "cyan" ? "cyan" : colorBtn.value == "purple" ? "purple" : "Invalid";

  colorBtn.addEventListener('click', function() {
    pomodoroAppWrapper.classList.remove(`progress-bar-${hasThisColor}`)
    pomodoroAppWrapper.classList.add(`progress-bar-${colorValue}`)
    pomodoroAppControls.classList.remove(`color-${hasThisColor}`)
    pomodoroAppControls.classList.add(`color-${colorValue}`)

    pomodoroAppCtaBtns.forEach((pomodoroAppCtaBtn) => {  
      if(pomodoroAppCtaBtn.classList.contains('active')) {
        pomodoroAppCtaBtn.classList.remove(`bg-${hasThisColor}`)
        pomodoroAppCtaBtn.classList.add(`bg-${colorValue}`)
        hasThisColor = colorValue
      }
   })
  })
})

pomodoroAppCtaBtns.forEach((btnEl) => {
  btnEl.addEventListener('click', function(){
    pomodoroAppCtaBtns.forEach((item) => {
      item.classList.remove('active')
      item.classList.remove(`bg-${hasThisColor}`)
    })

    btnEl.classList.add('active')
    btnEl.classList.add(`bg-${hasThisColor}`)
  })
})

submitBtnEl.addEventListener('click', function(){
  settingsModalEl.classList.remove("active");
  pomodoroAppEl.classList.remove("overlay");
  clearInterval(timerId)

  pomodoroAppCtaBtns.forEach((item,index) =>  {
    numberInputElValue = numberInputsEls[index].value;

    if(item.classList.contains('active')) {
      hasThisTime =  numberInputElValue;
      hasThisTime = hasThisTime * 60;
      totalTime = hasThisTime;
      pomodoroAppControls.innerHTML = "Pause";
      timerId = setInterval(startCountDownTick, 1000);
      formattext();
    }
  })
})

function formattext() {
  let minutes = Math.floor(hasThisTime / 60);  
  let seconds = hasThisTime % 60;        
  minutes = minutes.toString().padStart(2,'0');
  seconds = seconds.toString().padStart(2,'0');
  pomodoroAppTime.textContent = `${minutes}:${seconds}`;
  titleTag.textContent = `${minutes}:${seconds}`;
}

function progressbar() {
  let circumference = 2 * Math.PI * 56; // 351.68
  progressBarEl.style.strokeDasharray = circumference;
  let progressRatio = hasThisTime / totalTime;
  progressRatio = progressRatio * circumference //for visible line 
  progressRatio = circumference - progressRatio   //to hide the rest of cicrcle except for visle line
  progressBarEl.style.strokeDashoffset =  progressRatio;
}   

function startCountDownTick() {
  if(hasThisTime === 0 ) {
    clearInterval(timerId);
    pomodoroAppCtaBtns.forEach((item,index) =>  {
      numberInputElValue = numberInputsEls[index].value;

      if(item.classList.contains('active')) {
        hasThisTime =  numberInputElValue;
        hasThisTime = hasThisTime * 60;
        totalTime = hasThisTime;
        formattext();
        progressBarEl.style.strokeDashoffset =  0;
        pomodoroAppControls.innerHTML = "Start"
      }
    })

    audio.play()

  } else {
    hasThisTime--
    formattext()
    progressbar()
  }
}

pomodoroAppControls.addEventListener('click', function(){
  if(pomodoroAppControls.innerHTML === "Pause") {
    pomodoroAppControls.innerHTML = "Start"
    clearInterval(timerId);
  } else {
    pomodoroAppControls.innerHTML = "Pause";
    clearInterval(timerId);
    timerId = setInterval(startCountDownTick, 1000);
  }
})