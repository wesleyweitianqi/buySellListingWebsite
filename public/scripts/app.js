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
        <span class="listing_text">${listingObj.model}</span>
        <span class="listing_text">$${listingObj.price / 100}</span>
        <span class="listing_text">${listingObj.is_sold}</span>
        <span class="listing_text">${listingObj.time_created.slice(0, -2)}</span>
      <div>
    </section>
  </article>
  `;
  return $listing;
};

$(document).ready(function() {
  $.ajax({
    url:'/listings/api',
    method:'GET',
    success: function(data) {
      for (let i of data) {
        $('.listing_container').append(createListing(i));
      }
    }
  })
});
//   // $.ajax({
//   //   url: '/user/post',
//   //   method: 'GET',
//   //   success: function() {
//   //     $('.form').append(postform);
//   //   }
//   // })
//   const $postform = $('#form');
//   console.log($postform);
//   $postform.on('submit', function(event) {
//     event.preventDefault();
//     const input = $(this).serializeArray();
//     console.log(input);
//     $.ajax({
//       url: '/user/post',
//       method:'POST',
//       data: input,
//       success: function() {

//         $.ajax({
//           url: '/user/post',
//           method:'GET',
//           data:'json',
//           success: function(data) {
//             console.log('post:',data);
//             $('.post-container').append(data);
//           }
//         })
//       }
//     })
//   })
// });


