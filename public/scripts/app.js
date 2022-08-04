// Client facing scripts here

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createListing = function(listingObj) {
  const $listing = `
  <article class="listing">
    <img class="listing_photo" src="${listingObj.photo_url}">
    <section>
      <div class="description">
      <span class="listing_text">${escape(listingObj.brand.toUpperCase())}</span>
        <span class="listing_text">${escape(listingObj.model)}</span>
        <span class="listing_text">${escape(listingObj.description)}</span>
        <div class="listing_text">$${listingObj.price.toLocaleString('en-US')}</div>
        <span class= ${listingObj.is_sold ? "listing_text_sale": "listing_text"}>${listingObj.is_sold ? "on sale":"sold"}</span>
        <button method="POST" action="/delete" type="button" class="btn btn-info"><i class="fa-regular fa-heart"></i></button>
      <div>
    </section>
  </article>
  `;
  return $listing;
};

const appendListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.listing_container').append(createListing(listing));
  }
};

const postListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.post-container').append(createListing(listing));
  }
};

const othersListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.others_container').append(createListing(listing));
  }
};

const searchListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.search_container').append(createListing(listing));
  }
};

const favouriteListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.favourite_container').prepend(createListing(listing));
  }
};


$(document).ready(function() {
  $.ajax({
    url:'/api/listings',
    method:'GET',
    success: function(data) {
      appendListing(data);
    }
  });

  $.ajax({
    url:'/api/listings/me',
    method:'GET',
    success: function(data) {
      postListing(data);
    }
  });

  $.ajax({
    url: '/api/listings/favourite',
    method: 'GET',
    success: function(data) {
      favouriteListing(data);
    }
  })

  $.ajax({
    url: '/search/api',
    method:'GET',
    success: function(data) {
      $('.search_container').val('');
      searchListing(data);
    }
  })
// })
  // const $searchform = $('.search_form');
  // $searchform.submit(function(event) {
  //   event.preventDefault();
  //   const input = $(this).serializeArray()//.map(function(x){formdata[x.name] = x.value;});
  //   // console.log('input:',input);
  //   console.log('----------------------------------------')
  // $.ajax({
  //   url: '/api/listings/search',
  //   method: 'GET',
  //   success: function(data) {
  //     $('.search_container').val('');
  //     searchListing(data);
  //   }
  // });
  // });
});
