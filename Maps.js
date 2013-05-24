Locations = new Meteor.Collection("locations")


if (Meteor.isClient) {

var jsMap
var pos = Locations.find({}).fetch()

Template.actualMap.rendered = function(){


var myOptions = {
    zoom: 4,
    minZoom: 4,
    center: new google.maps.LatLng(39.0997265 , -94.57856670000001 ),
    mapTypeId: 'roadmap',
    disableDefaultUI: true
};
jsMap = new google.maps.Map($('#map')[0], myOptions);
console.log(typeof jsMap)
return jsMap
}



  Template.myMap.greeting = function () {
    return "Welcome to Maps.";
  };

  Template.myMap.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      // console.log(Session.get("currentSess"))

    }
  });

  var myMarkers = []
  var height = function(){
    return 40+40
  }
  var width = function(width){
    width = width+=20
    return width
  }
  var mapURL = function(){
    if (mapholes < 10)
      return "/red.png"
    return "/tick-mark-blue.png"
  }
  var mapIcon={
    url: "/tick-mark-blue.png",
    scaledSize: {
      width: width(30),
      height: height(),
      widthUnit: "px",
      heightUnit: "px"}
  }




  var mapIcon2={
        url: "/tick-mark-blue.png",
    scaledSize: {width: 30, height:30, widthUnit: "px", heightUnit: "px"}
  }

  Template.myMap.rendered = function(){
    $(document).ready(function(){


              //Set marker from db

      var geocoder = new google.maps.Geocoder()
      var pos = Locations.find({}).fetch();
      var iconObj = function(){
        if(elem.holes > 20)
          return "/red.png"
        return "/tick-mark-blue.png"
      }

      $.each(pos, function (i, elem) {
      

        var newLatLng = new google.maps.LatLng(elem.whole.jb, elem.whole.kb);

        var marker = new google.maps.Marker({
            position: newLatLng, 
            map: jsMap,
            draggable: false,
            animation: google.maps.Animation.DROP,
            icon: {
              url:       function(){
        if(elem.holes > 20)
          return "/red.png"
        return "/tick-mark-blue.png"
      }(),
              scaledSize: {width: 30 + elem.holes, height:30 + elem.holes, widthUnit: "px", heightUnit: "px"}
            },
            id: i 
        });

        console.log(elem.holes)

         google.maps.event.addListener(marker, 'click', function(){
          Session.set("mapID", elem._id)



          
          console.log("Listener")


          })
         google.maps.event.addListener(marker, 'dblclick', function(){
          console.log("DOUBLE CLICK")
                 var self = this 
            resize = function(){
              self.setIcon(mapIcon)
              console.log("SECRET DOUBLE CLICK FUNCTION")
          }
         })

          myMarkers.push(marker)

})



        //Grab location from input
       $("#encodeSubmit").click(function(){
        var address = $("#address").val()

                  geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        jsMap.setCenter(results[0].geometry.location);
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
            map: jsMap, 
            draggable:false,
            animation: google.maps.Animation.DROP
        });


      }//end if
      else{
        (function(){
          console.log("Already exists")
          $("#alertArea").append("<div class='alert alert-error'>Already Exists</div>")
            setTimeout(function(){
              $('#alertArea').empty()},1000)
          })()
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
      

      currentMarker = myMarkers[2]

      
     google.maps.event.trigger(currentMarker, 'dblclick', resize());
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
