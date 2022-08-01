// Client facing scripts here
// const postform = `
// <form id="form">
//   <input type="text" name="text1" value="Brand">
//   <input type="text" name="text2" value="Model">
//   <input type="text" name="text2" value="Price">
//   <button type="submit" id="post-form">Submit</button>
// </form>
// `

$(document).ready(function() {
  // $.ajax({
  //   url: '/user/post',
  //   method: 'GET',
  //   success: function() {
  //     $('.form').append(postform);
  //   }
  // })
  const $postform = $('#form');
  console.log($postform);
  $postform.on('submit', function(event) {
    event.preventDefault();
    const input = $(this).serializeArray();
    console.log(input);
    $.ajax({
      url: '/user/post',
      method:'POST',
      data: input,
      success: function() {

        $.ajax({
          url: '/user/post',
          method:'GET',
          data:'json',
          success: function(data) {
            console.log('post:',data);
            $('.post-container').append(data);
          }
        })
      }
    })
  })
})
