<?php
//TODO: Clase de Sla
require_once('../config/config.php');

class Sla
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from sla
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = //"SELECT * FROM `sla`";
            "select s.*, p.nombre prioridadNombre from sla s
            join prioridad p on s.idPrioridad=p.idPrioridad";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idSla) // Select * from sla where id = $idSla
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `sla` WHERE `idSla`=$idSla";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $tiempoRespuesta, $tiempoResolucion, $idHorario, $idPrioridad, $estado) // Insert into sla (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `sla` (`nombre`, `tiempoRespuesta`, `tiempoResolucion`, `idHorario`, `idPrioridad`, `estado`) VALUES ('$nombre','$tiempoRespuesta','$tiempoResolucion','$idHorario','$idPrioridad','$estado')";
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

    public function actualizar($idSla, $nombre, $tiempoRespuesta, $tiempoResolucion, $idHorario, $idPrioridad, $estado) // Update sla set ... where id = $idSla
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `sla` SET `nombre`='$nombre', `tiempoRespuesta`='$tiempoRespuesta', `tiempoResolucion`='$tiempoResolucion', `idHorario`='$idHorario', `idPrioridad`='$idPrioridad', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idSla`=$idSla";
            if (mysqli_query($con, $cadena)) {
                return $idSla;
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

    public function eliminar($idSla) // Delete from sla where id = $idSla
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `sla` WHERE `idSla`= $idSla";
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
