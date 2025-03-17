<?php
//TODO: Clase de FuenteContacto
require_once('../config/config.php');

class FuenteContacto
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from fuenteContacto
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `fuenteContacto`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idfuenteContacto) // Select * from fuenteContacto where id = $idfuenteContacto
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `fuenteContacto` WHERE `idfuenteContacto`=$idfuenteContacto";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $descripcion, $estado) // Insert into fuenteContacto (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `fuenteContacto` (`nombre`, `descripcion`, `estado`) VALUES ('$nombre','$descripcion','$estado')";
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

    public function actualizar($idfuenteContacto, $nombre, $descripcion, $estado) // Update fuenteContacto set ... where id = $idfuenteContacto
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `fuenteContacto` SET `nombre`='$nombre', `descripcion`='$descripcion', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idfuenteContacto`=$idfuenteContacto";
            if (mysqli_query($con, $cadena)) {
                return $idfuenteContacto;
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

    public function eliminar($idfuenteContacto) // Delete from fuenteContacto where id = $idfuenteContacto
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `fuenteContacto` WHERE `idfuenteContacto`= $idfuenteContacto";
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
