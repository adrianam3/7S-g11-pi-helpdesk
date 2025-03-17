<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de sla
require_once('revisarsesion.controller.php');
require_once('../models/sla.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$sla = new Sla;

switch ($_GET["op"]) {
    //TODO: Operaciones de sla

    case 'todos': //TODO: Procedimiento para cargar todos los datos de sla
        $datos = array();
        $datos = $sla->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idSla = $_POST["idSla"];
        $datos = array();
        $datos = $sla->uno($idSla);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $nombre = $_POST["nombre"];
        $tiempoRespuesta = $_POST["tiempoRespuesta"];
        $tiempoResolucion = $_POST["tiempoResolucion"];
        $idHorario = $_POST["idHorario"];
        $idPrioridad = $_POST["idPrioridad"];
        $estado = $_POST["estado"];

        $datos = array();
        $datos = $sla->insertar($nombre, $tiempoRespuesta, $tiempoResolucion, $idHorario, $idPrioridad, $estado);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idSla = $_POST["idSla"];
        $nombre = $_POST["nombre"];
        $tiempoRespuesta = $_POST["tiempoRespuesta"];
        $tiempoResolucion = $_POST["tiempoResolucion"];
        $idHorario = $_POST["idHorario"];
        $idPrioridad = $_POST["idPrioridad"];
        $estado = $_POST["estado"];
        $datos = array();
        $datos = $sla->actualizar($idSla, $nombre, $tiempoRespuesta, $tiempoResolucion, $idHorario, $idPrioridad, $estado);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idSla = $_POST["idSla"];
        $datos = array();
        $datos = $sla->eliminar($idSla);
        echo json_encode($datos);
        break;
}
