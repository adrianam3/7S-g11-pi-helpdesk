<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}
//TODO: Controlador de persona
require_once('revisarsesion.controller.php');
require_once('../models/persona.model.php');
error_reporting(0); //DESHABILITAR ERRORR,  DEJAR COMENTADO Si se desea que se muestre el error

// $decoded = verificarToken(); // Esta línea protege la API
// $idUsuario = $decoded->sub;
// $idRol = $decoded->rol;
$persona = new Persona;

switch ($_GET["op"]) {
    //TODO: Operaciones de persona

    case 'todos': // Procedimiento para cargar todos los datos de persona
        try {
            $datos = $persona->todos();
    
            if (!empty($datos)) {
                echo json_encode($datos);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "No se encontraron personas."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error al obtener los datos.", "error" => $e->getMessage()]);
        }
        break;
    

    case 'todossinusuario': //TODO: Procedimiento para cargar todos las datos de persona
        $datos = array();
        $datos = $persona->todossinusuario();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'todosByRol': //TODO: Procedimiento para cargar parsonas por su rol
        $datos = array();
        $idDepartamentoA = $_GET["idRol"];
        $datos = $persona->todosByRol(idRol: $idRol);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    // case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
    //     $idPersona = $_POST["idPersona"];
    //     $datos = array();
    //     $datos = $persona->uno($idPersona);
    //     $res = mysqli_fetch_assoc($datos);
    //     echo json_encode($res);
    //     break;

    case 'uno':
    // Validar si se recibe correctamente el idPersona
    if (isset($_POST["idPersona"]) && is_numeric($_POST["idPersona"])) {
        $idPersona = intval($_POST["idPersona"]); // Convertir a entero de forma segura

        $datos = $persona->uno($idPersona);

        if ($datos) {
            echo json_encode($datos);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Persona no encontrada."]);
        }
    } else {
        http_response_code(400); // Bad request
        echo json_encode(["message" => "ID de persona inválido o no enviado."]);
    }
    break;
    

    case 'insertar':
    // Validar que todos los campos requeridos existan
    $camposRequeridos = ['cedula', 'nombres', 'apellidos', 'direccion', 'telefono', 'extension', 'celular', 'email', 'estado'];
    $datosValidos = true;

    foreach ($camposRequeridos as $campo) {
        if (!isset($_POST[$campo])) {
            $datosValidos = false;
            break;
        }
    }

    if ($datosValidos) {
        // Sanitizar los datos recibidos
        $cedula = trim($_POST["cedula"]);
        $nombres = trim($_POST["nombres"]);
        $apellidos = trim($_POST["apellidos"]);
        $direccion = trim($_POST["direccion"]);
        $telefono = trim($_POST["telefono"]);
        $extension = trim($_POST["extension"]);
        $celular = trim($_POST["celular"]);
        $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
        $estado = intval($_POST["estado"]);

        // Validación básica opcional (puedes extenderla según tus reglas de negocio)
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["message" => "Correo electrónico inválido."]);
            break;
        }

        $datos = $persona->insertar($cedula, $nombres, $apellidos, $direccion, $telefono, $extension, $celular, $email, $estado);
        echo json_encode($datos);
    } else {
        http_response_code(400); // Bad request
        echo json_encode(["message" => "Faltan campos requeridos para la inserción."]);
    }
    break;
    
    case 'actualizar': //TODO: Procedimiento para actualizar un registro en la base de datos
        $idPersona = $_POST["idPersona"];
        $cedula = $_POST["cedula"];
        $nombres = $_POST["nombres"];
        $apellidos = $_POST["apellidos"];
        $direccion = $_POST["direccion"];
        $telefono = $_POST["telefono"];
        $extension = $_POST["extension"];
        $celular = $_POST["celular"];
        $email = $_POST["email"];
        $estado = $_POST["estado"];
        $datos = array();
        $datos = $persona->actualizar($idPersona, $cedula, $nombres, $apellidos, $direccion, $telefono, $extension, $celular, $email, $estado);
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idPersona = $_POST["idPersona"];
        $datos = array();
        $datos = $persona->eliminar($idPersona);
        echo json_encode($datos);
        break;

        case 'actualizar_perfil':
            if (!isset($_POST["idPersona"], $_POST["nombres"], $_POST["apellidos"], $_POST["telefono"])) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan campos requeridos."]);
                break;
            }
        
            $idPersona = intval($_POST["idPersona"]);
            $nombres = trim($_POST["nombres"]);
            $apellidos = trim($_POST["apellidos"]);
            $telefono = trim($_POST["telefono"]);
        
            $resultado = $persona->actualizarPerfil($idPersona, $nombres, $apellidos, $telefono);
            echo json_encode($resultado);
            break;
                
}
