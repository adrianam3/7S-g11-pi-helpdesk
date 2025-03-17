<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de auditoria
require_once('revisarsesion.controller.php');
require_once('../models/auditoria.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$auditoria = new Auditoria;

switch ($_GET["op"]) {
    //TODO: Operaciones de auditoria

    case 'todos': //TODO: Procedimiento para cargar todos los datos de auditoria
        $datos = array();
        $datos = $auditoria->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idAuditoria = $_POST["idAuditoria"];
        $datos = array();
        $datos = $auditoria->uno($idAuditoria);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $nombreTabla = $_POST["nombreTabla"];
        $tipoAccion = $_POST["tipoAccion"];
        $idRegistro = $_POST["idRegistro"];
        $datosAnteriores = $_POST["datosAnteriores"];
        $datosNuevos = $_POST["datosNuevos"];
        $usuarioResponsable = $_POST["usuarioResponsable"];
        $ipOrigen = $_POST["ipOrigen"];
        $detallesAdicionales = $_POST["detallesAdicionales"];

        $datos = array();
        $datos = $auditoria->insertar($nombreTabla, $tipoAccion, $idRegistro, $datosAnteriores, $datosNuevos, $usuarioResponsable, $ipOrigen, $detallesAdicionales);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idAuditoria = $_POST["idAuditoria"];
        $nombreTabla = $_POST["nombreTabla"];
        $tipoAccion = $_POST["tipoAccion"];
        $idRegistro = $_POST["idRegistro"];
        $datosAnteriores = $_POST["datosAnteriores"];
        $datosNuevos = $_POST["datosNuevos"];
        $usuarioResponsable = $_POST["usuarioResponsable"];
        $ipOrigen = $_POST["ipOrigen"];
        $detallesAdicionales = $_POST["detallesAdicionales"];

        $datos = array();
        $datos = $auditoria->actualizar($idAuditoria, $nombreTabla, $tipoAccion, $idRegistro, $datosAnteriores, $datosNuevos, $usuarioResponsable, $ipOrigen, $detallesAdicionales);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idAuditoria = $_POST["idAuditoria"];
        $datos = array();
        $datos = $auditoria->eliminar($idAuditoria);
        echo json_encode($datos);
        break;
}
