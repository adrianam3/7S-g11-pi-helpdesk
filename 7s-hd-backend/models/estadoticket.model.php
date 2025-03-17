<?php
//TODO: Clase de EstadoTicket
require_once('../config/config.php');

class EstadoTicket
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from estadoTicket
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `estadoTicket`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idEstadoTicket) // Select * from estadoTicket where id = $idEstadoTicket
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `estadoTicket` WHERE `idEstadoTicket`=$idEstadoTicket";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function estadoById($idEstadoTicket) // Select * from estadoTicket where id = $idEstadoTicket
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $idEstadoTicket = mysqli_real_escape_string($con, $idEstadoTicket);
        $cadena = "SELECT estadoTicket.nombre FROM `estadoTicket` WHERE `idEstadoTicket`=$idEstadoTicket";
        $result = mysqli_query($con, $cadena);
        $con->close();
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            return $row['nombre'];
        } else {
            return null;
        }
    }

    public function idByEstado($nombre)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $nombre = mysqli_real_escape_string($con, $nombre);
        $cadena = "SELECT estadoTicket.idEstadoTicket FROM `estadoTicket` WHERE `nombre`='$nombre'";
        $result = mysqli_query($con, $cadena);
        $con->close();
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            return $row['idEstadoTicket'];
        } else {
            return null;
        }
    }
    

    public function insertar($nombre, $descripcion, $estado) // Insert into estadoTicket (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `estadoTicket` (`nombre`, `descripcion`, `estado`) VALUES ('$nombre','$descripcion','$estado')";
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

    public function actualizar($idEstadoTicket, $nombre, $descripcion, $estado) // Update estadoTicket set ... where id = $idEstadoTicket
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `estadoTicket` SET `nombre`='$nombre', `descripcion`='$descripcion', `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idEstadoTicket`=$idEstadoTicket";
            if (mysqli_query($con, $cadena)) {
                return $idEstadoTicket;
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

    public function eliminar($idEstadoTicket) // Delete from estadoTicket where id = $idEstadoTicket
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `estadoTicket` WHERE `idEstadoTicket`= $idEstadoTicket";
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
