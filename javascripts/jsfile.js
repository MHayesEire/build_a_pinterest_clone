//alert("connected");
/////////

$(document).ready(function() {
    //alert("JQ connected");

$("img").each(function() {
    if (this.complete) { // check on loaded
        verImg(this);
} else {
    $(this).load(function() {
        verImg(this);
    }).error(function() {
        // change to placeholder image.
        this.src = "http://dummyimage.com/180x180/292929/e3e3e3&text=Not Available";
    });

}
});

var $container = $('#masonry');
$container.imagesLoaded( function(){
 $container.masonry({
itemSelector : '.item'
 });
 });


$(".ddmenu").toggle();
hideshowdd();
});
    // check if image is not present
function verImg(img) {
        if (img.naturalHeight <= 1 && img.naturalWidth <= 1) {
            img.src = "http://dummyimage.com/180x180/292929/e3e3e3&text=Not Available";
        }
    }

function hideshowdd (){
    $('#ddmenu').click(function() {
       $(".ddmenu").toggle();
       
    });
}