<?php
include "dbConn.php";
$obj = new DbConnect;
$conn = $obj->connect();
session_start();

function isLogin()
{
    global $conn;
    if (array_key_exists('username', $_SESSION)) {
        $username = $_SESSION['Admin_id'];
        $sql = "SELECT * FROM `user` WHERE `username` = :username";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return true;
        }
    }
}
function logout()
{
    session_destroy();
    unset($_SESSION['username']);
    unset($_SESSION['islogin']);
    die;
    exit;
}
function logIn($username, $password)
{
    global $conn;
    $sql = "SELECT * FROM `user` WHERE `username` = :username";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($userData && $password === $userData['password'] ) {
        // Generate a JWT
        $_SESSION['username'] = $username;
        $_SESSION['islogin'] = true;
        $response = ['username' => $_SESSION['username'], 'loginStatus' => $_SESSION['islogin'], "role" => $userData['role']];
        echo json_encode($response);
    } else {
        // Invalid username or password
        $response = ['error' => 'Invalid username or password'];
        echo json_encode($response);
    }
}
function testInput($data)
{
 //   $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
