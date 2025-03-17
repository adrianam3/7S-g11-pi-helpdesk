<?php
//TODO: Clase de NivelAgente
require_once('../config/config.php');

class NivelAgente
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from nivelAgente
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `nivelAgente`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idNivelAgente) // Select * from nivelAgente where id = $idNivelAgente
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `nivelAgente` WHERE `idNivelAgente`=$idNivelAgente";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $descripcion, $estado) // Insert into nivelAgente (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `nivelAgente` (`nombre`, `descripcion`, `estado`) VALUES ('$nombre','$descripcion','$estado')";
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

    public function actualizar($idNivelAgente, $nombre, $descripcion, $estado) // Update nivelAgente set ... where id = $idNivelAgente
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `nivelAgente` SET `nombre`='$nombre', `descripcion`='$descripcion', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idNivelAgente`=$idNivelAgente";
            if (mysqli_query($con, $cadena)) {
                return $idNivelAgente;
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

    public function eliminar($idNivelAgente) // Delete from nivelAgente where id = $idNivelAgente
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `nivelAgente` WHERE `idNivelAgente`= $idNivelAgente";
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
