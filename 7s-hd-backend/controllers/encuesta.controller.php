<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de encuesta
require_once('revisarsesion.controller.php');
require_once('../models/encuesta.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$encuesta = new Encuesta;

switch ($_GET["op"]) {
    //TODO: Operaciones de encuesta

    case 'todos': //TODO: Procedimiento para cargar todos los datos de encuesta
        $datos = $encuesta->todos();
    
        if (is_array($datos) && count($datos) > 0) {
            echo json_encode($datos);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No se encontraron encuestas."]);
        }
        break;
    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idEncuesta = $_POST["idEncuesta"];
        $datos = array();
        $datos = $encuesta->uno($idEncuesta);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $idTicket = $_POST["idTicket"];
        $idUsuario = $_POST["idUsuario"];
        $puntuacion = $_POST["puntuacion"];
        $comentarios = $_POST["comentarios"];

        $datos = array();
        $datos = $encuesta->insertar($idTicket, $idUsuario, $puntuacion, $comentarios);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idEncuesta = $_POST["idEncuesta"];
        $idTicket = $_POST["idTicket"];
        $idUsuario = $_POST["idUsuario"];
        $puntuacion = $_POST["puntuacion"];
        $comentarios = $_POST["comentarios"];
        $fechaRespuestaEncuesta = $_POST["fechaRespuestaEncuesta"];
        
        $datos = array();
        $datos = $encuesta->actualizar($idEncuesta, $idTicket, $idUsuario, $puntuacion, $comentarios, $fechaRespuestaEncuesta);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idEncuesta = $_POST["idEncuesta"];
        $datos = array();
        $datos = $encuesta->eliminar($idEncuesta);
        echo json_encode($datos);
        break;

    case 'encuestasByUsuario':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Método no permitido"]);
            exit;
        }  
        $idUsuario = filter_input(INPUT_POST, 'idUsuario', FILTER_VALIDATE_INT);
    
        if (!$idUsuario) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID de usuario inválido o no proporcionado"]);
            exit;
        }
        $datos = $encuesta->ncuestaByUsuario($idUsuario);
        if (is_array($datos)) {
            echo json_encode($datos);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error al obtener las encuestas"]);
        }
        break;        

    case 'ticketsByUserSinEncuesta':
        $idUsuario = isset($_POST["idUsuario"]) ? intval($_POST["idUsuario"]) : null;
    
        if (!$idUsuario) {
            http_response_code(400);
            echo json_encode(["message" => "Falta el parámetro idUsuario"]);
            break;
        }
    
        $tickets = $encuesta->ticketsByUserSinEncuesta($idUsuario);
    
        if (is_array($tickets) && count($tickets) > 0) {
            echo json_encode($tickets);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No hay tickets pendientes de encuesta para este usuario."]);
        }
        break;
    case 'ticketsSinEncuesta':
        $datos = $encuesta->ticketsSinEncuesta();    
        if (is_array($datos) && count($datos) > 0) {
            echo json_encode($datos);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No se encontraron encuestas."]);
        }
        break;
}
