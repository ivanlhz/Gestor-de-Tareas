var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//-------------------------|definicion de tareas|-----------------------------
//Creamos un nuevo tipo de documento para trabajar con nuestra db de mongodb
var Tarea = mongoose.model('Tarea',{
	descripcion:String
});

//Validacion de los campos del modelo
Tarea.schema.path('descripcion').validate(function(value)
{
	value = value.trim();
	var res = /^[^<>()\/\[\]"']*$/.test(value);
	return value && value.length > 0 && res;
},'La descripción es incorrecta.');

//-------------------------|ENRUTAMIENTO|-----------------------------
/* GET home page. */
router.get('/', function(req, res) 
{
	Tarea.find({},function(err,datos){
		if(!err)
		{
			res.render('tareas/index', 
		  	{ 
		  		title: 'Lista de tareas',
		  		flash: req.flash(),
		  		tareas: datos
		  	});
		}else{
			req.flash('error','Error!:'+ err);
			res.redirect('/tareas');
		}
	});
});
router.get('/editar/:id',function(req, res){
	Tarea.findById(req.params.id,function(err,tarea){
		if(!err)
		{
			res.render('tareas/editar',{
				title: 'Editar tarea',
				descripcion: 'Modifique los datos de la tarea y guarde. También puedes borrar o limpiar todos los campos usando el boton de limpiar.',
				flash: req.flash(),
				tarea: tarea
			});
		}else{
			req.flash('error','Error!:'+ err);
			res.redirect('tareas/editar/'+req.params.id);
		}
	})
});

/* POST home page. */
router.post('/',function(req,res){
	var tarea = new Tarea ({descripcion:req.body.descripcion});

	tarea.save(function(err){
		if(!err)
		{
			req.flash('warning','Se ha creado una nueva tarea.');
			res.redirect('/tareas');
		}else{
			//req.flash('error','Error!:'+ JSON.stringify(err.errors, null, 4)); //Mostramos todo el objeto en el error
			req.flash('error','Error!:'+ err.errors.descripcion.message);//Mostramos solo el error de validacion del campo
			res.redirect('/tareas');
		}
	});
});

router.delete('/:id',function(req,res)
{
	//Buscamos el elemento con ese id
	Tarea.findById(req.params.id,function(err,tarea){
		if(!err)
		{
			tarea.remove(function()
			{
				req.flash('warning','La tarea seleccionada se ha borrado.');
				res.redirect('/tareas');
			});
			
		}else{
			req.flash('error','Error!:'+ err);
			res.redirect('/tareas');
		}
	});

});

router.put('/editar/:id',function(req, res){
	Tarea.findById(req.params.id,function(err,tarea){
		if(!err)
		{
			tarea.descripcion = req.body.descripcion;
			tarea.save(function(err){
				if(!err)
				{
					req.flash('warning','Se ha modificado una tarea correctamente.');
					res.redirect('/tareas');
				}else{
					req.flash('error','Error!:'+ err.errors.descripcion.message);
					res.redirect('/tareas/editar/'+req.params.id);
				}
			});
		}else{
			req.flash('error','Error!:'+ err);
			res.redirect('/tareas');
		}
	});
});

module.exports = router;