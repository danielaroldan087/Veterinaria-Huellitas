import { test, vi, afterEach } from 'vitest';
afterEach(() => vi.restoreAllMocks());
import assert from 'node:assert/strict';
import pool from '../src/db.js';
vi.mock('../src/db.js', () => ({ default: { query: () => { throw new Error('BD real bloqueada'); }, connect: () => { throw new Error('BD real bloqueada'); } } }));
import { crearPropietario, obtenerPropietarioPorId, cambiarEstadoPropietario } from '../src/controllers/propietariosController.js';
import { crearMascota, obtenerMascotaPorId } from '../src/controllers/mascotasController.js';
import { crearCita, obtenerCitaPorId, confirmarCita } from '../src/controllers/citasController.js';
import { crearAtencion, crearDiagnostico, crearTratamiento } from '../src/controllers/atencionesController.js';
import { verificarToken, permitirRoles, exigirPermiso } from '../src/middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';
import { sessionVersion } from '../src/domain/sessionVersion.js';

// Cada prueba sustituye el acceso a datos. Nunca abre una conexión real.
function response(){return {code:200,body:null,status(code){this.code=code;return this;},json(body){this.body=body;return this;}};}
const row=(data)=>({rowCount:1,rows:[data]});
const empty={rowCount:0,rows:[]};
const owner={documento:'123',nombre:'Ana',telefono:'1234567'};
const pet={id_propietario:1,nombre:'Luna',especie:'Canino'};
const visit={id_mascota:1,motivo_consulta:'Control'};
const appointment=()=>({id_mascota:1,id_veterinario:2,motivo:'Control',fecha_inicio:new Date(Date.now()+86400000).toISOString(),fecha_fin:new Date(Date.now()+90000000).toISOString()});
function setup(results=[], transaction=false){
 const calls=[];let released=false;
 const query=async(sql,params)=>{calls.push({sql,params});if(!results.length)assert.fail('Consulta inesperada: '+sql);const r=results.shift();if(r instanceof Error)throw r;return r;};
 vi.spyOn(pool,'query').mockImplementation(transaction?()=>assert.fail('Consulta fuera de transacción'):query);
 vi.spyOn(pool,'connect').mockImplementation(transaction?async()=>({query,release(){released=true;}}):()=>assert.fail('Conexión inesperada'));
 return {calls,released:()=>released,remaining:()=>results.length};
}
async function invoke(fn,body={},id='1'){const res=response();await fn({body,params:{id},usuario:{id_usuario:2,rol:'veterinario'}},res);return res;}
for(const [name,fn,body,id] of [
 ['Propietario sin datos',crearPropietario,{}],['Propietario correo inválido',crearPropietario,{...owner,correo:'incorrecto'}],['Propietario documento demasiado largo',crearPropietario,{...owner,documento:'x'.repeat(31)}],['Propietario ID inválido',obtenerPropietarioPorId,{},'0'],['Estado no booleano',cambiarEstadoPropietario,{activo:'false'}],
 ['Mascota sin propietario',crearMascota,{...pet,id_propietario:0}],['Mascota peso negativo',crearMascota,{...pet,peso_kg:-1}],['Mascota fecha imposible',crearMascota,{...pet,fecha_nacimiento:'2024-02-30'}],['Mascota esterilización inválida',crearMascota,{...pet,esterilizado:'si'}],['Mascota ID inválido',obtenerMascotaPorId,{},'abc'],['Cita ID inválido',obtenerCitaPorId,{},'0'],['Confirmar ID inválido',confirmarCita,{},'x'],['Atención sin motivo',crearAtencion,{id_mascota:1}],['Atención peso inválido',crearAtencion,{...visit,peso_kg:0}],['Diagnóstico ID inválido',crearDiagnostico,{},'0'],['Tratamiento ID inválido',crearTratamiento,{},'0']]){
 test(name,async ()=>{const db=setup();assert.equal((await invoke(fn,body,id)).code,400);assert.equal(db.calls.length,0);});
}
test('Propietario creado con consulta parametrizada',async ()=>{const db=setup([row({id_propietario:1})]);assert.equal((await invoke(crearPropietario,owner)).code,201);assert.deepEqual(db.calls[0].params,[null,'123','Ana','1234567',null,null]);assert.match(db.calls[0].sql,/VALUES \(\$1/);});
test('Documento duplicado devuelve 409',async ()=>{setup([Object.assign(new Error('duplicate'),{code:'23505'})]);assert.equal((await invoke(crearPropietario,owner)).code,409);});
test('Propietario inexistente devuelve 404',async ()=>{setup([empty]);assert.equal((await invoke(obtenerPropietarioPorId)).code,404);});
test('Mascota sin propietario activo es rechazada',async ()=>{const db=setup([empty]);assert.equal((await invoke(crearMascota,pet)).code,400);assert.equal(db.calls.length,1);});
test('Mascota creada con propietario activo',async ()=>{const db=setup([row({id_propietario:1}),row({id_mascota:1})]);assert.equal((await invoke(crearMascota,pet)).code,201);assert.equal(db.calls.length,2);});
test('Cita con horario invertido libera conexión',async ()=>{const db=setup([],true);const b=appointment();b.fecha_fin=b.fecha_inicio;assert.equal((await invoke(crearCita,b)).code,400);assert.equal(db.released(),true);});
test('Cita en conflicto revierte transacción',async ()=>{const db=setup([empty,empty,row({}),row({}),row({}),empty],true);assert.equal((await invoke(crearCita,appointment())).code,409);assert.equal(db.calls.at(-1).sql,'ROLLBACK');assert.equal(db.released(),true);assert.equal(db.remaining(),0);});
test('Cita disponible confirma transacción',async ()=>{const db=setup([empty,empty,row({}),row({}),empty,row({id_cita:1}),empty],true);assert.equal((await invoke(crearCita,appointment())).code,201);assert.equal(db.calls.at(-1).sql,'COMMIT');assert.equal(db.released(),true);assert.equal(db.remaining(),0);});
test('Atención sin mascota activa revierte transacción',async ()=>{const db=setup([empty,empty,empty],true);assert.equal((await invoke(crearAtencion,visit)).code,409);assert.equal(db.calls.at(-1).sql,'ROLLBACK');assert.equal(db.released(),true);});
test('Atención sin cita se registra',async ()=>{const db=setup([empty,row({}),row({id_atencion:1}),empty],true);assert.equal((await invoke(crearAtencion,visit)).code,201);assert.equal(db.calls.at(-1).sql,'COMMIT');assert.equal(db.released(),true);});
test('Atención de otro veterinario rechazada',async ()=>{const db=setup([empty,row({}),row({id_mascota:1,id_veterinario:99}),empty],true);assert.equal((await invoke(crearAtencion,{...visit,id_cita:1})).code,403);assert.equal(db.calls.at(-1).sql,'ROLLBACK');assert.equal(db.released(),true);});
test('Sin token devuelve 401',async ()=>{setup();const res=response();await verificarToken({headers:{}},res,()=>assert.fail());assert.equal(res.code,401);});
test('Rol no autorizado devuelve 403',()=>{const res=response();permitirRoles('administrador')({usuario:{rol:'recepcionista'}},res,()=>assert.fail());assert.equal(res.code,403);});
test('Rol autorizado continúa',()=>{let next=false;permitirRoles('administrador')({usuario:{rol:'administrador'}},response(),()=>{next=true});assert.equal(next,true);});
test('Permiso retirado devuelve 403',async ()=>{setup([empty]);const res=response();await exigirPermiso('mascotas.crear')({usuario:{id_rol:2}},res,()=>assert.fail());assert.equal(res.code,403);});
test('Permiso asignado continúa',async ()=>{const db=setup([row({})]);let next=false;await exigirPermiso('mascotas.crear')({usuario:{id_rol:2}},response(),()=>{next=true});assert.equal(next,true);assert.deepEqual(db.calls[0].params,[2,'mascotas.crear']);});
test('Token previo al cambio de contraseña es rechazado',async ()=>{const old=process.env.JWT_SECRET;process.env.JWT_SECRET='secret-test-no-production';try{setup([row({activo:true,password_hash:'nuevo'})]);const token=jwt.sign({sub:1,version:sessionVersion('anterior',process.env.JWT_SECRET)},process.env.JWT_SECRET,{algorithm:'HS256'});const res=response();await verificarToken({headers:{authorization:'Bearer '+token}},res,()=>assert.fail());assert.equal(res.code,401);}finally{if(old===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=old;}});
