app.controller('CtrlFilter', ['$scope','ajax','$rootScope','$filter', function(scope,ajax,root,$filter) {

	scope.vendedores = "";
	scope.clientes = "";
	scope.filter_date = "";
	scope.selVendedores = [];
	scope.selClientes = [];
	scope.selFilterDate = [];
	scope.resultados = [];
	scope.categorias_premios = [];
	scope.facturacion_total = 0;
	scope.facturacion_prod_clave = 0;
	scope.isAdmin = false;
	scope.canEdit = false;
	scope.inEdit = false;
	scope.inEditItemData = [];
	scope.chart = [];
	scope.id_current_edit = 0;
	scope.avance_producto = 0;
	scope.accede_categoria = 0;
	scope.fact_total_anterior = 0;
	scope.fact_curr_total = 0;
	scope.start_app = false;
	scope.facturacion_prod_clave_percent = 0;
	scope.closedPeriod = false;
	scope.fact_curr_total_clave_percent = 0;
	scope.fact_curr_total_clave = 0;
	scope.current_company_name = "";
	scope.canvas = new veCanvas();

	scope.periodMonthData = {
		current: null,
		next: null
	}

	/**
	 * Scope meses
	 */


	scope.canvas.setWorkSpace({
		paddingLeft: 90,
		paddingBottom: 70,
		paddingTop: 15
	});
	scope.canvas.setColumnProperties({hColumn: 80});





	scope.meses = {};

	scope.monthOriginal = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
	scope.monthPeriod = ["agosto", "septiembre", "octubre", "noviembre", "diciembre", "enero", "febrero", "marzo"];


	angular.forEach(scope.monthPeriod, function (element, index) {

		scope.meses[element] = {
			total: 0,
			total_prod_clave: 0,
			disabled: true
		}
	});


	var user = root.user;

	if (user.role != 3) {
		scope.isAdmin = true;
	};

	if (user.role != 3) {
		ajax.ve({method: 'vendedores', user: user}, function (a) {

			scope.selVendedores = a;
		});
	};

	ajax.ve({method: 'periodos'}, function (a) {
		var inicio = $filter('date')(a.inicio, 'yyyy');
		var fin = $filter('date')(a.fin, 'yyyy');
		scope.selFilterDate = [{value: a.inicio + "_" + a.fin, text: "FACTURACION " + inicio + "/" + fin}];
		scope.filter_date = a.inicio + "_" + a.fin;
		scope.submitFilter();
	});

	ajax.ve({method: 'clientes', user: user}, function (a) {
		scope.selClientes = a;
	});

	ajax.ve({method: 'catPremios'}, function (a) {
		scope.categorias_premios = a;
	});

	scope.setClientes = function () {
		ajax.ve({method: 'clientes', id: scope.vendedores, user: user}, function (a) {
			scope.selClientes = a;
		});
	}

	scope.submitFilter = function () {


		if (scope.filter_date == "") {
			alert('Por favor ingrese un periodo primero');
			return "";
		}
		;
		var submit = {
			cliente: scope.clientes,
			date: scope.filter_date
		};
		if (user.role != 3) {
			submit.vendedor = scope.vendedores;
		};


		scope.inEdit = false;

		ajax.ve({method: 'filter', params: submit, user: user}, function (a) {
			var collection = [];
			scope.fact_total_anterior = 0;
			scope.fact_curr_total = 0;
			scope.fact_curr_total_clave = 0;
			angular.forEach(a, function (elem, ind) {
				if (elem.cliente != null && elem.cliente != "") {
					elem.currentItemEdit = false;
					elem.total = parseFloat(elem.total || 0);
					elem.total_prod_clave = parseFloat(elem.total_prod_clave || 0);
					elem.ultimo_total = parseFloat(elem.ultimo_total || 0);
					elem.ultimo_prod_clave = parseFloat(elem.ultimo_prod_clave || 0);
					collection.push(elem);

					/*
					 Si es verdadadero significa que es un periodo CERRADO, de lo contrario uno Abierto
					 */
					if (elem.progreso != undefined) {
						elem.closedPeriod = true;
						scope.closedPeriod = true;
					} else {
						scope.fact_total_anterior += parseFloat(elem.total || 0);
						scope.fact_curr_total += parseFloat(elem.total || 0);
						scope.fact_curr_total_clave += parseFloat(elem.total_prod_clave || 0);
						scope.closedPeriod = false;
						elem.closedPeriod = false;
					}
				}
			});

			scope.avance_producto = scope.avancetotal(scope.fact_curr_total, scope.fact_total_anterior);
			scope.fact_curr_total_clave_percent = scope.prodClave(scope.fact_curr_total , scope.fact_curr_total_clave);

			scope.resultados = collection;

		});

		// ajax.ve({method: 'totalByPeriod', date: scope.filter_date},function(a){
		// 	scope.facturacion_total = Math.round(a.total);
		// 	scope.facturacion_prod_clave = Math.round(a.producto_clave);
		// });

		ajax.ve({method: 'checkPeriod', date: scope.filter_date}, function (a) {
			var result = Boolean(parseFloat(a));
			scope.canEdit = result;
		});

		scope.start_app = true;
	}


	scope.percentage = function (total, clave) {
		if (b == 0) {
			return 0;
		} else {
			var result = Math.round((parseFloat(clave) / parseFloat(total)) * 100);
			return result;
		}
	}

	scope.avancetotal = function (curr_total, old_total) {

		if (curr_total != 0 && old_total != 0 && old_total != null && curr_total != null) {
			return Math.round(( parseFloat(curr_total) / parseFloat(old_total) ) * 100);
		} else {
			return 0;
		}
	}

	scope.oldPeriod = function (a) {

		// console.info('Reporting check period:', a != undefined);
		if (a != undefined) {
			return true;
		} else {
			return false;
		}
		return false;
	}

	scope.prodClave = function (curr_total, curr_prod_clave) {
		if (curr_total != 0 && curr_prod_clave != 0) {
			return Math.round((parseFloat(curr_prod_clave) / parseFloat(curr_total)) * 100);
		} else {
			return 0;
		}
	}

	scope.categoria = function (curr_prod_clave, curr_total, old_total) {
		var total = 0;
		var prod_clave = 0;

		/**
		 * Formula
		 *
		 * Porcentaje de prod clave
		 * curr_total / curr_prod_clave * 100
		 *
		 * Porcentaje Avance total
		 * curr_total / old_total * 100
		 */
		var prod_clave = 0;
		if (curr_total != 0 && curr_prod_clave != 0) {
			prod_clave = Math.round((parseFloat(curr_prod_clave) / parseFloat(curr_total)) * 100);
			;
		}
		;

		var avance_total = 0;
		if (curr_total != 0 && curr_prod_clave != 0) {
			avance_total = Math.round((parseFloat(curr_total) / parseFloat(old_total)) * 100);
		}
		;


		if (prod_clave == 0 && avance_total == 0) {
			return 0;
		} else {
			if (avance_total >= 100) {

				var cat = 0;
				scope.categorias_premios.map(function (elem, index) {
					if (elem.max_req == 0) {
						elem.max_req = 999999999999
					}
					;
					if (prod_clave >= elem.min_req && prod_clave <= elem.max_req) {
						cat = elem.categoria;
					}
					;
				});

				return cat;
			} else {
				return 0;
			}
		}


		// console.info('Reporting :', a);
	}


	scope.editItem = function(key,val){


		scope.inEdit = true;
		val.currentItemEdit = true;


		angular.forEach(scope.resultados,function(elem,k){
			if(k == key){
				elem.currentItemEdit = true;
			}else{
				elem.currentItemEdit = false;
			}

		});

		scope.facturacion_total = val.total;
		scope.facturacion_prod_clave = val.total_prod_clave;
		scope.facturacion_prod_clave_percent = scope.prodClave(val.total,val.total_prod_clave);
		scope.fact_total_anterior = val.ultimo_total;
		scope.current_company_name = val.cliente;
		scope.avance_producto = scope.avancetotal(val.total,val.ultimo_total) || 0;
		scope.fact_curr_total = val.total;
		scope.accede_categoria = scope.categoria(val.total_prod_clave,val.total, val.ultimo_total);

		// console.info('REPORTING COLLECTION:', val);
		scope.id_current_edit = val.id;
		var json_data = JSON.parse(val.facturacion);

		scope.setDataMonth(json_data);
		console.info("json data", json_data);
		scope.graph(json_data,val.ultimo_total);




		// console.info('Reporting :', val);
		// scope.avance_producto = scope.avancetotal(val.total,val.ultimo_total);
		// scope.accede_categoria = scope.categoria(val.total_prod_clave, val.total , val.ultimo_total);

	}



	scope.setDataMonth = function(data){
		var date = new Date();
		var month = date.getMonth();
		/**
		 * Mes actual
		 */
		var curr_month_original = scope.monthOriginal[month];

		/**
		 * Index de los meses del periodo
		 */
		var index_curr_period = scope.monthPeriod.indexOf(curr_month_original);

		/**
		 * Guardo estos datos, mes que se esta cargando actualmente
		 */
		scope.periodMonthData.current = {
			month: curr_month_original,
			index: index_curr_period
		};
		scope.periodMonthData.next = {
			month: scope.monthPeriod[index_curr_period + 1],
			index: index_curr_period + 1
		};


		$.each(scope.meses, function(index, val) {
			var each_index_month = scope.monthPeriod.indexOf(index);
			if (each_index_month <=  index_curr_period || each_index_month <=  (index_curr_period + 1) ) {
				if (scope.isAdmin) {
					scope.meses[index].disabled = false;
				}
				scope.meses[index].total = data[scope.firstLetterUpper(index)].facturacion_total;
				scope.meses[index].total_prod_clave = data[scope.firstLetterUpper(index)].facturacion_prod_clave;
				
			};


		});
	}

	scope.firstLetterUpper = function(string){
		 return string.charAt(0).toUpperCase() + string.slice(1);
	}

	scope.ArraySelector = function(collection,index_sel){
		var date = new Date();
		var month = date.getMonth();
		/**
		 * Mes actual
		 */
		var curr_month_original = scope.monthOriginal[month];

		/**
		 * Index del mes actual en el periodo
		 */
		var index_curr_period = scope.monthPeriod.indexOf(curr_month_original);

		var format = [];
		var sum = 0;



		$.each(collection, function(index, val) {
			
			var mes = val.index;
			var month_each_index = scope.monthPeriod.indexOf(val.index);
			var value = val.obj[index_sel];
	
			// si es el primero
			if (month_each_index <= index_curr_period) {

				if (index > 0) {
						
					sum += value;
					format.push({value: sum, label: mes});
				
				}else{
					sum += value;
					format.push({value: value, label: mes});
				}
			}else{
				format.push({value: 0, label: mes});
			}
		});

		return format;
	}

	scope.graphObject = function(){

		var newMeses = [];
		$.each(scope.meses, function(index, val) {
			newMeses.push({obj: val, index: index});
		});

		var graphObject = {};
			graphObject.total = scope.ArraySelector(newMeses,'total');
			graphObject.prod_clave = scope.ArraySelector(newMeses,'total_prod_clave');
	
		return graphObject;
	}

	scope.updateFacturacion = function(){
		// console.info('Reporting :', scope.meses);
		// scope.updateGraph(scope.graphArray());
		ajax.ve({method: 'updateDataFacturacion', data: scope.meses ,id : scope.id_current_edit},function(a){

			/**
			 * Update datos de de la pantalla
			 */

			//console.info("result update", a);

			var json = JSON.parse(a.facturacion);
			scope.graph(json, parseFloat(a.ultimo_total));

			scope.avance_producto = scope.avancetotal(a.total,a.ultimo_total);
			scope.accede_categoria = scope.categoria(a.total_prod_clave, a.total , a.ultimo_total);



			scope.resultados.map(function(elem, index) {
				if (a.id == elem.id) {
					scope.resultados[index].total = a.total;
					scope.resultados[index].total_prod_clave = a.total_prod_clave;
					scope.resultados[index].ultimo_prod_clave = a.ultimo_prod_clave;
					scope.resultados[index].ultimo_prod_clave = a.ultimo_prod_clave;
					scope.resultados[index].ultimo_total = a.ultimo_total;
					scope.resultados[index].facturacion = a.facturacion;

					scope.fact_curr_total = a.total;
					scope.facturacion_prod_clave = a.total_prod_clave;


				};
			})

		});


	}




	scope.formatCurrentFilter = function(a){
		if(a != ""){
			var format = a.split('_');
			var initYear = format[0].split('-');
			var endYear = format[1].split('-');

			return initYear[0]+"/"+endYear[0];
		}else{
			return "";
		}
	}
	scope.graph = function(fact, lastYear){


		var total = [];
		var clave = [];

		var sum = 0;
		var sumProd = 0;

		var ind = 0;
		angular.forEach(fact,function(elem,index){
				sum += elem.facturacion_total;
				sumProd += elem.facturacion_prod_clave;
				total.push({percent: scope.avancetotal(sum,lastYear), value: sum});
				clave.push({percent: scope.prodClave(sum,sumProd), value: sumProd});
		});



		var data = {
			label: ['','','','','','','',''],
			lastColumnCharged : scope.periodMonthData.next.index + 1,
			total: total.reverse(),
			clave: clave.reverse()
		}

		console.info('Array', data);






		//console.info("info object graph:", object);
		//console.info("info formatted object graph:", data);
		scope.canvas.data(data);
		scope.canvas.commit();
		scope.canvas.draw();



	}

				








}])