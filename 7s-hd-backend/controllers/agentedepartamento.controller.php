<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de AgenteDepartamento
require_once('revisarsesion.controller.php');
require_once('../models/AgenteDepartamento.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$agenteDepartamento = new AgenteDepartamento;

switch ($_GET["op"]) {
    //TODO: Operaciones de AgenteDepartamento

    case 'todos': //TODO: Procedimiento para cargar todos los datos de AgenteDepartamento
        $datos = array();
        $datos = $agenteDepartamento->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro específico
        $idAgente = $_POST["idAgente"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $datos = array();
        $datos = $agenteDepartamento->uno($idAgente, $idDepartamentoA);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $idAgente = $_POST["idAgente"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $estado = $_POST["estado"];

        $datos = array();
        $datos = $agenteDepartamento->insertar($idAgente, $idDepartamentoA, $estado);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idAgente = $_POST["idAgente"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $estado = $_POST["estado"];
        $datos = array();
        $datos = $agenteDepartamento->actualizar($idAgente, $idDepartamentoA, $estado);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idAgente = $_POST["idAgente"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $datos = array();
        $datos = $agenteDepartamento->eliminar($idAgente, $idDepartamentoA);
        echo json_encode($datos);
        break;
}
