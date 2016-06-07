<?php
unset($_SESSION['access_token']);
unset($_SESSION['user']);
if (isset($_COOKIE["PHPSESSID"])) {
    setcookie("PHPSESSID", '', time() - 1800, '/');
}
header( 'location: '. './index.html' );
