<html>
<head>
<title>PHP Sending Email</title>
</head>
<body>
<?php
	
    ini_set("SMTP","localhost");
    ini_set("port","25");
	ini_set("sendmail_from","administrator@chulabook.com");


	$strTo = "suban1597@gmail.com";
	$strSubject = "Test Send Email";
	$strHeader = "From: administrator@chulabook.com";
	$strMessage = "My Body & My Description";
	$flgSend = @mail($strTo,$strSubject,$strMessage,$strHeader);  // @ = No Show Error //



	if($flgSend)
	{
		echo "Email Sending.";
	}
	else
	{
		echo "Email Can Not Send.";
	}
?>
</body>
</html>