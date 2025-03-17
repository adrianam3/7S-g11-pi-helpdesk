<?php
//TODO: Clase de TemaAyuda
require_once('../config/config.php');

class TemaAyuda
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from temaAyuda
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `temaAyuda`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idTemaAyuda) // Select * from temaAyuda where id = $idTemaAyuda
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `temaAyuda` WHERE `idTemaAyuda`=$idTemaAyuda";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $descripcion, $idTemaPadre, $estado) // Insert into temaAyuda (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `temaAyuda` (`nombre`, `descripcion`, `idTemaPadre`, `estado`) VALUES ('$nombre','$descripcion',".($idTemaPadre ? "'$idTemaPadre'" : "NULL").",'$estado')";
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

    public function actualizar($idTemaAyuda, $nombre, $descripcion, $idTemaPadre, $estado) // Update temaAyuda set ... where id = $idTemaAyuda
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `temaAyuda` SET `nombre`='$nombre', `descripcion`='$descripcion', `idTemaPadre`=".($idTemaPadre ? "'$idTemaPadre'" : "NULL").", `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idTemaAyuda`=$idTemaAyuda";
            if (mysqli_query($con, $cadena)) {
                return $idTemaAyuda;
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

    public function eliminar($idTemaAyuda) // Delete from temaAyuda where id = $idTemaAyuda
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `temaAyuda` WHERE `idTemaAyuda`= $idTemaAyuda";
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
