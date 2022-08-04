// Client facing scripts here

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createListing = function (listingObj) {
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
        <button type="button" class="favourite_button btn btn-info" style="background: none; border: none; box-shadow: none;" value="${listingObj.id}"><i class="fa-regular fa-heart"></i></button>
      </div>
    </section>
  </article>
  `;
  return $listing;
};

const createEmailButton = function (userObj) {
  const $emailButton = `
  <a class="email_button" style="display: flex; align-self: center; justify-content: center;" href="mailto:${userObj.email}">
    <button type="submit" class="btn btn-secondary">Contact Seller</button>
  </a>
  `;
  return $emailButton;
};

const createDeleteButton = function (listingObj) {
  console.log("listingObj:", listingObj);
  const $deleteButton = `
  <form action="/delete" method="POST" style="display: flex; justify-content: center; align-items: center; margin-bottom: 1em; margin-top: 1em;">
    <button type="submit" class="delete_button btn btn-danger" value="${listingObj.id}" style="display: flex;">Remove</button>
  </form>
  `;
  return $deleteButton;
}

const appendListing = function (listingArray) {
  for (let listing of listingArray) {
    $(".listing_container").append(createListing(listing)).append(createEmailButton(listing));
  }
};

const postListing = function (listingArray) {
  for (let listing of listingArray) {
    $(".post-container").append(createListing(listing)).append(createDeleteButton(listing));
  }
};

const othersListing = function (listingArray) {
  for (let listing of listingArray) {
    $(".others_container").append(createListing(listing));
  }
};

const searchListing = function(listingArray = []) {
  for (let listing of listingArray) {
    $('.search_container').append(createListing(listing));
  }
};

const favouriteListing = function (listingArray) {
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
};

$(document).ready(function () {
  appendData();

  setTimeout(function() {
    $(".favourite_button").on("click", function (e) {
      e.preventDefault();
      $.ajax({
        url: "/api/listings/favourite",
        method: "POST",
        data: {listing_id: $(this).val()},
        success: function (data) {
        },
      });
    });
  }, 250);

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

  setTimeout(function() {
    $(".delete_button").on('click', function (e) {
      e.preventDefault();
      $.ajax({
        url: '/delete',
        method: "POST",
        data: {listing_id: $(this).val()},
        success: function (data) {
          console.log(data);
        }
      });
    });
  }, 250);

  const $searchform = $('.search_form');
  $searchform.submit(function(event) {
    event.preventDefault();
    const input = $(this).serializeArray()//.map(function(x){formdata[x.name] = x.value;});
    $.ajax({
      url: '/api/listings/search',
      method: 'POST',
      data: input,
      success: function(data) {
        searchListing(data);
      }
    });
  });
});
