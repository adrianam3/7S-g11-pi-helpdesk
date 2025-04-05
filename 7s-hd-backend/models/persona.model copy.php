<?php
//TODO: Clase de Persona
require_once('../config/config.php');

class Persona
{
    //TODO: Implementar los métodos de la clase

    private $encryption_key = "clave_segura_256bits"; // Clave secreta
    private $cipher_method = "AES-256-CBC"; // Método de cifrado
    private $iv = "1234567890123456"; // IV (16 caracteres)

    private function encrypt($data) {
        return openssl_encrypt($data, $this->cipher_method, $this->encryption_key, 0, $this->iv);
    }

    private function decrypt($data) {
        return openssl_decrypt($data, $this->cipher_method, $this->encryption_key, 0, $this->iv);
    }

    public function todos() // Select * from persona
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `persona`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function todossinusuario() // Select * from persona
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT persona.* 
        FROM `persona`
        LEFT JOIN `usuario` ON usuario.idPersona = persona.idPersona
        WHERE usuario.idPersona IS NULL;
        ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function todosByRol($idRol)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT persona.email, 
       CONCAT(persona.nombres, ' ', persona.apellidos) AS nombreCompleto
        FROM `persona`
        LEFT JOIN `usuario` ON usuario.idPersona = persona.idPersona
        LEFT JOIN `rol` ON rol.idRol = usuario.idRol
        WHERE usuario.idRol = $idRol;
        ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }
    public function personaByEmail($email)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $email = mysqli_real_escape_string($con, $email);
        $cadena = "SELECT persona.idPersona
                   FROM `persona`
                   WHERE persona.email = '$email';";
        $result = mysqli_query($con, $cadena);
        $con->close();
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            return $row['idPersona'];
        } else {
            return null;
        }
    }
    
    public function unoOld($idPersona) // Select * from persona where id = $idPersona
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT persona.*,
        CONCAT(persona.nombres, ' ', persona.apellidos) AS personaNombreCompleto
        FROM `persona` WHERE `idPersona`=$idPersona";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        
        if ($row = mysqli_fetch_assoc($result)) {
            // Desencriptar los datos antes de enviarlos
            $row['cedula'] = $this->decrypt($row['cedula']);
            $row['nombres'] =($row['nombres']);
            $row['apellidos'] = ($row['apellidos']);
            $row['direccion'] = ($row['direccion']);
            $row['telefono'] = ($row['telefono']);
            $row['celular'] = $this->decrypt($row['celular']);
            return $row;
        }

        return null;
    }

    public function uno($idPersona) // Select * from persona where id = $idPersona
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();

        $cadena = "SELECT persona.*,
            CONCAT(persona.nombres, ' ', persona.apellidos) AS personaNombreCompleto
            FROM `persona` WHERE `idPersona`=$idPersona";

        $result = mysqli_query($con, $cadena);  // Asegúrate de usar $result aquí, no $datos
        $con->close();

        if ($row = mysqli_fetch_assoc($result)) {
            // Desencriptar los campos necesarios
            $row['cedula'] = $this->decrypt($row['cedula']);
            $row['telefono'] = $this->decrypt($row['telefono']);
            $row['celular'] = $this->decrypt($row['celular']);

            // Otros campos que no requieren desencriptado los dejamos como están
            $row['nombres'] = $row['nombres'];
            $row['apellidos'] = $row['apellidos'];
            $row['direccion'] = $row['direccion'];
            $row['email'] = $row['email'];
            $row['extension'] = $row['extension'];
            $row['estado'] = $row['estado'];

            return $row;
        }
        return null;
    }

    public function insertar($cedula, $nombres, $apellidos, $direccion, $telefono, $extension, $celular, $email, $estado) // Insert into persona (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();

             // Cifrar datos antes de guardar
             $cedula_enc = $this->encrypt($cedula);
             $nombres_enc = $nombres;
             $apellidos_enc = $apellidos;
             $direccion_enc = $direccion;
             $telefono_enc = $this->encrypt($telefono);
             $celular_enc = $this->encrypt($celular);
            //  error_log("tlefono  insert: " . print_r($telefono_enc, true));

             $cadena = "INSERT INTO `persona` (`cedula`, `nombres`, `apellidos`, `direccion`, `telefono`, `extension`, `celular`, `email`, `estado`) 
             VALUES ('$cedula_enc','$nombres_enc','$apellidos_enc','$direccion_enc','$telefono_enc','$extension','$celular_enc','$email','$estado')";

            if (mysqli_query($con, $cadena)) {
                return $con->insert_id;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function actualizar($idPersona, $cedula, $nombres, $apellidos, $direccion, $telefono, $extension, $celular, $email, $estado) // Update persona set ... where id = $idPersona
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `persona` SET `cedula`='$cedula', `nombres`='$nombres', `apellidos`='$apellidos', `direccion`='$direccion', `telefono`='$telefono', `extension`='$extension', `celular`='$celular', `email`='$email', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idPersona`=$idPersona";
            if (mysqli_query($con, $cadena)) {
                return $idPersona;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function eliminar($idPersona) // Delete from persona where id = $idPersona
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();

            // Verificar si existen relaciones con la persona
            $query = "SELECT COUNT(*) as total FROM usuario WHERE idPersona = $idPersona";
            $result = mysqli_query($con, $query);
            $row = mysqli_fetch_assoc($result);
    
            if ($row['total'] > 0) {
                    // devolver un mensaje de error
                    return [
                        'status' => 'error',
                        'message' => 'No se puede eliminar la persona se ha vinculado con usuarios.'
                    ];
                } else {

                $cadena = "DELETE FROM `persona` WHERE `idPersona`= $idPersona";
                if (mysqli_query($con, $cadena)) {
                    return 1;
                } else {
                    return [
                        'status' => 'error',
                        'message' => 'Error al intentar eliminar la Persona.'
                    ];
                }
            }
        } catch (Exception $th) {
            return [
                'status' => 'error',
                'message' => $th->getMessage()
            ];
        } finally {
            $con->close();
        }
    }
}
