<?php

//ini_set( 'display_errors', 1 );

session_start();

require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

$f = $_GET['f'];
$callback = $_GET['callback'];
$user = $_SESSION['user'];
$user_id = $_SESSION['user_id'];
echo $callback;

function getData() {
  global $user_id;

  // セッションチェック
  $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
  $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
  $crypt_id = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, KEY, $_SESSION['user']->id_str, MCRYPT_MODE_ECB, $iv);
  if ($crypt_id != $user_id) return -1;

  // db接続
  try {
  $dbh = new PDO('mysql:host=localhost;dbname=progressManagement;charset=utf8',SQL_USER, PASS,
  array(PDO::ATTR_EMULATE_PREPARES => false));
  } catch (PDOException $e) {
   exit('データベース接続失敗。'.$e->getMessage());
  }

  $sql = 'select data from task_data where id = "'.$_SESSION['user']->id_str.'"';
  $stmt = $dbh->query($sql);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($result == false) {
    $stmt = $dbh->prepare("insert into task_data (id, data) VALUES (:id, :data)");
    $stmt->bindParam(':id', $_SESSION['user']->id_str, PDO::PARAM_STR);
    $d = '[]';
    $stmt->bindParam(':data', $d, PDO::PARAM_STR);
    $stmt->execute();
    echo '([])';
    return;
  }

  echo "(";
  echo $result['data'];
  echo ")";

}

function setData($value) {
  global $user_id;
  global $callback;

  //　こーるばっくなしは危険
  if ($callback == null) return -1;

  // セッションチェック
  $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
  $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
  $crypt_id = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, KEY, $_SESSION['user']->id_str, MCRYPT_MODE_ECB, $iv);
  if ($crypt_id != $user_id) return -1;

  // db接続
  try {
  $dbh = new PDO('mysql:host=localhost;dbname=progressManagement;charset=utf8',SQL_USER, PASS,
  array(PDO::ATTR_EMULATE_PREPARES => false));
  } catch (PDOException $e) {
   exit('データベース接続失敗。'.$e->getMessage());
  }

  $sql = 'update task_data set data =:data where id = :id';
  $stmt = $dbh -> prepare($sql);
  $stmt->bindParam(':data', $value, PDO::PARAM_STR);
  $stmt->bindParam(':id', $_SESSION['user']->id_str, PDO::PARAM_STR);
  $stmt->execute();

  echo '("")';
}

function isLogin() {
  global $_SESSION;
  if ($_SESSION['user'] == null) {
    echo '("ng")';
  }
  else {
    echo '("ok")';
  }
  return;
}

function getImageUrl () {
  global $user;
  //echo var_dump($user);
  echo '("';
  echo $user->profile_image_url_https;
  echo '")';
}

if ($f == 'isLogin') isLogin();
if ($f == 'getImageUrl') getImageUrl();
if ($f == 'getData') getData();
if ($f == 'setData') setData($_GET['setData']);
