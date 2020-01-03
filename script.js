let xInput = document.getElementById('x'),
  yInput = document.getElementById('y'),
  createBtn = document.getElementsByTagName('button')[0],
  radioBtn = document.querySelectorAll('input[type=radio]'),
  radioContainer = document.getElementsByClassName('radio-container')[0],
  colorIcon = document.getElementsByClassName('color')[0],
  slideBtn = document.querySelector('input[type=range]'),
  file = document.getElementById("file"),
  color,
  xValue,
  yValue,
  num,
  array,
  context,
  myElements,
  analyser,
  src,
  height;
 
radioContainer.addEventListener('click', function (event) {
  let target = event.target;
  if (target.tagName === 'INPUT') {
    checkRadioBtn();
  }
});

slideBtn.addEventListener('input', function() {
  color = slideBtn.value * 3.4;
  colorIcon.style.background = `hsl(${color}, 80%, 50%)`;
});

xInput.onkeyup = disableBtn;
yInput.onkeyup = disableBtn;

file.onchange = function () {
  let files = this.files;
  audio.src = URL.createObjectURL(files[0]);
}

createBtn.addEventListener('click', function () {
  xValue = +xInput.value;
  yValue = +yInput.value;

  if (isValidFieldValue(xValue) && isValidFieldValue(yValue)) {
    resetForm([xInput, yInput]);
    drawTable();
    start();
  } else {
    showError();
  }
});

function drawTable() {
  let block = document.getElementById('block');

  block.innerHTML = '';
  num = xValue * yValue;
  block.style.width = xValue * 50 + 'px';
  block.style.height = yValue * 50 + 'px';

  for (let i = 0; i < num; i++) {
    block.innerHTML += '<div class="box"></div>';
  }
}

slideBtn.addEventListener('input', function() {
  color = slideBtn.value * 3.4;
  colorIcon.style.background = `hsl(${color}, 80%, 50%)`;
});

function isValidFieldValue(value) {
  return value && isInteger(value) && value >= 1 && value <= 16;
}

function isInteger(value) {
  return value === parseInt(value);
}

function resetForm(inputs) {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  }
  disableBtn();
}

function showError() {
  alert('Введите целое число от 1 до 16');
}

function checkRadioBtn() {
  let slideContainer = document.getElementsByClassName('slidecontainer')[0];

  if (radioBtn[0].checked) {
    slideContainer.style.opacity = 0;
  } else {
    slideContainer.style.opacity = 1;
    colorChange();
  }
}

function colorChange() {
    color = slideBtn.value * 3.4;
    colorIcon.style.background = `hsl(${color}, 80%, 50%)`;
}

function disableBtn() {
  if (xInput.value.trim() && yInput.value.trim()) {
    createBtn.disabled = false;
    createBtn.classList.remove('disabledCalc');
  } else {
    createBtn.disabled = true;
    createBtn.classList.add('disabledCalc');
  }
}

//--- Vizualizer ---

function start() {
  myElements = document.getElementsByClassName('box');

  if (!context) {
    preparation();
  }
  audio.play();
  loop();
}

function loop() {
  if (!audio.paused) {
    setTimeout(function () {
      window.requestAnimationFrame(loop);
    }, 60);
  }
  colorChange();
  array = new Uint8Array(700);
  analyser.getByteFrequencyData(array);

  for (let i = 0; i < num; i++) {
    height = (array[i * Math.floor(700 / num)]);
    myElements[i].style.background = `hsl(${radioBtn[0].checked ? height * 6 : color}, ${height/2}%, ${height/3}%)`;
  }
}

function preparation() {
  context = new AudioContext();
  analyser = context.createAnalyser();
  src = context.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(context.destination);
  loop();
}