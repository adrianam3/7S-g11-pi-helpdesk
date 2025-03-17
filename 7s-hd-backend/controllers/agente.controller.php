<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}
//TODO: Controlador de agente
require_once('revisarsesion.controller.php');
require_once('../models/agente.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$agente = new Agente;

switch ($_GET["op"]) {
    //TODO: Operaciones de agente

    case 'todos': //TODO: Procedimiento para cargar todos los datos de agente
        $datos = array();
        $datos = $agente->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'todosByDepartamento': //TODO: Procedimiento para cargar todos los datos de agente
        $datos = array();
        $idDepartamentoA = $_GET["idDepartamentoA"];
        $datos = $agente->todosByDepartamento($idDepartamentoA);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'agenteByUsuario': //TODO: Procedimiento para cargar todos los datos de agente
        $datos = array();
        $idUsuario = $_GET["idUsuario"];
        $datos = $agente->agenteByUsuario($idUsuario);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idAgente = $_POST["idAgente"];
        $datos = array();
        $datos = $agente->uno($idAgente);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $agenteName = $_POST["agente"];
        $descripcion = $_POST["descripcion"];
        $idUsuario = $_POST["idUsuario"];
        $idNivelAgente = $_POST["idNivelAgente"];
        $estado = $_POST["estado"];

        $datos = array();
        $datos = $agente->insertar($agenteName, $descripcion, $idUsuario, $idNivelAgente, $estado);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idAgente = $_POST["idAgente"];
        $agenteName = $_POST["agente"];
        $descripcion = $_POST["descripcion"];
        $idUsuario = $_POST["idUsuario"];
        $idNivelAgente = $_POST["idNivelAgente"];
        $estado = $_POST["estado"];
        $datos = array();
        $datos = $agente->actualizar($idAgente, $agenteName, $descripcion, $idUsuario, $idNivelAgente, $estado);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idAgente = $_POST["idAgente"];
        $datos = array();
        $datos = $agente->eliminar($idAgente);
        echo json_encode($datos);
        break;
}
