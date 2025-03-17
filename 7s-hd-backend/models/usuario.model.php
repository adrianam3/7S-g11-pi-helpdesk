<?php
//TODO: Clase de Usuario
require_once('../config/config.php');
require_once('../models/persona.model.php');
class Usuario
{
    
    //TODO: Implementar los métodos de la clase

    // Método para verificar las credenciales del usuario
    public function login($email, $password)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();

        // Escapar variables para proteger contra inyecciones SQL
        $email = mysqli_real_escape_string($con, $email);
        $password = mysqli_real_escape_string($con, $password);

        // Consulta para verificar el email
        $query = "SELECT * FROM `usuario`  
        LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona WHERE `email` = '$email'
        ";

        $result = mysqli_query($con, $query);
        if ($row = mysqli_fetch_assoc($result)) {
            // Verificar si la contraseña es correcta
            if (password_verify($password, $row['password'])) {
                $con->close();
                return $row; // Login exitoso, retornar datos del email
            }
        }

        $con->close();
        return false; // Login fallido
    }
    // public function todos() // Select * from usuario
    public function todos()
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT usuario.*, 
        persona.nombres AS personaNombres, 
        persona.apellidos AS personaApellidos, 
        CONCAT(persona.nombres, ' ', persona.apellidos) AS agenteNombreCompleto,
        persona.email AS personaEmail, 
        rol.nombreRol AS rolNombre,
        areaUsuario.nombre AS areaNombre
        FROM `usuario`
        LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
        LEFT JOIN `rol` ON usuario.idRol = rol.idRol
        LEFT JOIN `areaUsuario` ON usuario.idAreaU = areaUsuario.idAreaU";

        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idUsuario) // Select * from usuario where id = $idUsuario
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `usuario` WHERE `idUsuario`=$idUsuario";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($usuario, $password, $descripcion, $idPersona, $idAreaU, $idRol, $idCargoU, $estado) // Insert into usuario (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $passwordHash = password_hash($password, PASSWORD_BCRYPT); // Encriptar la contraseña
            $cadena = "INSERT INTO `usuario` (`usuario`, `password`, `descripcion`, `idPersona`, `idAreaU`, `idRol`, `idCargoU`, `estado`) VALUES ('$usuario','$passwordHash','$descripcion','$idPersona','$idAreaU','$idRol','$idCargoU','$estado')";
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

    public function actualizar($idUsuario, $usuario, $descripcion, $idPersona, $idAreaU, $idRol, $idCargoU, $estado) // Update usuario set ... where id = $idUsuario
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `usuario` SET `usuario`='$usuario', `descripcion`='$descripcion', `idPersona`='$idPersona', `idAreaU`='$idAreaU', `idRol`='$idRol', `idCargoU`='$idCargoU', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idUsuario`=$idUsuario";
            if (mysqli_query($con, $cadena)) {
                return $idUsuario;
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

    public function actualizarcontrasena($password, $email)
    {
        $persona = new Persona;
        $idPersona = $persona->personaByEmail($email);
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $cadena = "UPDATE `usuario` SET `password`='$passwordHash' WHERE `idPersona`=$idPersona";
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
    public function eliminar($idUsuario) // Delete from usuario where id = $idUsuario
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();

             // Verificar si existen relaciones con el usuario
             $query = "SELECT COUNT(*) as total FROM ticket WHERE idUsuario = $idUsuario";
             $result = mysqli_query($con, $query);
             $row = mysqli_fetch_assoc($result);

             $query1 = "SELECT COUNT(*) as total1 FROM agente WHERE idUsuario = $idUsuario";
             $result1 = mysqli_query($con, $query1);
             $row1 = mysqli_fetch_assoc($result1);
     
             if ($row['total'] > 0 || $row1['total1'] > 0) {
                     // devolver un mensaje de error
                     return [
                         'status' => 'error',
                         'message' => 'No se puede eliminar el Usuario, ya se ha vinculado con Tickets o Agentes'
                     ];
                 } else {
                    $cadena = "DELETE FROM `usuario` WHERE `idUsuario`= $idUsuario";
                    if (mysqli_query($con, $cadena)) {
                        return 1;
                    } else {
                        return [
                            'status' => 'error',
                            'message' => 'Error al intentar eliminar el usuario.'
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
