  // create variable to index the slides - to track
  var slideIndex = 0;
  // call a function that does something with the slides
showSlides();

function showSlides() {
    // a variable to be used with the for loop
  var i;
    // target the slides in the DOM as slides
  var slides = document.getElementsByClassName("mySlides");
    // loop through the slides showing them one at a time (display)
  for (i = 0; i < slides.length; i++) {
    console.log(`forloop ran with i ${i} slides.length ${slides.length}`);
    slides[i].style.display = "none";  // Make it go away on browser so images doesn't become a scroll down list of images.
  }
    // increment the slides from 0 to the total number of slides (for loop)
  console.log(`slideIndex: ${slideIndex} slides.length: ${slides.length}`);
  slideIndex++;
    // loop back to the beginning
  if (slideIndex > slides.length) {slideIndex = 1}

    // Sets the previous img in the array to be shown in block format.
  slides[slideIndex-1].style.display = "block";
  console.log("This ran");
  setTimeout(showSlides, 2000); // Change image every 2 seconds, call it self recursively
}