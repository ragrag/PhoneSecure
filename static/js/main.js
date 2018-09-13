
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
      


      function initMap(long,lat) {
        // The location of Uluru
        console.log(long+' + '+ lat);
        var uluru = {lat: lat, lng: long};
        // The map, centered at Uluru
        var map = new google.maps.Map(
            document.getElementById('map'), {zoom: 18  , center: uluru});
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: uluru, map: map});
      }

      function setIntervalX(callback, delay, repetitions) {
        var x = 0;

        //Loading start
        $('.loader').css('display','block');
        var intervalID = window.setInterval(function () {
    
           callback();
    
           if (++x === repetitions) {
               window.clearInterval(intervalID);
               //Loading end
               $('.loader').css('display','none');
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
                console.log(response.success);

               if(response.success)
               {
                initMap(parseFloat(response.data.long),parseFloat(response.data.lat));
                $('#lastSeen').html('last seen : '+moment(response.data.date).fromNow());
                $('#coords').html('long : '+response.data.long +'<br>lat : '+response.data.lat);
                $('#battery').html('battery level : '+response.data.battery +'%');
                $('#phoneNumber').html('Phone number* : '+response.data.phoneNumber);
               }
               else {
                    $('#lastSeen').html('Cant connect');
               }
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