Locations = new Meteor.Collection("locations")


if (Meteor.isClient) {



  Template.myMap.greeting = function () {
    return "Welcome to Maps.";
  };

  Template.myMap.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      // console.log(Session.get("currentSess"))

    }
  });



  Template.myMap.rendered = function(){
    $(document).ready(function(){




              //Set marker from db


      
      var pos = Locations.find({}).fetch();

      $.each(pos, function (i, elem) {
      

        var newLatLng = new google.maps.LatLng(elem.whole.jb, elem.whole.kb);

        var marker = new google.maps.Marker({
            position: newLatLng, 
            map: map, 
            draggable:false,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "http://carmodymoran.ie/wp-content/uploads/2012/01/tick-mark-blue.png",
              scaledSize: {width: 30 + elem.holes, height:30 + elem.holes, widthUnit: "px", heightUnit: "px"}
            }
        });

         google.maps.event.addListener(marker, 'click', function(){
          Session.set("mapID", elem._id)
          marker.setIcon({
            url: "http://carmodymoran.ie/wp-content/uploads/2012/01/tick-mark-blue.png",
              scaledSize: {width: 30, height:30, widthUnit: "px", heightUnit: "px"}
          })
        })

})



        //Grab location from input
       $("#encodeSubmit").click(function(){
        var address = $("#address").val()

                  geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var pointzzz = results[0].geometry.location
        console.log("Important LatLng " + pointzzz)
        console.log(results[0].geometry.location.jb)
        console.log(results[0].geometry.location.kb)
        x = results[0].geometry.location.jb
        y = results[0].geometry.location.kb

        //make sure x&y don't already exist
        if(!Locations.find({x: x, y:y}).count()>0){

        //Insert X&Y coordinates
        Locations.insert({
          whole: results[0].geometry.location,
          x: x,
          y: y,
          holes: 0,
          free: true
        })
        //And plant new marker.

        var marker = new google.maps.Marker({
            position: pointzzz, 
            map: map, 
            draggable:false,
            animation: google.maps.Animation.DROP
        });


      }//end if
      else{
        console.log("Already exists")
      }
      }
      })





    })

  })
}

  Template.render.foo = function(){
    var xar = Session.get("mapID")
    return Locations.find({"_id": xar})


  }

    Template.render.events({
    'click #augment' : function () {
      console.log("Clicked'")
      Locations.update(Session.get("mapID"), {$inc: {holes: 1}})
      //call a function which increases icon size
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
