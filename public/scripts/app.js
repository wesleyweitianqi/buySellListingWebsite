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
    <section class="description">
      <div>
        <span class="listing_text">${escape(listingObj.brand.toUpperCase())}</span>
        <span class="listing_text">${escape(listingObj.model)}</span>
        <div class="listing_text">$${listingObj.price.toLocaleString('en-US')}</div>
        <span class= ${listingObj.is_sold ? "listing_text_sale": "listing_text"}>${listingObj.is_sold ? "on sale":"sold"}</span>
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
    $('.post-container').prepend(createListing(listing));
  }
};

const othersListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.others_container').prepend(createListing(listing));
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
    url:`/api/listings/others/${$('#other_user_id').text()}`,
    method:'GET',
    success: function(data) {
      othersListing(data);
    }
  });


 $('#form').submit((event) => {
  event.preventDefault();
  const formdata = {};
  $("#form").serializeArray().map(function(x){formdata[x.name] = x.value;});
  console.log(formdata);
    $.ajax({
      url: '/api/listings',
      method: 'POST',
      data:formdata,
      success: function() {
        $.get('/api/listings/me', function(data) {
          $('.post-container').prepend(createListing(data[0]));
        })
      }
    });
  });
});

