<?php
//the fuction isset checks to see of a variable has been filled or set
//in php variables are signified by the $
//_POST tells the script that data is coming from a form
//'submit' refers to an object that has the name submit - the button
//if the variable in the submit button has been set do the following
if(isset($_POST['submit'])) {
  //echo is a string function that outputs or prints a string text
  echo 'Hello ' . $_POST['yourname'];
}
?>
