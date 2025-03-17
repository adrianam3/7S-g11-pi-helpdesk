<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Authorization, idRol, idUsuario");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}

// Obtener los valores de `idRol` e `idUsuario` desde los headers
$headers = getallheaders();
// $headers = array_change_key_case(getallheaders(), CASE_LOWER);

file_put_contents('headers_debug.log', print_r($headers, true)); // Guardar en un archivo para revisar

error_log("Encabezados recibidos en PHP: " . print_r($headers, true));

error_log("Encabezados recibidos: " . print_r($headers, true));
$idRol = isset($_SERVER['HTTP_IDROL']) ? $_SERVER['HTTP_IDROL'] : null;
$idUsuario = isset($_SERVER['HTTP_IDUSUARIO']) ? $_SERVER['HTTP_IDUSUARIO'] : null;

error_log("ID Rol: $idRol - ID Usuario: $idUsuario");
// Validar si los valores existen
if (!$idRol || !$idUsuario) {
    http_response_code(403);
    echo json_encode(["message" => "Accesooooo denegado. No se encontró el rol del usuario.". $idRol]);
    exit();
}

//TODO: Controlador de ticket
require_once('revisarsesion.controller.php');
require_once('email.controller.php');
require_once('../models/persona.model.php');
require_once('../models/agente.model.php');
require_once('../models/ticket.model.php');
require_once('../controllers/auth.controller.php');

// error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$usuario = verificarToken();
// Extraer datos del token
$idUsuario = $usuario->sub;  // Usuario extraído del token
$idRol = $usuario->rol;      // Rol extraído del token

$ticket = new Ticket;
$persona = new Persona;
$agente = new Agente;

switch ($_GET["op"]) {
    case 'todos': //TODO: Procedimiento para cargar todos los datos de ticket
        $resultadoAgentes = $agente->agenteByUsuario($idUsuario);
        $agenteData = mysqli_fetch_assoc($resultadoAgentes);
        error_log("agente data : " . print_r($agenteData, true) . " - con el usuario " .$idUsuario);
        $idAgente = isset($agenteData['idAgente']) ? $agenteData['idAgente'] : null;
        
        $datos = array();
        $datos = $ticket->todos($idRol, $idUsuario, $idAgente);
        $todos = [];

        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno': //TODO: Obtener un ticket específico
        $idTicket = $_POST["idTicket"];
        $datos = array();
        $datos = $ticket->uno($idTicket);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Insertar un nuevo ticket
        $titulo = $_POST["titulo"];
        $descripcion = $_POST["descripcion"];
        $idSla = $_POST["idSla"];
        $idPrioridad = $_POST["idPrioridad"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $idAgente = $_POST["idAgente"];

        $datos = array();
        $datos = $ticket->insertar(
            $titulo,
            $descripcion,
            $idSla,
            $idPrioridad,
            $idUsuario, // Se usa el idUsuario del header
            $_POST["idfuenteContacto"],
            $_POST["idTemaAyuda"],
            $_POST["resueltoPrimerContacto"],
            $_POST["idEstadoTicket"],
            $idDepartamentoA,
            $idAgente
        );
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Eliminar un ticket
        $idTicket = $_POST["idTicket"];
        $datos = array();
        $datos = $ticket->eliminar($idTicket);
        echo json_encode($datos);
        break;
}
