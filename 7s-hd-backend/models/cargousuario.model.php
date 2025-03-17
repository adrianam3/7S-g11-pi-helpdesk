<?php
//TODO: Clase de CargoUsuario
require_once('../config/config.php');

class CargoUsuario
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from cargoUsuario
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `cargoUsuario`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idCargoU) // Select * from cargoUsuario where id = $idCargoU
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `cargoUsuario` WHERE `idCargoU`=$idCargoU";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombre, $descripcion, $estado) // Insert into cargoUsuario (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `cargoUsuario` (`nombre`, `descripcion`, `estado`) VALUES ('$nombre','$descripcion','$estado')";
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

    public function actualizar($idCargoU, $nombre, $descripcion, $estado) // Update cargoUsuario set ... where id = $idCargoU
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `cargoUsuario` SET `nombre`='$nombre', `descripcion`='$descripcion', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idCargoU`=$idCargoU";
            if (mysqli_query($con, $cadena)) {
                return $idCargoU;
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

    public function eliminar($idCargoU) // Delete from cargoUsuario where id = $idCargoU
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `cargoUsuario` WHERE `idCargoU`= $idCargoU";
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
