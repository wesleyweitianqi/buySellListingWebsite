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
        <span class="listing_text">${escape(listingObj.brand)}</span>
        <span class="listing_text">${escape(listingObj.model)}</span>
        <span class="listing_text">${escape(listingObj.description)}</span>
        <span class="listing_text">$${listingObj.price}</span>
        <button type="submit" class="favourite_button btn btn-secondary">Add to Favourites</button>
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

const filterListing = function(listingArray) {
  for (let listing of listingArray) {
    $('.filter_container').append(createListing(listing));
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


  // $.ajax({
  //   url: `/api/listings/others/${$('#other_user_id').text()}`,
  //   method:'GET',
  //   success: function(data) {
  //     othersListing(data);
  //   }
  // });

  $.ajax({
    url: '/api/listings/search',
    method: 'GET',
    success: function(data) {
      filterListing(data);
    }
  })


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

