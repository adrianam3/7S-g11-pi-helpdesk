<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de prioridad
require_once('revisarsesion.controller.php');
require_once('../models/prioridad.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$prioridad = new Prioridad;

switch ($_GET["op"]) {
    //TODO: Operaciones de prioridad

    case 'todos': //TODO: Procedimiento para cargar todos los datos de prioridad
        $datos = array();
        $datos = $prioridad->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idPrioridad = $_POST["idPrioridad"];
        $datos = array();
        $datos = $prioridad->uno($idPrioridad);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $nombre = $_POST["nombre"];
        $descripcion = $_POST["descripcion"];
        $estado = $_POST["estado"];

        $datos = array();
        $datos = $prioridad->insertar($nombre, $descripcion, $estado);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idPrioridad = $_POST["idPrioridad"];
        $nombre = $_POST["nombre"];
        $descripcion = $_POST["descripcion"];
        $estado = $_POST["estado"];
        $datos = array();
        $datos = $prioridad->actualizar($idPrioridad, $nombre, $descripcion, $estado);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idPrioridad = $_POST["idPrioridad"];
        $datos = array();
        $datos = $prioridad->eliminar($idPrioridad);
        echo json_encode($datos);
        break;
}
