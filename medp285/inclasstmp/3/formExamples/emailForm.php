<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Email Form, using PHP5</title>
</head>

<body>

<?php
function spamcheck($field)
  {
  //filter_var() sanitizes the e-mail
  //address using FILTER_SANITIZE_EMAIL
  $field=filter_var($field, FILTER_SANITIZE_EMAIL);

  //filter_var() validates the e-mail
  //address using FILTER_VALIDATE_EMAIL
  if(filter_var($field, FILTER_VALIDATE_EMAIL))
    {
    return TRUE;
    }
  else
    {
    return FALSE;
    }
  }

if (isset($_REQUEST['email']))
  {//if "email" is filled out, proceed

  //check if the email address is invalid
  $mailcheck = spamcheck($_REQUEST['email']);
  if ($mailcheck==FALSE)
    {
    echo "Invalid input";
    }
  else
    {//send email
    $email = $_REQUEST['email'] ;
    $subject = $_REQUEST['subject'] ;
    $message = $_REQUEST['message'] ;
    mail("youremail@emailService.com", "Subject: $subject", $message, "From: $email");
    echo "Thank you for using our mail form";
    }
  }
else
  {//if "email" is not filled out, display the form
  echo "<form method='post' action='emailForm.php'>
  <p>
  Email:<br /> <input name='email' type='text' size='25' maxlength='100' />
  </p>
  <p>
  Subject:<br /> <input name='subject' type='text' size='25' maxlength='100' />
  </p>
  <p>
  Message:<br />
  <textarea name='message' rows='5' cols='35'>
  </textarea><br /><br />
  <input type='submit' />
  </p>
  </form>";
  }
?>

</body>
</html>
