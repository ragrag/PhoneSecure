
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
      

      function setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = window.setInterval(function () {
    
           callback();
    
           if (++x === repetitions) {
               window.clearInterval(intervalID);
           }
        }, delay);
    }
      function getCoordinates(id)
      {
          console.log('Called');
        $.ajax({        
            type : 'POST',
            url : "/api//getlocation",
            data:{
                id:id
            },
            success : function(response) {
               // console.log(response);
                $('#lastSeen').html('last seen : '+moment(response.data.date).fromNow());
                $('#coords').html('long : '+response.data.long +'<br>lat : '+response.data.lat);
                $('#battery').html('battery level : '+response.data.battery +'%');

            },
            error : function(err) {
                console.log(err);               
            }
        });


      }

      $('.sendMsg').on('click', (e) => {
        $target = $(e.target);
        const imei = $target.attr('data');
        const id = $target.attr('dataid');
      $.ajax({        
        type : 'POST',
        url : "/api/requestlocation",
        data:{
            imei:imei
        },
        success : function(response) {
            //console.log(response);
            setIntervalX(()=>{
                getCoordinates(id);
            }, 5000, 5);
        },
        error : function(err) {
            console.log(err);               
        }
    });
      });



    
});