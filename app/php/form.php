<?php

function clear_string($str){
    $str = strip_tags($str);
    $str = htmlspecialchars($str);
    $str = trim($str);
    return $str;
}

$message = "";

if (isset($_POST['name'])) {
    $name = clear_string($_POST['name']);
    $message.= 'Имя заказчика: '.$name."\n";
}
if (isset($_POST['email'])) {
    $email = clear_string($_POST['email']);
    $message.= 'Email: '.$email."\n";
}
if (isset($_POST['textarea'])) {
    $textarea = clear_string($_POST['textarea']);
    $message.= 'Сообщение: '.$textarea."\n";
}
$myemail = 'trade-meta@mail.ru';
$subject = 'Письмо с сайта trade-meta.ru от заказчика';

if (isset($name) && isset($email)) {
    try{
        if(!mail($myemail, $subject, $message)){
            throw new Exception('mail failed');
        }else{
            echo 'mail sent';
        }
    }catch(Exception $e){
        echo $e->getMessage() ."\n";
    }
}
