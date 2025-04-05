<?php
require_once('../models/persona.model.php');
require_once('../config/config.php'); // si ClaseConectar está en config

$personaModel = new Persona();
$con = new ClaseConectar();
$conn = $con->ProcedimientoParaConectar();

header("Content-Type: text/plain");

// // Seguridad básica: solo ejecución manual
// if (php_sapi_name() !== 'cli' && !isset($_GET['auth']) || $_GET['auth'] !== 'segura123') {
//     http_response_code(403);
//     exit("Acceso denegado.");
// }

$query = "SELECT idPersona, cedula, telefono, celular FROM persona";
$result = mysqli_query($conn, $query);

$encriptados = 0;
$omitidos = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $id = $row['idPersona'];
    $cedula = $row['cedula'];
    $telefono = $row['telefono'];
    $celular = $row['celular'];

    // Saltar si ya parecen estar cifrados (por longitud o por patrón base64)
    if (
        strlen($cedula) > 30 ||
        strlen($telefono) > 30 ||
        strlen($celular) > 30
    ) {
        $omitidos++;
        continue;
    }

    $cedulaEnc = $personaModel->encrypt($cedula);
    $telefonoEnc = $personaModel->encrypt($telefono);
    $celularEnc = $personaModel->encrypt($celular);

    $stmt = $conn->prepare("UPDATE persona SET cedula = ?, telefono = ?, celular = ? WHERE idPersona = ?");
    $stmt->bind_param("sssi", $cedulaEnc, $telefonoEnc, $celularEnc, $id);
    $stmt->execute();

    $encriptados++;
}

$conn->close();

echo " Proceso completado\n";
echo " Registros encriptados: $encriptados\n";
echo " Registros omitidos (ya encriptados): $omitidos\n";
