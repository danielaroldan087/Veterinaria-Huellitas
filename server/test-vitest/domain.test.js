import { test, vi, afterEach } from 'vitest';
afterEach(() => vi.restoreAllMocks());
import assert from 'node:assert/strict';
import { passwordValida } from '../src/domain/passwordPolicy.js';
import { sessionVersion } from '../src/domain/sessionVersion.js';
import { createLoginService } from '../src/services/loginService.js';
import { errorMiddleware } from '../src/middlewares/errorMiddleware.js';
import { AppError } from '../src/errors/AppError.js';
for (const [name, value, expected] of [
 ['válida','Abcdefghi1',true],['corta','Abc1',false],['sin mayúscula','abcdefghi1',false],
 ['sin minúscula','ABCDEFGHI1',false],['sin número','Abcdefghij',false],['nula',null,false],
 ['72 bytes','Aa1'+'x'.repeat(69),true],['73 bytes','Aa1'+'x'.repeat(70),false],
 ['unicode excede bytes','Aa1'+'é'.repeat(35),false]])
 test('Contraseña '+name,()=>assert.equal(passwordValida(value),expected));
test('Versión de sesión estable y cambia con hash o secreto',()=>{
 const v=sessionVersion('hash','secret'); assert.equal(v,sessionVersion('hash','secret'));
 assert.notEqual(v,sessionVersion('otro','secret')); assert.notEqual(v,sessionVersion('hash','otro'));
});
const user={id_usuario:1,nombre:'Prueba',correo:'a@example.test',rol:'veterinario',activo:true,password_hash:'hash'};
function service(overrides={}){return createLoginService({findByEmail:async()=>user,comparePassword:async()=>true,issueToken:()=> 'token-test',...overrides});}
test('Login válido limpia correo y excluye hash',async()=>{const login=service({findByEmail:async email=>{assert.equal(email,user.correo);return user;}});const r=await login({correo:' '+user.correo+' ',password:'x'});assert.equal(r.token,'token-test');assert.equal(r.usuario.rol,'veterinario');assert.equal('password_hash' in r.usuario,false);});
for(const [name, overrides] of [['usuario inexistente',{findByEmail:async()=>undefined}],['inactivo',{findByEmail:async()=>({...user,activo:false})}],['clave incorrecta',{comparePassword:async()=>false}]])test('Rechaza '+name,async()=>{await assert.rejects(service(overrides)({correo:user.correo,password:'x'}),{status:401});});
test('Campos obligatorios no consultan BD',async()=>{await assert.rejects(service({findByEmail:()=>assert.fail('consulta inesperada')})({}),{status:400});});
test('Propaga fallo de infraestructura',async()=>{await assert.rejects(service({findByEmail:async()=>{throw new Error('BD caída')}})({correo:user.correo,password:'x'}),/BD caída/);});
test('Middleware devuelve error de negocio',()=>{let status;const res={status(n){status=n;return this},json(body){assert.equal(status,401);assert.equal(body.mensaje,'Rechazado')}};errorMiddleware(new AppError(401,'Rechazado'),{},res,()=>assert.fail());});
test('Middleware oculta detalles internos',()=>{const res={status(n){assert.equal(n,500);return this},json(body){assert.equal(body.mensaje,'Error interno del servidor')}};errorMiddleware(new Error('secreto'),{path:'/otro'},res,()=>assert.fail());});
