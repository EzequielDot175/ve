<?php
	@ob_start();
	@session_start();
	require_once('../../core_nufarm/libs.php');

	if (!isset($_SESSION['logged_id'])) {
		header('Location: /control');
		exit;
	}



	$user = Auth::UserAdmin();
	$ve = new VendedorEstrella();

 ?>




<!DOCTYPE html>
<html lang="es" ng-app="ve">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="auth-role" content="<?php echo $user->role ?>">
		<meta name="auth" content="<?php echo $user->id ?>">
		<title>Nufarm Maxx</title>

		<!-- librerías opcionales que activan el soporte de HTML5 para IE8 -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->

		<!-- CSS de Bootstrap -->
		<link href="../assets/bootstrap-3.3.4/css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="../assets/bootstrap-3.3.4/css/bootstrap-social.css" rel="stylesheet" media="screen">
		<link rel="stylesheet" href="../assets/css/canvas.css">

		<!-- CSS de font-awesome-4.3.0 para iconos sociales-->
		<link href="../assets/fonts/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet" media="screen">
		
		<!-- Librería jS -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script src="../assets/bootstrap-3.3.4/js/bootstrap.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
		<script src="../assets/js/eventos.js"></script>

		<!-- CSS -->
		<link href="../assets/css/admin.css?v=02" rel="stylesheet" media="screen">
	</head>
	<body>
		<div class="container-fluid" ng-controller="CtrlFilter">
			<section id="header">
				<div class="row">
					<div class="col-xs-12 header">
						<div class="inner">
							<div class="row">
								<div class="col-xs-6">
									<img src="../assets/images/Nufarm-max-logo.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
									<?php if($user->gold == 1): ?>
									<img src="../assets/images/green.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
									<?php endif; ?>
								</div>

								<div class="col-xs-6 controls">
									<div class="logout">
										<a href="/logout.php?type=1">
											<img src="../assets/images/cerrar.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
										<p class="text-uppercase">salir</p>
										</a>
									</div>

									<div class="switcher">
							 			<img class="icon-select " src="../assets/images/flecha-select.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
						 				<select class="form-control" id="select-navigator">
									  		<option value="/control">HOME</option>
									  		<!--<option value="/marketingNet">MARKETING NET</option>-->
									  		<option selected="">VENDEDOR ESTRELLA</option>
											<?php if($user->gold == 1): ?>
												<!--<option value="/plan-de-negocios">PLAN DE NEGOCIOS</option-->
											<?php endif; ?>
										</select>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</section><!-- end #header -->

			<section id="content">
				<div class="row">
					<div class="inner">
						<div class="col-xs-12">
							<div class="menu">
								<ul>
									<li class="active">
										<a href="#">
											facturación
										</a>
									</li>
									<!--<li>
										<a href="#">
											premios
										</a>
									</li>-->
								</ul>
							</div>
						</div>

						<div class="col-xs-12">

							<div class="filters">
								<div>
									<p>
										filtrar por:
									</p>

									<select name="vendedor"  ng-model="vendedores"  ng-change="setClientes()" ng-show="isAdmin">
										<option value="">TODOS LOS VENDEDORES</option>
										<option value="{{v.id}}" ng-repeat="(k, v) in selVendedores">{{v.nombre}} {{v.apellido}}</option>
									</select>

									<select  name="clientes" ng-model="clientes" id=""> 
										<option class="text-uppercase" value="">TODOS LOS CLIENTES</option>
										<option class="text-uppercase" value="{{v.id}}" ng-repeat="(k, v) in selClientes" ng-if="v.strEmpresa != ''">{{v.strEmpresa}}</option>
									</select>
									
									<select name="date" ng-model="filter_date" ng-options="val.value as val.text for val in selFilterDate" ng-change="trigger();">
										<option value="">FACTURACIÓN</option>
									</select>
									
									<button class="button-image" type="submit" ng-click="submitFilter()"><img src="../assets/images/ver.png" alt=""> VER RESULTADOS </button>
								</div>
							</div><!-- end .filters -->

							<div  class="col-xs-12 period">
								<div class="row">
									<div class="col-xs-12">
										<p class="title title-period">
											{{selFilterDate[0].text}}
										</p>
									</div>
									<div class="col-xs-12 data-collapse" ng-show="inEdit">
										<p class="panel-title">
											{{current_company_name}}
										</p>
										<section class="boxes">
											<div class="col-xs-6 col-sm-3" ng-show="!closedPeriod">
												<div class="box">
													<div class="top">
														<p>
															{{fact_total_anterior | number:0 | reverse}}
														</p>
													</div>
													<div class="bot">
														<span>
															Facturación Total Período anterior
														</span>
													</div>

												</div>
											</div>
											<div class="col-xs-6 col-sm-3" ng-show="!closedPeriod">
												<div class="box">
													<div class="top">
														<p>
															{{avance_producto}}%
															<br>
															<span>
																{{fact_curr_total | number:0 | reverse}}
															</span>
														</p>
													</div>
													<div class="bot">
														<span>
															Avance Facturación Total en relación al Período anterior
														</span>
													</div>
												</div>
											</div>
											<div class="col-xs-6 col-sm-3" ng-show="inEdit">
												<div class="box">
													<div class="top">
														<p>
															{{facturacion_prod_clave_percent}}%
															<br>
															<span>
																{{facturacion_prod_clave  | number:0 | reverse}}
															</span>
														</p>
													</div>
													<div class="bot">
														<span>
															Facturación Productos Clave
														</span>
													</div>
												</div>
											</div>
											<div class="col-xs-6 col-sm-3" ng-show="inEdit">
												<div class="box">
													<div class="top">
														<p>
															{{accede_categoria}}
														</p>
													</div>
													<div class="bot">
														<span>
															Al momento accede
															<br>
															a categoría
														</span>
													</div>
												</div>
											</div>
										</section><!-- end .boxes -->
										<section class="graph tables">
											<h4>
												Avance Anual
											</h4>
											<canvas id="nufarm" width="1000" height="300" ng-mousemove="canvas.displayinfo($event)">
												Tu navegador no soporta este grafico, Intenta usar Google Chrome o Mozilla Firefox
											</canvas>
										</section>
										<section class="tables">
											<h4>
												avance mensual
											</h4>
											<div class="row">
												<div class="col-xs-12">
													<table width="100%" border="0" cellspacing="0" cellpadding="0">
														<tr class="yrs">
															<td width="8%" align="left" valign="middle">&nbsp;</td>
															<td colspan="5" align="left" valign="middle"><p>2015</p></td>
															<td colspan="3" align="left" valign="middle"><p>2016</p></td>
															<td width="4%" align="left" valign="middle">&nbsp;</td>
														</tr>
														<tr class="mons">
															<td align="left" valign="middle">&nbsp;</td>
															<td width="8.5%" align="left" valign="middle" ng-repeat="(k,v) in meses"><p>{{k}}</p></td>
															<td align="left" valign="middle">&nbsp;</td>
														</tr>
														<tr>
															<td align="center" valign="middle" class="key"><p>p. total</p></td>
															<td align="center" valign="middle" class="input"  ng-repeat="(k,v) in meses">
																<input ng-model="meses[k].total" class="input-fact" type="text" ng-disabled="v.disabled" value="{{v.total}}">
															</td>
															<td align="center" valign="middle" class="edit">
																<a ng-click="updateFacturacion()" ng-show="isAdmin">
																	<i class="fa fa-check"></i>
																</a>
															</td>
														</tr>
														<tr>
															<td align="center" valign="middle" class="key"><p>p. clave</p></td>
															<td align="center" valign="middle" class="input"  ng-repeat="(k,v) in meses">
																<input ng-model="meses[k].total_prod_clave" class="input-fact" ng-disabled="v.disabled" type="text" value="{{v.total_prod_clave}}">
															</td>

															<td align="center" valign="middle" class="edit">
																<a ng-click="updateFacturacion()"  ng-show="isAdmin">
																	<i class="fa fa-check"></i>
																</a>
															</td>
														</tr>
													</table>
												</div>
											</div>
										</section><!-- end tables -->
										

									</div>
								</div>

							</div>

							<div class="data">
								<div class="col-xs-12">
									<div class="row">

										<section class="boxes" ng-show="!inEdit">
											<div class="col-xs-6 col-sm-3" ng-show="!closedPeriod">
												<div class="box">
													<div class="top">
														<p>
															{{fact_curr_total | number:0 | reverse}}
														</p>
													</div>
													<div class="bot">
														<span>
															Subtotal <br>
															Facturacion total
														</span>
													</div>

												</div>
											</div>
											<div class="col-xs-6 col-sm-3" ng-show="!closedPeriod">
												<div class="box">
													<div class="top">
														<p>
															{{fact_curr_total_clave_percent}}%
														</p>
													</div>
													<div class="bot">
														<span>
															Subtotal <br>
															Facturacion Productos Clave
														</span>
													</div>
												</div>
											</div>
										</section>
										<section class="tables ">
											<!--<input type="text" ng-model="searchCompany">-->
											<div class="row">
												<div class="col-xs-12">
													<table width="100%" border="0" cellspacing="0" cellpadding="0">
														<tr class="t-head">
															<td width="12%" align="left" valign="middle"><p class="text-center">RTC NUFARM</p></td>
															<td width="14%" align="left" valign="middle"><p class="text-center">EMPRESA</p></td>
															<td width="11%" align="left" valign="middle"><p class="text-center">TIPO DE CLIENTE</p></td>
															<td width="5%" align="left" valign="middle"><p class="text-center">FACTURACIÓN TOTAL PERÍODO 2014/2015</p></td>
															<td width="5%" align="left" valign="middle"><p class="text-center">FACTURACIÓN TOTAL PERÍODO 2015/1016 </p></td>
															<td width="11%" align="left" valign="middle"><p class="text-center">FACTURACIÓN PRODUCTOS CLAVE 2015/2016 </p></td>
															<td width="11%" align="left" valign="middle"><p class="text-center">% DE FACTURACIÓN DE PRODUCTOS CLAVE</p></td>
															<td width="5%" align="left" valign="middle"><p class="text-center">AVANCE FACTURACIÓN TOTAL PERÍODO 2015/2016 VS PERÍODO 2014/2015</p></td>
															<td width="1%" align="left" valign="middle"><p class="text-center">CATEGORÍA DE PREMIO A LA QUE ACCEDE ACTUALMENTE</p></td>
															<td width="4%" align="left" valign="middle">&nbsp;</td>
														</tr>
														<tr ng-repeat="(k, v ) in resultados | orderBy:'cliente' ">
															<td align="center" valign="middle" class="rtc"><p>{{v.vendedor}}</p></td>
															<td align="center" valign="middle" class="empresa"><p>{{v.cliente}}</p></td>
															<td align="center" valign="middle" class="tipo-cliente"><p>{{v.gold}}</p></td>
															<td align="center" valign="middle" class="periodo-prev"><p>{{v.ultimo_total | number:0 | reverse}}</p></td>
															<td align="center" valign="middle" class="total-fact"><p>{{v.total | number:0 | reverse}}</p></td>
															<td align="center" valign="middle" class="total-fact"><p>{{v.total_prod_clave | number:0 | reverse}}</p></td>
															<td align="center" valign="middle" class="avance"><p>{{prodClave(v.total,v.total_prod_clave)}}%</p></td>
															<td align="center" valign="middle" class="avance"><p>{{avancetotal(v.total, v.ultimo_total)}}%</p></td>
															<td align="center" valign="middle" class="cat"><p>{{categoria(v.total_prod_clave, v.total , v.ultimo_total)}}</p></td>
															<td align="center" valign="middle" class="edit" ng-show="!v.currentItemEdit">
																<a ng-show="!v.closedPeriod" ng-click="editItem(k,v)">
																	<i class="fa fa-pencil"></i>
																</a>
															</td>
														</tr>

													</table>
												</div>
											</div>
										</section><!-- end tables -->

									</div>
								</div>
							</div><!-- end .data -->

							<!-- VeGraph -->
							<!--<div class="graph" >
								<canvas id="nufarm"  width="800" height="300">

								</canvas>

								<div id="box-nufarm-canvas">
										<span id="percent-box-nufarm">
											0%
										</span>
										<span id="number-box-nufarm">
											0
										</span>
								</div>
							</div>-->
							<!-- VeGraph -->
						</div>
					</div><!-- end .inner -->
				</div>
			</section><!-- end #content -->
		</div>

		<script src="../js/angular/angular.min.js"></script>
		<script src="../js/angular/app.js"></script>
		<script src="../js/graph.js"></script>
		<script src="../js/angular/directives.js"></script>
		<script src="../js/angular/services.js"></script>
		<script src="../js/angular/filters.js"></script>
		<script src="../js/angular/controllers/ctrlFilter.js"></script>

		<div class="footer" style="position: relative;">
            <img src="../assets/images/Nufarm-max-logo-verde.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
         </div>
		<script>
		jQuery(document).ready(function($) {
			$('#select-navigator').change(function(event) {
				if ($(this).val() != "") {
					window.location.href = $(this).val();
				};
			});
		});
		</script>

	</body>
</html>