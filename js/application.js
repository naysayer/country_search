var imageSource = Array();
var imageIndex = 0;
var geocoder;
var map;
var firstTime = true;
var sliderTimer = '';
var image = '';
var searchQuery = '';
/**
 * On clicking of a button, it this runs several functions
 * @returns {boolean}
 */
$(document).ready(function() {
	geocoder = new google.maps.Geocoder(); //creats the ability for google to call this later
	$('#input_field').submit(function(){ 
		$('#loading').show();
		checkDatabase();
		return false;
	});
});
function checkDatabase(){
	searchQuery = $('.input_text').val();
	console.log(searchQuery);
	$.ajax({
	  url: 'countries.php?country='+ searchQuery,
	  type: "get",
	  dataType: "html",
		
  success: function(data) {
	console.log(data);
	if(data == 'success'){
		showResults();
		removeOldContent();
		getJsonData();
		codeAddress();
	}else{
		alert('We were not able to locate that country.');
	};
	    //called when successful
 },
	
  error: function() {
	alert('We could not located that country');
	    //called when there is an error
  },
	});
	
};


/**
 *when ran, this displays a div with content in reference to the user's request. 
*/
function showResults(){
	$('#content').fadeIn(500);
};
/**
 * Grabs user's input, and sends that to twitter, and flickr for respoce
 * @param {Object} Twitter returns 20 tweets per search, flickr returns 5 public photos
*/
function getJsonData(){
 	
	
	$.getJSON('http://search.twitter.com/search.json?result_type=recent&rpp=20&callback=?&q=%23' + searchQuery,
	function(json){
		$.each(json.results, function(index, tweets){
			displayTweets(tweets);
		});
	});
	$.getJSON('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=816541b11404e131faf6580ee13a86d4&tags='+ searchQuery +'&per_page=5&format=json&nojsoncallback=1',
	function(flickr){
		$.each(flickr.photos.photo, function(index, photos){
			createPhotoSlideShow(photos);
		});
		addImagesToSlideShow(); //this needs to be here not at the end of the createphotoslideshow function. 
		//http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg	
	});
};
/**
 * removes old content to clear way for a second, 3rd search, ect...
 * @param {Array} imageSource is emptied out, new data is added in getJsonData
 */
function removeOldContent(){
	$('#returned_tweets').html('');
	$('#flickr_slide_show').html('');
	clearTimeout(sliderTimer);
	imageSource = [];
};
/**
 * takes the object returned by twitter, and prepends it to the dom. 
*/
function displayTweets(tweets){
	var text = $('<p/>').text(tweets.text);
	var image = $('<img/>').attr('src', tweets.profile_image_url);
	var user = $('<p/>').text(tweets.from_user_name);
	var div = $('<div/>').attr('id', 'returned_tweets').append(image).append(user).append(text);
	$('#tweet_box').prepend(div);
	$('#loading').hide();
};
/**
 * takes the object returned by flickr, and pushes the url's for the photo's into an array called imageSource. 
*/
function createPhotoSlideShow(photos){
	var farm = photos.farm;
	var serverId = photos.server;
	var id = photos.id;
	var secret = photos.secret;
	var url = 'http://farm' + farm + '.staticflickr.com/'+ serverId +'/' + id + '_'+ secret +'.jpg';
	
	imageSource.push(url);
};
/**
 * Takes the variable image, and creates a slide show with it, where images fade into the dom.  
*/
function addImagesToSlideShow(){
	var maxIndex = imageSource.length - 1; //remember, it's always length - 1
	image = $('<img/>').attr('src', imageSource[imageIndex]).addClass('image_size');
	
	$('#flickr_slide_show').append(image).fadeIn('slow');
	if(imageIndex == maxIndex){
		imageIndex = 0;
	}else{
		imageIndex = imageIndex + 1;
	}
	sliderTimer = setTimeout(function(){
		removeImagesFromSlideShow();
	},5000);
};
/**
 * makes images fade out of the dom, and then calls back on addImagesToSlideShow.  
*/
function removeImagesFromSlideShow(){
	$('#flickr_slide_show').fadeOut('slow', function(){
		$(this).html('');
		addImagesToSlideShow();
	});
};
/**
 * Sets the peramators for the map that will be generated.
 * @returns information that codeAddress then uses to turn into a map
*/
function initializeMap(latlng) {
    var myOptions = {
      zoom: 5,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	icon: 'marker_pink.png'
    }
    map = new google.maps.Map(document.getElementById("map_container"), myOptions);
}
/**
 * takes the text from the user, and geocodes the address, as well as the map,
on the frist search it generates the map, for all other searches it just geocodes the address and marks it on the map. 
 * @returns returns a map to the user. 
*/
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