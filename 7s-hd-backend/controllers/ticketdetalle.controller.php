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

    case 'todos':
        // Verificar que se haya enviado el parámetro y que sea un número válido
        if (isset($_GET["idTicket"]) && is_numeric($_GET["idTicket"])) {
            $idTicket = intval($_GET["idTicket"]);
            $datos = $ticketDetalle->todos($idTicket);
    
            $todos = array();
            foreach ($datos as $row) {
                $todos[] = $row;
            }
    
            echo json_encode($todos);
        } else {
            // Retornar error si no se envió correctamente el parámetro
            http_response_code(400); // Bad Request
            echo json_encode([
                "error" => "Parámetro 'idTicket' inválido o no enviado."
            ]);
        }
    break;    

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idTicketDetalle = $_POST["idTicketDetalle"];
        $datos = array();
        $datos = $ticketDetalle->uno($idTicketDetalle);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar':
        $idTicket = isset($_POST["idTicket"]) ? intval($_POST["idTicket"]) : null;
        $idDepartamentoA = isset($_POST["idDepartamentoA"]) ? intval($_POST["idDepartamentoA"]) : null;
        $observacion = isset($_POST["observacion"]) ? trim($_POST["observacion"]) : null;
        $detalle = isset($_POST["detalle"]) ? trim($_POST["detalle"]) : null;
        $tipoDetalle = isset($_POST["tipoDetalle"]) ? trim($_POST["tipoDetalle"]) : null;
    
        $idAgente = isset($_POST["idAgente"]) && $_POST["idAgente"] !== 'null' && $_POST["idAgente"] !== '' 
            ? intval($_POST["idAgente"]) 
            : null;
    
            error_log("recibidos: idt " . print_r($idTicket, true));
            error_log("recibidos: iddep " . print_r($idDepartamentoA, true));
            error_log("recibidos: ideta " . print_r($detalle, true));
            error_log("recibidos: tipd " . print_r($tipoDetalle, true));

        // if (!$idTicket || !$idDepartamentoA || !$detalle || !$tipoDetalle) {
        //     echo json_encode([
        //         'success' => false,
        //         'message' => 'Faltan campos obligatorios para insertar el detalle del ticket.'
        //     ]);
        //     break;
        // }
    
        $resultado = $ticketDetalle->insertar(
            $idTicket,
            $idAgente,
            $idDepartamentoA,
            $observacion,
            $detalle,
            $tipoDetalle
        );
    
        echo json_encode($resultado);
    break;   
    
    case 'actualizar':
        $idTicketDetalle = isset($_POST["idTicketDetalle"]) ? intval($_POST["idTicketDetalle"]) : null;
        $idTicket = isset($_POST["idTicket"]) ? intval($_POST["idTicket"]) : null;
        $idDepartamentoA = isset($_POST["idDepartamentoA"]) ? intval($_POST["idDepartamentoA"]) : null;
        $observacion = isset($_POST["observacion"]) ? trim($_POST["observacion"]) : null;
        $detalle = isset($_POST["detalle"]) ? trim($_POST["detalle"]) : null;
        $tipoDetalle = isset($_POST["tipoDetalle"]) ? trim($_POST["tipoDetalle"]) : null;
    
        $idAgente = isset($_POST["idAgente"]) && $_POST["idAgente"] !== 'null' && $_POST["idAgente"] !== ''
            ? intval($_POST["idAgente"])
            : null;
    
        if (!$idTicketDetalle || !$idTicket || !$idDepartamentoA || !$detalle || !$tipoDetalle) {
            echo json_encode([
                'success' => false,
                'message' => 'Faltan campos obligatorios para actualizar el detalle del ticket.'
            ]);
            break;
        }
    
        $resultado = $ticketDetalle->actualizar(
            $idTicketDetalle,
            $idTicket,
            $idAgente,
            $idDepartamentoA,
            $observacion,
            $detalle,
            $tipoDetalle
        );
    
        echo json_encode($resultado);
    break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idTicketDetalle = $_POST["idTicketDetalle"];
        $datos = array();
        $datos = $ticketDetalle->eliminar($idTicketDetalle);
        echo json_encode($datos);
        break;
}
