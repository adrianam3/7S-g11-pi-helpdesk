<?php
//TODO: Clase de BaseConocimientos
require_once('../config/config.php');

class BaseConocimientos
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from BaseConocimientos
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `BaseConocimientos`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idArticulo) // Select * from BaseConocimientos where id = $idArticulo
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `BaseConocimientos` WHERE `idArticulo`=$idArticulo";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($titulo, $contenido, $idCategoria, $idAutor, $estado) // Insert into BaseConocimientos (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `BaseConocimientos` (`titulo`, `contenido`, `idCategoria`, `idAutor`, `estado`) 
                       VALUES ('$titulo', '$contenido', ".($idCategoria ? "'$idCategoria'" : "NULL").", '$idAutor', '$estado')";
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

    public function actualizar($idArticulo, $titulo, $contenido, $idCategoria, $idAutor, $estado) // Update BaseConocimientos set ... where id = $idArticulo
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `BaseConocimientos` SET 
                        `titulo`='$titulo', 
                        `contenido`='$contenido', 
                        `idCategoria`=".($idCategoria ? "'$idCategoria'" : "NULL").", 
                        `idAutor`='$idAutor', 
                        `estado`='$estado', 
                        `fechaModificacion`=CURRENT_TIMESTAMP 
                        WHERE `idArticulo`=$idArticulo";
            if (mysqli_query($con, $cadena)) {
                return $idArticulo;
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

    public function eliminar($idArticulo) // Delete from BaseConocimientos where id = $idArticulo
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `BaseConocimientos` WHERE `idArticulo`= $idArticulo";
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
