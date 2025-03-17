<?php
//TODO: Clase de Agente
require_once('../config/config.php');

class Agente
{
    //TODO: Implementar los métodos de la clase

    // public function todos() // Select * from agente
    // {
    //     $con = new ClaseConectar();
    //     $con = $con->ProcedimientoParaConectar();
    //     $cadena = "SELECT * FROM `agente`";
    //     $datos = mysqli_query($con, $cadena);
    //     $con->close();
    //     return $datos;
    // }
    public function todos()
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT agente.*, 
        usuario.usuario AS usuarioNombre,
        CONCAT(persona.nombres, ' ', persona.apellidos) AS agenteNombreCompleto
        FROM `agente`
        LEFT JOIN `usuario` ON agente.idUsuario = usuario.idUsuario
        LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
        ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }
    public function todosByDepartamento($idDepatamentoA)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT agente.*, 
       CONCAT(persona.nombres, ' ', persona.apellidos) AS agenteNombreCompleto
        FROM `agente`
        LEFT JOIN `usuario` ON agente.idUsuario = usuario.idUsuario
        LEFT JOIN `AgenteDepartamento` ON agente.idAgente = AgenteDepartamento.idAgente
        LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
        WHERE AgenteDepartamento.idDepartamentoA = $idDepatamentoA;";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function agenteByUsuario($idUsuario)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT agente.idAgente
        FROM `agente`
        LEFT JOIN `usuario` ON agente.idUsuario = usuario.idUsuario
        WHERE usuario.idUsuario = $idUsuario;";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }


    public function uno($idAgente) // Select * from agente where id = $idAgente
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT agente.*,
        CONCAT(persona.nombres, ' ', persona.apellidos) AS agenteNombreCompleto,
        persona.email AS agenteEmail
        FROM `agente` 
        LEFT JOIN `usuario` ON agente.idUsuario = usuario.idUsuario
        LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
        WHERE `idAgente`=$idAgente";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($agente, $descripcion, $idUsuario, $idNivelAgente, $estado) // Insert into agente (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `agente` (`agente`, `descripcion`, `idUsuario`, `idNivelAgente`, `estado`) VALUES ('$agente','$descripcion','$idUsuario','$idNivelAgente','$estado')";
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

    public function actualizar($idAgente, $agente, $descripcion, $idUsuario, $idNivelAgente, $estado) // Update agente set ... where id = $idAgente
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `agente` SET `agente`='$agente', `descripcion`='$descripcion', `idUsuario`='$idUsuario', `idNivelAgente`='$idNivelAgente', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idAgente`=$idAgente";
            if (mysqli_query($con, $cadena)) {
                return $idAgente;
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

    public function eliminar($idAgente) // Delete from agente where id = $idAgente
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `agente` WHERE `idAgente`= $idAgente";
            if (mysqli_query($con, $cadena)) {
                return 1;
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
}
