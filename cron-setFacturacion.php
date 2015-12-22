<?php
require_once("../core_nufarm/libs.php");
$ve = new VendedorEstrella();
/**
 * Created by PhpStorm.
 * User: dot175
 * Date: 14/10/2015
 * Time: 12:39 PM
 */
/*

$collection = json_decode(file_get_contents("collection.json"));
unset($collection[0]);

$sql = "SELECT usr.idempresa as empresa, usr.vendedor, usr.strEmpresa, CONCAT(per.nombre,per.apellido)  FROM usuarios as usr LEFT JOIN personal as per GROUP BY strEmpresa ";
$all = $ve->query($sql)->fetchAll();
$array = array (
    'Agosto' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Septiembre' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Octubre' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Noviembre' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Diciembre' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Enero' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Febrero' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Marzo' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Abril' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Mayo' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Junio' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
    'Julio' =>	array ( 'facturacion_total' => 0, 'facturacion_prod_clave' => 0 ),
);

$inicio = "2015-08-01";
$fin = "2016-06-31";

$facturacion = array();
/*
foreach ($all as $k => $v) {
    array_push($facturacion,array(
        ""
    ));
}


echo "<pre>";
print_r($all);
echo "<pre>";
die;*/

$sql = "SELECT idUsuario FROM usuarios";
$idUsers = $ve->query($sql)->fetchAll();

foreach ($idUsers as $k => $v) {
    $pass = substr(md5(rand(10000000,90000000)."string"), 0 , 8);
    $update = "UPDATE usuarios SET strPassword = '".$pass."' WHERE idUsuario = ".$v->idUsuario;
    $ve->query($update);
}

//$collection = $ve->query($sql)->fetchAll();
/*
foreach ($collection as $k => $v) {
    array_push($array, array(

    ));
}
*/
echo "<pre>";
print_r($idUsers);
echo "<pre>";
die;