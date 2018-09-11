
//Delete Request 
$(document).ready(() => {

    // $('.delete-article').on('click', (e) => {
    //     $target = $(e.target);
    //     const id = $target.attr('data-id');
    //     $.ajax(
    //         {
    //             type: 'DELETE',
    //             url: '/articles/' + id,
    //             success: (response) => {
    //             alert('Deleted article');
    //             window.location.href='/';
    //             },
    //             error: (err) =>{
    //                 console.log(err);
    //             }
    //         });
    // });


  

      const messaging = firebase.messaging();

      messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);
        // ...
      });
      

      $('.sendMsg').on('click', (e) => {
        $target = $(e.target);
        const imei = $target.attr('data');
      $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/fcm/send",
        headers : {
            Authorization : 'key=' + 'AIzaSyC84Ff1QvPjUk7arfixaQzZCVUernhvDPY'
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "to": "/topics/"+imei, 
            "priority": "high",
            "data": {
            "message": "Testing"
            }
        }),
        success : function(response) {
            console.log(response);
        },
        error : function(xhr, status, error) {
            console.log(xhr.error);  
            console.log(error);                 
        }
    });
      });



    
});