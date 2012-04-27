var imageSource = Array();
var imageIndex = 0;
var geocoder;
var map;
var firstTime = true;
$(document).ready(function() {
	geocoder = new google.maps.Geocoder(); //creats the ability for google to call this later
	$('#input_field').submit(function(){ 
		$('#loading').show();
		showResults();
		getJsonData();
		removeOldContent();
		codeAddress();
		return false;
	});
});

function showResults(){
	$('#content').fadeIn(500);
};

function getJsonData(){
	var searchQuery = $('.input_text').val();
	console.log(searchQuery);
	
	$.getJSON('http://search.twitter.com/search.json?result_type=recent&rpp=20&callback=?&q=%23' + searchQuery,
	function(json){
		console.log(json.results);
		$.each(json.results, function(index, tweets){
			displayTweets(tweets);
		});
	});
	
	$.getJSON('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=816541b11404e131faf6580ee13a86d4&tags='+ searchQuery +'&per_page=5&format=json&nojsoncallback=1',
	function(flickr){
		console.log(flickr.photos.photo);
		$.each(flickr.photos.photo, function(index, photos){
			createPhotoSlideShow(photos);
		});
		addImagesToSlideShow(); //this needs to be here not at the end of the createphotoslideshow function. 
		//http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg	
	});
};


function removeOldContent(){
	$('#returned_tweets').html('');
	$('#flickr_slide_show').html('');
};

function displayTweets(tweets){
	var text = $('<p/>').text(tweets.text);
	var image = $('<img/>').attr('src', tweets.profile_image_url);
	var user = $('<p/>').text(tweets.from_user_name);
	var div = $('<div/>').attr('id', 'returned_tweets').append(image).append(user).append(text);
	$('#tweet_box').prepend(div);
	$('#loading').hide();
	
};

function createPhotoSlideShow(photos){
	var farm = photos.farm;
	var serverId = photos.server;
	var id = photos.id;
	var secret = photos.secret;
	var url = 'http://farm' + farm + '.staticflickr.com/'+ serverId +'/' + id + '_'+ secret +'.jpg';
	
	imageSource.push(url);
	console.log(imageSource);
};

function addImagesToSlideShow(){
	var maxIndex = imageSource.length - 1; //remember, it's always length - 1
	var image = $('<img/>').attr('src', imageSource[imageIndex]).addClass('image_size');
	
	$('#flickr_slide_show').append(image).fadeIn('slow');
	if(imageIndex == maxIndex){
		imageIndex = 0;
	}else{
		imageIndex = imageIndex + 1;
	}
	setTimeout(function(){
		removeImagesFromSlideShow();
	},5000);
};

function removeImagesFromSlideShow(){
	$('#flickr_slide_show').fadeOut('slow', function(){
		$(this).html('');
		addImagesToSlideShow();
	});
};



//http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg











function initializeMap(latlng) {
    
    var myOptions = {
      zoom: 5,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	icon: 'marker_pink.png'
    }
    map = new google.maps.Map(document.getElementById("map_container"), myOptions);
  }

  function codeAddress() {
    var address = $('.input_text').val();
    geocoder.geocode( { 'address': address}, function(results, status) {
	
      if (status == google.maps.GeocoderStatus.OK) {
		if (firstTime == true){ 
			firstTime = false;
			initializeMap(results[0].geometry.location);
			var marker = new google.maps.Marker({
	            map: map, 
	            position: results[0].geometry.location
			});
		}else{
			map.setCenter(results[0].geometry.location);
	            var marker = new google.maps.Marker({
		            map: map, 
		            position: results[0].geometry.location
				});
		}
        
      } else {
        alert("We wern't able to locate that country: " + status);
      }
    });
  }







