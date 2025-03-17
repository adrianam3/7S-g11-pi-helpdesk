<?php
//TODO: Clase de DepartamentoAgente
require_once('../config/config.php');

class DepartamentoAgente
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from departamentoAgente
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `departamentoAgente`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idDepartamentoA) // Select * from departamentoAgente where id = $idDepartamentoA
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `departamentoAgente` WHERE `idDepartamentoA`=$idDepartamentoA";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $descripcion, $idUsuarioAdmin, $estado) // Insert into departamentoAgente (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `departamentoAgente` (`nombre`, `descripcion`, `idUsuarioAdmin`, `estado`) VALUES ('$nombre','$descripcion','$idUsuarioAdmin','$estado')";
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

    public function actualizar($idDepartamentoA, $nombre, $descripcion, $idUsuarioAdmin, $estado) // Update departamentoAgente set ... where id = $idDepartamentoA
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `departamentoAgente` SET `nombre`='$nombre', `descripcion`='$descripcion', `idUsuarioAdmin`='$idUsuarioAdmin', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idDepartamentoA`=$idDepartamentoA";
            if (mysqli_query($con, $cadena)) {
                return $idDepartamentoA;
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

    public function eliminar($idDepartamentoA) // Delete from departamentoAgente where id = $idDepartamentoA
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `departamentoAgente` WHERE `idDepartamentoA`= $idDepartamentoA";
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
