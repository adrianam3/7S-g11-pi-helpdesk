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
        $datos = array();
        $datos = $encuesta->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
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
}
