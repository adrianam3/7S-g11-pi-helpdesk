<?php
//TODO: Clase de Horario
require_once('../config/config.php');

class Horario
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from horario
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `horario`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idHorario) // Select * from horario where id = $idHorario
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `horario` WHERE `idHorario`=$idHorario";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $estado) // Insert into horario (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `horario` (`nombre`, `estado`) VALUES ('$nombre','$estado')";
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

    public function actualizar($idHorario, $nombre,  $estado) // Update horario set ... where id = $idHorario
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `horario` SET `nombre`='$nombre', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idHorario`=$idHorario";
            if (mysqli_query($con, $cadena)) {
                return $idHorario;
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

    public function eliminar($idHorario) // Delete from horario where id = $idHorario
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `horario` WHERE `idHorario`= $idHorario";
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
