<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if($method == "OPTIONS") {
    die();
}
//TODO: Controlador de ticketDetalle
require_once('revisarsesion.controller.php');
require_once('../models/ticketdetalle.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$ticketDetalle = new TicketDetalle;

switch ($_GET["op"]) {
    //TODO: Operaciones de ticketDetalle

    case 'todos': //TODO: Procedimiento para cargar todos los datos de ticketDetalle
        $idTicket = $_GET["idTicket"];
        $datos = array();
        $datos = $ticketDetalle->todos($idTicket);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idTicketDetalle = $_POST["idTicketDetalle"];
        $datos = array();
        $datos = $ticketDetalle->uno($idTicketDetalle);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        $idTicket = $_POST["idTicket"];
        $idAgente = $_POST["idAgente"] ? $_POST["idAgente"] : NULL;
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $observacion = $_POST["observacion"];
        $detalle = $_POST["detalle"];
        $tipoDetalle = $_POST["tipoDetalle"];

        $datos = array();
        $datos = $ticketDetalle->insertar($idTicket, $idAgente, $idDepartamentoA, $observacion, $detalle, $tipoDetalle);
        echo json_encode($datos);
        break;

    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idTicketDetalle = $_POST["idTicketDetalle"];
        $idTicket = $_POST["idTicket"];
        $idAgente = $_POST["idAgente"] ? $_POST["idAgente"] : NULL;
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $observacion = $_POST["observacion"];
        $detalle = $_POST["detalle"];
        $tipoDetalle = $_POST["tipoDetalle"];
        $datos = array();
        $datos = $ticketDetalle->actualizar($idTicketDetalle, $idTicket, $idAgente, $idDepartamentoA, $observacion, $detalle, $tipoDetalle);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idTicketDetalle = $_POST["idTicketDetalle"];
        $datos = array();
        $datos = $ticketDetalle->eliminar($idTicketDetalle);
        echo json_encode($datos);
        break;
}
