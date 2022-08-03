// Client facing scripts here

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createListing = function(listingObj) {
  const $listing = `
  <article class="listing">
    <img class="listing_photo" src="${listingObj.photo_url}>
    <section class="description">
      <div>
        <span class="listing_text">${listingObj.brand}</span>
        <span class="listing_text">${listingObj.model}</span>
        <span class="listing_text">$${listingObj.price / 100}</span>
        <span class="listing_text">${listingObj.is_sold}</span>
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

const postlisting = function(listingArray) {
  for (let listing of listingArray) {
    $('.post-container').append(createListing(listing));
  }
};

$(document).ready(function() {
  $.ajax({
    url:'/listings/api',
    method:'GET',
    success: function(data) {
      appendListing(data);
    }
  });
 const postListing = $('.post-container');
 const inputArray = postListing.serializeArray();
 postListing.submit((event) => {
  event.preventDefault();
    $.ajax({
      url: '/:user_id',
      method: 'post',
      data: inputArray,
      success: function(data) {
        console.log(data);
        $.get('/:user_id', function() {
          const $new = $('<h1>ok</h>')
          $('.post-container').append($new);
        })
      }
    });
  });
});


