import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = "32806478-c0afa52000c916a4df313f90b"
const BASE_URL = "https://pixabay.com/api/"

const buttonRef = document.querySelector('button[type="submit"]');
const galerySectionRef = document.getElementById("gallery");
const buttonLoadMore = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');
const form = document.querySelector('#search-form');

const lightbox = new SimpleLightbox('.photo-card a');
let searchQuery = '';
let page = 1;
let perPage = 40;

buttonLoadMore.style.visibility = 'hidden';


function buildUrl() {
  return `${BASE_URL}`+
  `?key=${API_KEY}`+
  `&q=${searchQuery}`+
  `&image_type=photo`+
  `&pretty=true`+
  `&per_page=${perPage}`+
  `&page=${page}`+
  `&orientation=horizontal`+
  `&safesearch=true`
}

function createMarkup(listOfPhotos) {
  return listOfPhotos.map((
    {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }
  ) => {
    return `
    <div class="photo-card">
    <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height='300'  />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`
  });
}

function handlePictureLoading(event) {
  console.log("searchQuery: " + searchQuery)
  console.log("form.elements[0].value: " + form.elements[0].value)
  if (searchQuery !== form.elements[0].value) {
    console.log("Inside if")
    searchQuery = form.elements[0].value;
    galerySectionRef.innerHTML = "";
    buttonLoadMore.style.visibility = 'visible';
    page = 1;
  }

  searchQuery = form.elements[0].value;
  
  event.preventDefault();

  axios.get(buildUrl())
  .then(res => {
    const listOfPhotos = res.data.hits;
    const totalHits = res.data.totalHits
    const markup = createMarkup(listOfPhotos);

    if (galerySectionRef.innerHTML.trim() === "") {
      galerySectionRef.innerHTML = markup.join('');  
    } else {
      galerySectionRef.innerHTML = galerySectionRef.innerHTML + markup.join('');
    }
    
    page++;
    const totalElementsForPage = page * perPage;
    if (totalElementsForPage > totalHits && !listOfPhotos.lenght && totalHits > 0) {
        buttonLoadMore.style.visibility = 'hidden';
        setTimeout(() => {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }, 1000);
      } else if (!listOfPhotos.length) {
        buttonLoadMore.style.visibility = 'hidden';
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        buttonLoadMore.style.visibility = 'visible';
    }
    
    lightbox.refresh()
  })
}


buttonRef.addEventListener("click", (event) => {
  handlePictureLoading(event);
});

buttonLoadMore.addEventListener("click", (event) => {
  handlePictureLoading(event);
});











