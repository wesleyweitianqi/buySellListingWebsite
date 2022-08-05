// Client facing scripts here

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createListing = function(listingObj) {
  const $listing = `
  <form class="listing" id="${listingObj.id}">
    <img class="listing_photo" src="${listingObj.photo_url}">
    <section>
      <div class="description">
        <span class="listing_text">${escape(listingObj.brand.toUpperCase())}</span>
        <span class="listing_text">${escape(listingObj.model)}</span>
        <span class="listing_text">${escape(listingObj.description)}</span>
        <div class="listing_text">$${listingObj.price.toLocaleString('en-US')}</div>
        <span class= ${listingObj.is_sold ? "listing_text_sale": "listing_text"}>${listingObj.is_sold ? "on sale":"sold"}</span>
        <button type="button" class="favourite_button btn btn-info" style="background: none; border: none; box-shadow: none;" value="${listingObj.id}"><i class="fa-regular fa-heart"></i></button>
      </div>
    </section>
  </form>
  `;
  return $listing;
};

const emailButton = `
<a href="mailto:<%= email %>">
  <button type="submit" class="email_button btn btn-secondary" style="width: 40%; display: flex; align-self: center; justify-content: center;">Contact Seller</button>
</a>
`;

const appendListing = function (listingArray) {
  for (let listing of listingArray) {
    $(".listing_container").append(createListing(listing)).append(emailButton);
  }
};

const postListing = function(listingArray) {
  for (let listing of listingArray) {
    $(".post-container").append(createListing(listing));
  }
};

const othersListing = function(listingArray) {
  for (let listing of listingArray) {
    $(".others_container").append(createListing(listing));
  }
};

const searchListing = function(listingArray = []) {
  for (let listing of listingArray) {
    $('.search_container').append(createListing(listing));
  }
};

const favouriteListing = function(listingArray) {
  for (let listing of listingArray) {
    $(".favourite_container").prepend(createListing(listing));
  }
};

function appendData() {
  $.ajax({
    url: "/api/listings",
    method: "GET",
    success: function (data) {
      appendListing(data);
    },
  });
}

$(document).ready(function () {
  appendData();

  setTimeout(function(){
    $(".favourite_button").on("click", function (e) {
      e.preventDefault();
      $.ajax({
        url: "/api/listings/favourite",
        method: "POST",
        data: {listing_id: $(this).val()},
        success: function (data) {
          console.log(data);
        },
      });
    });
  }, 1000),

  $.ajax({
    url: "/api/listings/me",
    method: "GET",
    success: function (data) {
      postListing(data);
    },
  });

  $.ajax({
    url: "/api/listings/favourite",
    method: "GET",
    success: function (data) {
      favouriteListing(data);
    },
  });

  const $searchform = $('.search_form');
  $searchform.submit(function(event) {
    event.preventDefault();
    const input = $(this).serializeArray()//.map(function(x){formdata[x.name] = x.value;});
    $.ajax({
      url: '/api/listings/search',
      method: 'POST',
      data: input,
      success: function(data) {
        console.log(data);
        searchListing(data);
      }
    });
  });
});
