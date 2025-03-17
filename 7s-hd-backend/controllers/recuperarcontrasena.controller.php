<?php
require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once('../config/config.php');
require_once('../models/usuario.model.php');
require_once('email.controller.php');
$usuario = new Usuario;

function generateToken($email) {
    $secretKey = base64_decode($email);
    $expirationTime = time() + 60;  // Tiempo actual + 1 minuto (60 segundos)
    $payload = [
        'exp' => $expirationTime,
        'data' => 'some_data'
    ];
    $token = base64_encode(json_encode($payload) . '.' . hash_hmac('sha256', json_encode($payload), $secretKey));
    return $token;
}

function verifyToken($token, $email) {
    $secretKey = base64_decode($email);
    $parts = explode('.', base64_decode($token));
    $payload = json_decode($parts[0], true);
    $signature = $parts[1];
    if (hash_hmac('sha256', json_encode($payload), $secretKey) !== $signature) {
        return false;  // Firma no válida
    }
    if ($payload['exp'] < time()) {
        return false;  // Token expirado
    }
    return true;  // Token válido
}
switch ($_GET["op"]) {
    case 'recuperar':
        $email = $_POST['email'];
        $token = generateToken($email);
        enviarEmailRecuperacion($email);
        // echo json_encode({});
        break;
    case 'cambiar':
        $token = $_POST['token'];
        $user = $_POST['usuario'];
        $password = $_POST['password'];
        if (verifyToken($token, $user)) {
            $resultado = $usuario->actualizarcontrasena($password, $user);
            echo json_encode(["message" => "Token válido"]);
            
        } else {
            echo "Token inválido o expirado";
        }
        break;
}
