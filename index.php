<?php
	@ob_start();
	@session_start();
	require_once('../core_nufarm/libs.php');

	if (!isset($_SESSION['MM_IdUsuario'])) {
		header('Location: /');
		exit;
	}



	$user = Auth::User();
	$ve = new VendedorEstrella();

	//$ve->hasOtherPeriod($user->idUsuario);

	/*if(!$ve->hasFacturacion()):
		$ve->initFactUser($user->idUsuario, $user->vendedor);
	endif;*/

	$facturacion = $ve->getFacturacionById();
	$fact_data = json_decode($facturacion->data);
	$lastPeriod = $ve->prevPeriod($user->idUsuario);
	$fact_total_per = VendedorEstrella::calcFactTotal($facturacion->fact_total, ($lastPeriod ? $lastPeriod->total : 0) );
	$fact_total_clave_per = VendedorEstrella::calcFactTotalClave($facturacion->fact_total, $facturacion->fact_prod_clave);

	$cat_prize = $ve->getPrizeCategory($fact_total_per,$fact_total_clave_per);

 ?>




<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<title>Nufarm Maxx</title>

		<!-- librerías opcionales que activan el soporte de HTML5 para IE8 -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->

		<!-- CSS de Bootstrap -->
		<link href="assets/bootstrap-3.3.4/css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="assets/bootstrap-3.3.4/css/bootstrap-social.css" rel="stylesheet" media="screen">

		<!-- CSS de font-awesome-4.3.0 para iconos sociales-->
		<link href="assets/fonts/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet" media="screen">
		
		<!-- Librería jS -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script src="assets/bootstrap-3.3.4/js/bootstrap.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
		<script src="assets/js/eventos.js"></script>
		<script src="assets/js/jquery.canvasjs.min.js"></script>
		
		<!-- CSS -->
		<link href="assets/css/estilos.css?v=01" rel="stylesheet" media="screen">
	</head>
	<body>
		<div class="container-fluid">
			<section id="header">
				<div class="row">
					<div class="col-xs-12 header">
						<div class="inner">
							<div class="row">
								<div class="col-xs-6">
									<img src="assets/images/Nufarm-max-logo.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
									<?php if($user->gold == 1): ?>
									<img src="assets/images/green.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
									<?php endif; ?>
								</div>

								<div class="col-xs-6 controls">
									<div class="logout">
										<a href="logout.php">
											<img src="assets/images/cerrar.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
										<p class="text-uppercase">salir</p>
										</a>
									</div>

									<div class="switcher">
							 			<img class="icon-select " src="assets/images/flecha-select.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
						 				<select class="form-control" id="select-navigator">
									  		<option value="/">HOME</option>
									  		<!--<option value="/marketingNet">MARKETING NET</option>-->
									  		<option selected="">VENDEDOR ESTRELLA</option>
											<?php if($user->gold == 1): ?>
												<!--<option value="/plan-de-negocios">PLAN DE NEGOCIOS</option>-->
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
							<div class="row">
								<div class="filters">
									<div class="col-xs-6">
										<p>
											facturación
										</p>
									</div>
									<div class="col-xs-6">
										<select name="">   
					                		<option value="">FACTURACION <?php echo VendedorEstrella::formatCurrentPeriod($facturacion->periodo_inicial, $facturacion->periodo_final ); ?></option>
							           	</select>
									</div>
								</div><!-- end .filters -->
							</div>
							<div class="data">
								<div class="col-xs-12">
									<div class="row">
										<h3>
											<?php echo $user->strEmpresa ?>
										</h3>
										<section class="boxes">
											<div class="col-xs-6 col-sm-3"> 
												<div class="box">
													<div class="top">
														<p>
															<?php VendedorEstrella::formatNumbers(( $lastPeriod ? $lastPeriod->total : 0 )) ?>

														</p>
													</div>
													<div class="bot">
														<span>
															Facturación Total Período anterior
														</span>
													</div>

												</div>
											</div>
											<?php  ?>

											<div class="col-xs-6 col-sm-3"> 
												<div class="box">
													<div class="top">
														<p>
															<?php echo $fact_total_per ?>%
															<br>
															<span>
																<?php echo VendedorEstrella::formatNumbers($facturacion->fact_total) ?>
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
											<div class="col-xs-6 col-sm-3"> 
												<div class="box"> 
													<div class="top">
														<p>
															<?php echo $fact_total_clave_per ?>%
															<br>
															<span>
																<?php echo VendedorEstrella::formatNumbers($facturacion->fact_prod_clave) ?>
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
											<div class="col-xs-6 col-sm-3">
												<div class="box">
													<div class="top">
														<p>
															<?php echo $cat_prize ?>
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
															<td colspan="6" align="left" valign="middle"><p>2016</p></td>
														</tr>
														<tr class="mons">
															<td align="left" valign="middle">&nbsp;</td>
															<?php foreach($fact_data as $k => $v): ?>
															<td width="8.5%" align="left" valign="middle"><p><?php echo $k; ?></p></td>
															<?php endforeach; ?>
														
															
														</tr>
														<tr>
															<td align="center" valign="middle" class="key"><p>p. total</p></td>
															<?php foreach($fact_data as $k => $v): ?>
															<td align="center" valign="middle" class="input"><p><?php VendedorEstrella::formatNumbers($v->facturacion_total) ?></p></td>
															<?php endforeach; ?>
															
														</tr>
														<tr>
															<td align="center" valign="middle" class="key"><p>p. clave</p></td>
															<?php foreach($fact_data as $k => $v): ?>
															<td align="center" valign="middle" class="input"><p><?php VendedorEstrella::formatNumbers($v->facturacion_prod_clave) ?></p></td>
															<?php endforeach; ?>
														</tr>
													</table>
												</div>
											</div>
										</section><!-- end tables -->

										<section class="prog-bar">
											<h4>
												premio
											</h4>
											<div class="row">
												<div class="col-xs-12">
													<div class="row">
														<div class="col-xs-3 prog-position">
															<div>
																<p>
																	0
																</p>
															</div>
														</div>
													<?php /*if($cat_prize == 1): ?>
														<div class="col-xs-3 prog-position" id="position-1">
															<div class="icon">
																<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In  -->
																<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" viewBox="0 0 104 104" xml:space="preserve">
																<style type="text/css">
																	.st0{opacity:0.6;}
																	.st1{opacity:0.3;fill:none;stroke:#666666;stroke-miterlimit:10;}
																</style>
																<defs>
																</defs>
																<g>
																	<g class="st0">
																		<g>
																			<g>
																				<path d="M68,21.5H16.5c-0.3,0-0.6,0.2-0.6,0.5v29.9c0,0.3,0.3,0.5,0.6,0.5h19.9h0.6h0.6l-0.2,2.8H47l-0.2-2.8h0.6h0.6H68
																					c0.3,0,0.6-0.2,0.6-0.5V22C68.6,21.7,68.3,21.5,68,21.5z M66.1,49.5c0,0.2-0.2,0.5-0.5,0.5H49h-0.6h-0.6H36.9h-0.6h-0.6H18.9
																					c-0.3,0-0.5-0.2-0.5-0.5V24.1c0-0.2,0.2-0.5,0.5-0.5h46.7c0.3,0,0.5,0.2,0.5,0.5V49.5L66.1,49.5z"/>
																				<path d="M49.7,57.5v-0.7c0-0.3-0.2-0.5-0.5-0.5h-0.8h-0.6h-0.6h-9.6h-0.6h-0.6h-0.8c-0.3,0-0.5,0.2-0.5,0.5v0.7
																					c0,0.3,0.2,0.5,0.5,0.5h0.7h12.4h0.7C49.4,58.1,49.7,57.8,49.7,57.5z"/>
																			</g>
																		</g>
																	</g>
																	<g class="st0">
																		<path d="M92,78.7h-2.3c0.2-0.3,0.3-0.6,0.3-1V57.5c0-1-0.8-1.7-1.7-1.7H56.3c-1,0-1.7,0.8-1.7,1.7v20.2c0,0.4,0.1,0.7,0.3,1h-2.4
																			c0,0-0.1,0.1,0.2,0.4c0.8,0.8,2.6,1.1,2.6,1.1l33.5,0c0,0,2.2,0,3-1.1C92.2,78.7,92,78.7,92,78.7z M74.5,79.1H70v-0.3h4.5V79.1
																			L74.5,79.1z M88.7,77.3H56.8V57.9h30.9v19.4H88.7z"/>
																	</g>
																</g>
																<circle class="st1" cx="52" cy="52" r="51.5"/>
																</svg>
															</div>
															<p>
																1
															</p>
														</div>
													<?php elseif($cat_prize == 2): ?>
														<div class="col-xs-3 prog-position" id="position-2">
															<div class="icon">
																<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In  -->
																<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" viewBox="0 0 104 104" xml:space="preserve">
																<style type="text/css">
																	.st0{opacity:0.6;}
																	.st1{opacity:0.3;fill:none;stroke:#666666;stroke-miterlimit:10;}
																</style>
																<defs>
																</defs>
																<g>
																	<g class="st0">
																		<g>
																			<g>
																				<path d="M68,21.5H16.5c-0.3,0-0.6,0.2-0.6,0.5v29.9c0,0.3,0.3,0.5,0.6,0.5h19.9h0.6h0.6l-0.2,2.8H47l-0.2-2.8h0.6h0.6H68
																					c0.3,0,0.6-0.2,0.6-0.5V22C68.6,21.7,68.3,21.5,68,21.5z M66.1,49.5c0,0.2-0.2,0.5-0.5,0.5H49h-0.6h-0.6H36.9h-0.6h-0.6H18.9
																					c-0.3,0-0.5-0.2-0.5-0.5V24.1c0-0.2,0.2-0.5,0.5-0.5h46.7c0.3,0,0.5,0.2,0.5,0.5V49.5L66.1,49.5z"/>
																				<path d="M49.7,57.5v-0.7c0-0.3-0.2-0.5-0.5-0.5h-0.8h-0.6h-0.6h-9.6h-0.6h-0.6h-0.8c-0.3,0-0.5,0.2-0.5,0.5v0.7
																					c0,0.3,0.2,0.5,0.5,0.5h0.7h12.4h0.7C49.4,58.1,49.7,57.8,49.7,57.5z"/>
																			</g>
																		</g>
																	</g>
																	<g class="st0">
																		<path d="M92,78.7h-2.3c0.2-0.3,0.3-0.6,0.3-1V57.5c0-1-0.8-1.7-1.7-1.7H56.3c-1,0-1.7,0.8-1.7,1.7v20.2c0,0.4,0.1,0.7,0.3,1h-2.4
																			c0,0-0.1,0.1,0.2,0.4c0.8,0.8,2.6,1.1,2.6,1.1l33.5,0c0,0,2.2,0,3-1.1C92.2,78.7,92,78.7,92,78.7z M74.5,79.1H70v-0.3h4.5V79.1
																			L74.5,79.1z M88.7,77.3H56.8V57.9h30.9v19.4H88.7z"/>
																	</g>
																</g>
																<circle class="st1" cx="52" cy="52" r="51.5"/>
																</svg>
															</div>
															<p>
																2
															</p>
														</div>
													<?php elseif($cat_prize == 3): ?>
														<div class="col-xs-3 prog-position" id="position-3">
															<div class="icon">
																<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In  -->
																<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" viewBox="0 0 104 104" xml:space="preserve">
																<style type="text/css">
																	.st0{opacity:0.6;}
																	.st1{opacity:0.3;fill:none;stroke:#666666;stroke-miterlimit:10;}
																</style>
																<defs>
																</defs>
																<g>
																	<g class="st0">
																		<g>
																			<g>
																				<path d="M68,21.5H16.5c-0.3,0-0.6,0.2-0.6,0.5v29.9c0,0.3,0.3,0.5,0.6,0.5h19.9h0.6h0.6l-0.2,2.8H47l-0.2-2.8h0.6h0.6H68
																					c0.3,0,0.6-0.2,0.6-0.5V22C68.6,21.7,68.3,21.5,68,21.5z M66.1,49.5c0,0.2-0.2,0.5-0.5,0.5H49h-0.6h-0.6H36.9h-0.6h-0.6H18.9
																					c-0.3,0-0.5-0.2-0.5-0.5V24.1c0-0.2,0.2-0.5,0.5-0.5h46.7c0.3,0,0.5,0.2,0.5,0.5V49.5L66.1,49.5z"/>
																				<path d="M49.7,57.5v-0.7c0-0.3-0.2-0.5-0.5-0.5h-0.8h-0.6h-0.6h-9.6h-0.6h-0.6h-0.8c-0.3,0-0.5,0.2-0.5,0.5v0.7
																					c0,0.3,0.2,0.5,0.5,0.5h0.7h12.4h0.7C49.4,58.1,49.7,57.8,49.7,57.5z"/>
																			</g>
																		</g>
																	</g>
																	<g class="st0">
																		<path d="M92,78.7h-2.3c0.2-0.3,0.3-0.6,0.3-1V57.5c0-1-0.8-1.7-1.7-1.7H56.3c-1,0-1.7,0.8-1.7,1.7v20.2c0,0.4,0.1,0.7,0.3,1h-2.4
																			c0,0-0.1,0.1,0.2,0.4c0.8,0.8,2.6,1.1,2.6,1.1l33.5,0c0,0,2.2,0,3-1.1C92.2,78.7,92,78.7,92,78.7z M74.5,79.1H70v-0.3h4.5V79.1
																			L74.5,79.1z M88.7,77.3H56.8V57.9h30.9v19.4H88.7z"/>
																	</g>
																</g>
																<circle class="st1" cx="52" cy="52" r="51.5"/>
																</svg>
															</div>
															<p>
																3
															</p>
														</div>
													<?php endif;*/ ?>
													</div><!-- end progress positions -->
													<div class="progress">
													  	<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:<?php echo VendedorEstrella::widthBar($cat_prize) ?>%" id="graph">
													  		<img src="assets/images/progresbg.png" class="img-responsive">
												    		<span class="sr-only"><?php echo VendedorEstrella::widthBar($cat_prize) ?>% Complete</span>
													  	</div>
													</div>
													<div class="row">
														<div class="col-xs-12 indicator">
															<p>
																estos son tus resultados
																<br> 
																al día de hoy, 
																<br>
																sigamos trabajando juntos 
																<br>
																para acceder 
																<br>
																a los máximos premios.
															</p>
														</div>
													</div>
												</div>
											</div>
										</section><!-- end .prog-bar -->
									</div>
								</div>
							</div><!-- end .data -->
						</div>
					</div><!-- end .inner -->
				</div>
			</section><!-- end #content -->
		</div>

		<div class="footer" style="position: relative;">
            <img src="assets/images/Nufarm-max-logo-verde.png" id="Nufarm" title="Nufarm" alt="Imagen no encontrada">
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