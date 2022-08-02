//loops through listings, calls creatListingElement for each listi, takes return value and appends it to the listings container
const renderListing = function (listings) {
  $('.listing_container').empty();
  for (let listing of listings) {
    $('.listing_container').append(createListingElement(listing));
  }
}

const createListingElement = function (listing) {
  let $listing = $(`
    <div class="list-info-image">
      <div class="list-info">
      <h2 class="list-head"> ${escape(listing.brand)} ${escape(listing.model)} ${(listing.year)} </h2>
        <p class="list-description"> ${escape(listing.description)} </p>
      <h3 class="list-price"> $${escape(listing.price)} </h3>
      </div>
      <img src= "${escape(listing.photo_url)}" class="list-image">
    </div>
  `);
  return $listing;
};

$(document).ready(function () {
  const loadLists = function () {
    $.ajax('/api/listings', { method: 'GET' })
      .then((result) => {
        renderListing(result.listings);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  loadLists();
});