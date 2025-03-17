<?php
//TODO: Clase de Persona
require_once('../config/config.php');

class Persona
{
    //TODO: Implementar los métodos de la clase

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
    
    public function uno($idPersona) // Select * from persona where id = $idPersona
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT persona.*,
        CONCAT(persona.nombres, ' ', persona.apellidos) AS personaNombreCompleto
        FROM `persona` WHERE `idPersona`=$idPersona";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($cedula, $nombres, $apellidos, $direccion, $telefono, $extension, $celular, $email, $estado) // Insert into persona (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `persona` (`cedula`, `nombres`, `apellidos`, `direccion`, `telefono`, `extension`, `celular`, `email`, `estado`) VALUES ('$cedula','$nombres','$apellidos','$direccion','$telefono','$extension','$celular','$email','$estado')";
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
