<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de nivelAgente
require_once('revisarsesion.controller.php');
require_once('../models/nivelAgente.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$nivelAgente = new NivelAgente;

switch ($_GET["op"]) {
    //TODO: Operaciones de nivelAgente

    case 'todos': //TODO: Procedimiento para cargar todos los datos de nivelAgente
        $datos = array();
        $datos = $nivelAgente->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idNivelAgente = $_POST["idNivelAgente"];
        $datos = array();
        $datos = $nivelAgente->uno($idNivelAgente);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $nombre = $_POST["nombre"];
        $descripcion = $_POST["descripcion"];
        $estado = $_POST["estado"];

        $datos = array();
        $datos = $nivelAgente->insertar($nombre, $descripcion, $estado);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idNivelAgente = $_POST["idNivelAgente"];
        $nombre = $_POST["nombre"];
        $descripcion = $_POST["descripcion"];
        $estado = $_POST["estado"];
        $datos = array();
        $datos = $nivelAgente->actualizar($idNivelAgente, $nombre, $descripcion, $estado);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idNivelAgente = $_POST["idNivelAgente"];
        $datos = array();
        $datos = $nivelAgente->eliminar($idNivelAgente);
        echo json_encode($datos);
        break;
}
