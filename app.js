const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
 if (!images.length) {
  errorHandler("No Matching Images Found");
  galleryHeader.style.display = 'none';
 }
 else {
  galleryHeader.style.display = 'flex';
  imagesArea.style.display = 'block';
 }
  gallery.innerHTML = '';
  spinnerToggle();
  SelectedItemCount();
  // show gallery title
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
}

// Get images
const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(() => errorHandler("Something Went wrong!! Please try again"));
}

// Handler error
const  errorHandler = (err) => {
  const errorMessage = document.getElementById('error-message');
  errorMessage.innerText = err;
}

// Select item
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders = sliders.filter(slider => slider !== img);
  }
  SelectedItemCount();
}

// Selected Item Count
const SelectedItemCount = () => {
  const SelectedCount = document.getElementById('Selected-count');
  SelectedCount.innerText = sliders.length;
}

// Create slider
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  const duration = document.getElementById('duration').value || 1000;
  if (duration >= 0) {
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  else{
    alert("Duration can't be a negative number");
    document.getElementById('duration').value = "";
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}
// Toggle spinner
const spinnerToggle = () => {
  const toggleSpinner = document.getElementById('toggle-spinner');
  toggleSpinner.classList.toggle('d-none');
}

// Search button Click event handler
const search = document.getElementById('search');
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  errorHandler("");
  if (!search.value) {
    errorHandler("Please enter a search..");
    galleryHeader.style.display = 'none';
    imagesArea.style.display = 'none';
  }
  else {
    spinnerToggle();
    getImages(search.value);
  }
  search.value = '';
  sliders.length = 0;
})

// Search enter keypress event handler
search.addEventListener("keypress", event => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
})

// Slider button Click event handler
sliderBtn.addEventListener('click', function () {
  createSlider()
})
