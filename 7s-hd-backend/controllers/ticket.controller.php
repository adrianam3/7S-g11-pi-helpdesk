<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Authorization, idRol, idUsuario");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}

// Requerir archivos necesarios
// require_once('../controllers/auth.controller.php'); // Verificación del token
require_once('email.controller.php');
require_once('../models/persona.model.php');
require_once('../models/agente.model.php');
require_once('../models/ticket.model.php');

// Obtener headers
$headers = getallheaders();

file_put_contents('headers_debug.log', print_r($headers, true)); // Guardar en un archivo para revisar

error_log("Encabezados recibidos en PHP: " . print_r($headers, true));

error_log("Encabezados recibidos: " . print_r($headers, true));

// Verificar y obtener el token
// $usuario = verificarToken();
// if (!$usuario) {
//     http_response_code(401);
//     echo json_encode(["message" => "Acceso denegado. Token inválido o expirado."]);
//     exit();
// }

// // Extraer datos del token
// $idUsuario = $usuario->sub;  // Usuario extraído del token
// $idRol = $usuario->rol;      // Rol extraído del token

// error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error

$idRol = isset($_SERVER['HTTP_IDROL']) ? $_SERVER['HTTP_IDROL'] : null;
$idUsuario = isset($_SERVER['HTTP_IDUSUARIO']) ? $_SERVER['HTTP_IDUSUARIO'] : null;

// Verificar si `idUsuario` y `idRol` están definidos
if (!$idUsuario || !$idRol) {
    http_response_code(403);
    echo json_encode(["message" => "Acceso denegado. No se encontraron los datos del usuario en los headers."]);
    exit();
}

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

        // Recibe los valores desde el POST
        $titulo = $_POST["titulo"];
        $descripcion = $_POST["descripcion"];
        $idSla = $_POST["idSla"];
        $idPrioridad = $_POST["idPrioridad"]; //1;
        $idUsuario = $_POST["idUsuario"]; //1;
        $idfuenteContacto = $_POST["idfuenteContacto"]; //1;
        $idTemaAyuda = $_POST["idTemaAyuda"]; //1;
        $resueltoPrimerContacto = $_POST["resueltoPrimerContacto"];
        $idEstadoTicket = $_POST["idEstadoTicket"]; //1;
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $idAgente = $_POST["idAgente"];
        $emailUsuario = $_POST["emailUsuario"];
        $nombreUsuario = $_POST["nombreUsuario"];

        // Validación del tamaño del contenido HTML am
        if (strlen($descripcion) > 512000) {
            http_response_code(413); // Payload Too Large
            echo json_encode(['error' => 'El contenido del detalle excede el tamaño permitido.']);
            exit;
        }

        // Preparar destinatarios
        $destinatarios = [
            ['email' => $emailUsuario, 'nombre' => $nombreUsuario]
        ];

        $resultadoPersonas = $persona->todosByRol('4'); // rol Coordinador id = 4
        if ($resultadoPersonas) {
            while ($row = mysqli_fetch_assoc($resultadoPersonas)) {
                $destinatarios[] = ['email' => $row['email'], 'nombre' => $row['nombreCompleto']];
            }
        }
        foreach ($destinatarios as $destinatario) {
            enviarEmailCrearTicket(
                emailRecibe: $destinatario['email'],
                nombreRecibe: $destinatario['nombre'],
                nombreCreadorTicket: $nombreUsuario,
                asunto: $titulo,
                detalle: $descripcion
            );
        }

        $datos = array();
        $datos = $ticket->insertar(
            $titulo,
            $descripcion,
            $idSla,
            $idPrioridad,
            $idUsuario,
            $idfuenteContacto,
            $idTemaAyuda,
            $resueltoPrimerContacto,
            $idEstadoTicket,
            $idDepartamentoA,
            $idAgente
        );

        echo json_encode($datos);
        break;

        case 'actualizar':
            $idTicket = $_POST["idTicket"];
            $titulo = $_POST["titulo"];
            $descripcion = $_POST["descripcion"];
            $idSla = $_POST["idSla"] ?? null;
            $idPrioridad = $_POST["idPrioridad"] ?? null;
            $idfuenteContacto = $_POST["idfuenteContacto"] ?? '1';
            $idTemaAyuda = $_POST["idTemaAyuda"] ?? null;
            $resueltoPrimerContacto = $_POST["resueltoPrimerContacto"] ?? '0';
            $idDepartamentoA = $_POST["idDepartamentoA"] !== '' ? $_POST["idDepartamentoA"] : null;
            $idAgente = $_POST["idAgente"] !== '' ? $_POST["idAgente"] : null;
            $idEstadoTicket = $_POST["idEstadoTicket"] ?? '1';
        
            // Manejo de fechas: si vienen como 'null' o vacías, se convierten a NULL
            function obtenerFecha($campo) {
                return isset($_POST[$campo]) && $_POST[$campo] !== '' && $_POST[$campo] !== 'null'
                    ? $_POST[$campo]
                    : null;
            }
        
            $fechaInicioAtencion = obtenerFecha('fechaInicioAtencion');
            $fechaPrimeraRespuesta = obtenerFecha('fechaPrimeraRespuesta');
            $fechaAtualizacion = obtenerFecha('fechaAtualizacion');
            $fechaReapertura = obtenerFecha('fechaReapertura');
            $fechaUltimaRespuesta = obtenerFecha('fechaUltimaRespuesta');
            $fechaCierre = obtenerFecha('fechaCierre');
        
            $nombreUsuario = $_POST["nombreUsuario"] ?? '';
        
            // Verificar si se cambió de agente y notificar
            $resultado = $ticket->uno($idTicket);
            $ticketActual = $resultado->fetch_assoc();
        
            if ($ticketActual['idAgente'] != $idAgente && $idAgente) {
                $resultadoAgente = $agente->uno($idAgente);
                if ($resultadoAgente) {
                    $fila = $resultadoAgente->fetch_assoc();
                    enviarEmailAgenteAsignado(
                        idTicket: $idTicket,
                        emailRecibe: $fila['agenteEmail'],
                        nombreRecibe: $fila['agenteNombreCompleto'],
                        nombrequienAsignaTicket: $nombreUsuario,
                        asunto: $titulo
                    );
                }
            }
        
            $resultado = $ticket->actualizar(
                $idTicket,
                $titulo,
                $descripcion,
                $idSla,
                $idPrioridad,
                $idfuenteContacto,
                $idTemaAyuda,
                $resueltoPrimerContacto,
                $idEstadoTicket,
                $idDepartamentoA,
                $idAgente,
                $fechaInicioAtencion,
                $fechaPrimeraRespuesta,
                $fechaAtualizacion,
                $fechaReapertura,
                $fechaUltimaRespuesta,
                $fechaCierre
            );
        
            echo json_encode($resultado);
    break;

    case 'actualizaragente':
        $idTicket = isset($_POST["idTicket"]) ? intval($_POST["idTicket"]) : null;
        $idDepartamentoA = isset($_POST["idDepartamentoA"]) ? intval($_POST["idDepartamentoA"]) : null;
        $idAgente = isset($_POST["idAgente"]) ? intval($_POST["idAgente"]) : null;
        $titulo = isset($_POST["titulo"]) ? trim($_POST["titulo"]) : null;
        $nombreUsuario = isset($_POST["nombreUsuario"]) ? trim($_POST["nombreUsuario"]) : "Usuario no identificado";
        $idEstadoTicket = isset($_POST["idEstadoTicket"]) ? intval($_POST["idEstadoTicket"]) : null;
    
        if (!$idTicket || !$idDepartamentoA || !$idAgente || !$idEstadoTicket) {
            echo json_encode([
                'success' => false,
                'message' => 'Parámetros incompletos o inválidos.'
            ]);
            break;
        }
    
        //Obtener ticket actual
        $resultado = $ticket->uno($idTicket);
        $ticketActual = $resultado ? $resultado->fetch_assoc() : null;
    
        if (!$ticketActual) {
            echo json_encode([
                'success' => false,
                'message' => 'El ticket no existe.'
            ]);
            break;
        }
    
        //Verificar si el agente ha cambiado y enviar notificación si aplica
        $resultadoAgente = $agente->uno($idAgente);
        $filaAgente = $resultadoAgente ? $resultadoAgente->fetch_assoc() : null;
    
        if (!$filaAgente) {
            echo json_encode([
                'success' => false,
                'message' => 'El agente no existe.'
            ]);
            break;
        }
    
        if ($ticketActual['idAgente'] != $idAgente && $titulo) {
            enviarEmailAgenteAsignado(
                idTicket: $idTicket,
                emailRecibe: $filaAgente['agenteEmail'],
                nombreRecibe: $filaAgente['agenteNombreCompleto'],
                nombrequienAsignaTicket: $nombreUsuario,
                asunto: $titulo
            );
        }
    
        //Ejecutar actualización con auditoría
        $resultadoActualizacion = $ticket->actualizarAgente(
            $idTicket,
            $idDepartamentoA,
            $idAgente,
            $idEstadoTicket//,
            // $nombreUsuario // ← usado en la auditoría
        );
        echo json_encode($resultadoActualizacion);
    break;

    case 'cerrarReaperturarTicket':
        $idTicket = isset($_POST["idTicket"]) ? intval($_POST["idTicket"]) : null;
        $idEstadoTicket = isset($_POST["idEstadoTicket"]) ? intval($_POST["idEstadoTicket"]) : null;
        $accion = isset($_POST["accion"]) ? $_POST["accion"] : null;
    
        if (!$idTicket || !$idEstadoTicket || !in_array($accion, ['1', '2'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Parámetros incompletos o inválidos.'
            ]);
            break;
        }
    
        $resultado = $ticket->cerrarReaperturarTicket(
            $idTicket,
            $idEstadoTicket,
            $accion
        );
    
        echo json_encode($resultado);
    break;

    
    case 'inicioAtencion':
        $idTicket = $_POST["idTicket"] ?? null;
        $idEstadoTicket = $_POST["idEstadoTicket"] ?? null;
    
        if (!$idTicket || !$idEstadoTicket) {
            echo json_encode([
                "success" => false,
                "message" => "Faltan parámetros obligatorios."
            ]);
            break;
        }
    
        // Verificar que el ticket exista
        $resultado = $ticket->uno($idTicket);
        $ticketActual = $resultado ? $resultado->fetch_assoc() : null;
    
        if (!$ticketActual) {
            echo json_encode([
                "success" => false,
                "message" => "El ticket no existe."
            ]);
            break;
        }
    
        // Realizar actualización
        $exito = $ticket->iniciarAtencion($idTicket, $idEstadoTicket);
    
        echo json_encode([
            "success" => $exito,
            "message" => $exito
                ? "Inicio de atención registrado correctamente."
                : "No se pudo registrar el inicio de atención."
        ]);
    break;  
        
    case 'eliminar': //TODO: Eliminar un ticket
        $idTicket = $_POST["idTicket"];
        $datos = array();
        $datos = $ticket->eliminar($idTicket);
        echo json_encode($datos);
    break;

    case 'dashboard':
        // ✅ Validar que las fechas estén definidas
        if (!isset($_GET["fechaInicio"], $_GET["fechaFin"])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan parámetros: fechaInicio o fechaFin"]);
            break;
        }
    
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
    
        // ✅ Validar el formato de fechas
        $formatoValido = function($fecha) {
            $d = DateTime::createFromFormat('Y-m-d', $fecha);
            return $d && $d->format('Y-m-d') === $fecha;
        };
    
        if (!$formatoValido($fechaInicio) || !$formatoValido($fechaFin)) {
            http_response_code(400);
            echo json_encode(["error" => "Formato de fecha inválido. Use 'Y-m-d'."]);
            break;
        }
    
        // ✅ Ajustar el rango de fechas (+1 y -1 día)
        // $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio . ' -1 day'));
        // $fechaFinModificada = date('Y-m-d', strtotime($fechaFin . ' +1 day'));

        $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio));
        $fechaFinModificada = date('Y-m-d', strtotime($fechaFin));
    
        // ✅ Ejecutar consulta
        $datos = $ticket->dashboard($fechaInicioModificada, $fechaFinModificada);
    
        // ✅ Verificar que se obtuvieron resultados
        if (!$datos) {
            http_response_code(500);
            echo json_encode(["error" => "Error al consultar la base de datos."]);
            break;
        }
    
        // ✅ Convertir resultados a array
        $todos = [];
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
    
        // ✅ Devolver resultado en JSON
        header('Content-Type: application/json');
        echo json_encode($todos);
    break;
        
    
    case 'dashboarddepartamentoestado': //TODO: Procedimiento para cargar todos los datos de ticketDetalle
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
        $fechaFinModificada = date('Y-m-d', strtotime($fechaFin . ' +1 day'));
        $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio . ' -1 day'));
        $todos = array();
            
        $datos = $ticket->dashboarddepartamentoestado($fechaInicioModificada, $fechaFinModificada);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
    break;

    case 'dashboardagente': //TODO: Procedimiento para cargar tickets x agente
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
        $fechaFinModificada = date('Y-m-d', strtotime($fechaFin . ' +1 day'));
        $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio . ' -1 day'));
        $todos = array();
            
        $datos = $ticket->dashboardagente($fechaInicioModificada, $fechaFinModificada);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
    break;

    case 'dashboardencuesta': //TODO: Procedimiento para cargar encuestas x fecha
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
        $fechaFinModificada = date('Y-m-d', strtotime($fechaFin . ' +1 day'));
        $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio . ' -1 day'));
        $todos = array();
            
        $datos = $ticket->dashboardencuesta($fechaInicioModificada, $fechaFinModificada);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
    break;


    case 'dashboardEncuestaAgente':
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
        $todos = array();
    
        $datos = $ticket->dashboardEncuestaAgente($fechaInicio, $fechaFin);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
    break;
                    

}
