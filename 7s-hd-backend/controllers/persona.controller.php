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

    case 'todos': //TODO: Procedimiento para cargar todos las datos de persona
        $datos = array();
        $datos = $persona->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
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

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idPersona = $_POST["idPersona"];
        $datos = array();
        $datos = $persona->uno($idPersona);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
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
        $datos = $persona->insertar($cedula, $nombres, $apellidos, $direccion, $telefono, $extension, $celular, $email, $estado);
        echo json_encode($datos);
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
}
