// Client facing scripts here


const createListing = function(data) {
  const $listing = `
  <form class="listing" id="${data.id}">
    <img class="listing_photo" src="${data.photo_url}">
    <section class= "list_details">
      <div class="brand_model">
        <span class="brand">${data.brand}</span>
        <span class="model">${data.model}</span>
      </div>
        <span class="description">${data.description}</span>
      <div class="price_sold">
        <div class="price">$${data.price}</div>
        <span class= ${data.is_sold === "True" ? "listing_text" : "listing_text_sale"}>${data.is_sold === "True" ? "sold" : "for sale"}</span>
        <button value="${data.id}" ><i class="fa-regular fa-heart"></i></button>
        <button type="button" data-id=${data.id} class="remove ${data.id}" >Remove</button>
        <a class="email_button"  href="mailto:${data.email}">Contact Seller</a>
      </div>
    </section>
  </form>
  `;
  return $listing;
};

const appendListing = function (data) {
  for (let listing of data) {
    $(".listing_container").append(createListing(listing))
  }
};

const postListing = function(data) {
  for (let listing of data) {
    $(".myListing_container").append(createListing(listing))
  }
};

const searchListing = function(data = []) {
  for (let listing of data) {
    $('.search_container').append(createListing(listing));
  }
};

const favouriteListing = function(data) {
  for (let listing of data) {
    $(".favourite_container").prepend(createListing(listing));
  }
};

$(document).ready(function () {

  //show all listings to public
  $.ajax({
    url: "/api/listings",
    method: "GET",
    success: function (data) {
      appendListing(data);
    },
  });

  $.ajax({
    url:'/api/listings/me',
    method:'GET',
    success: function(data) {
      console.log(data);
      postListing(data);
    }
  })

// show all post by user_id
  const $form = $('#post_form');
  $form.submit(function(event) {
    const input = $(this).serializeArray();
    event.preventDefault();
    $.ajax({
      url: "/listings/new",
      method: "POST",
      data: input,
      success: function (data) {
        console.log(data)
        $('.myListing_container').empty();
        $(".myListing_container").append(postListing(data))

      }
    });
  })


// search form submision
  const $searchform = $('.search_form');
  $searchform.submit(function(event) {
    event.preventDefault();
    const input = $(this).serializeArray()//.map(function(x){formdata[x.name] = x.value;});
    $.ajax({
      url: '/api/listings/search',
      method: 'POST',
      data: input,
      success: function(data) {
        $('.search_container').empty();
        searchListing(data);
      }
    });
  });

  const $dataId = $('data-id');
  const $listing_container = $('.myListing_container')
  console.log($listing_container);
  $listing_container.on('click', '.remove', function(event) {
    event.preventDefault();
    const listing_id = $(this).attr('data-id');
    $.ajax({
      type: 'POST',
      url: `/listings/remove/${listing_id}`,
      data: {listing_id },
      success: function() {
        $listing_container.empty();
        $.ajax({
          url:'/api/listings/me',
          method:'GET',
          success: function(data) {
            postListing(data);
          }
        })
      }
    })
  })

});
