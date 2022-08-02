// Client facing scripts here
// const postform = `
// <form id="form">
//   <input type="text" name="text1" value="Brand">
//   <input type="text" name="text2" value="Model">
//   <input type="text" name="text2" value="Price">
//   <button type="submit" id="post-form">Submit</button>
// </form>
// `

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createListing = function(listingObj) {
  // const safeHTMLModel = `<p>${escape(listingObj.model)}`;
  const $listing = `
  <article class="listing">
    <img src="${listingObj.photo_url}>
    <section class="description">
      <span>${listingObj.model}</span>
      <span>$${listingObj.price / 100}</span>
      <span>${listingObj.is_sold}</span>
      <span>${listingObj.time_created}</span>
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


