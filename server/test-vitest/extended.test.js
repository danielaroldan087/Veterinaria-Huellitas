import { test, expect, vi, afterEach } from 'vitest';
import pool from '../src/db.js';
import * as owners from '../src/controllers/propietariosController.js';
import * as pets from '../src/controllers/mascotasController.js';
import * as appointments from '../src/controllers/citasController.js';
import * as visits from '../src/controllers/atencionesController.js';
import * as reports from '../src/controllers/informesController.js';
import { findByEmail } from '../src/repositories/userRepository.js';
import { iniciarSesion } from '../src/controllers/authController.js';
import { exigirPermiso, verificarToken } from '../src/middlewares/authMiddleware.js';
import { errorMiddleware } from '../src/middlewares/errorMiddleware.js';
import auth from '../src/routes/authRoutes.js';
import admin from '../src/routes/adminRoutes.js';
import recovery from '../src/routes/recoveryRoutes.js';
import citasRoutes from '../src/routes/citasRoutes.js';
vi.mock('../src/db.js', () => ({ default: {
  query: () => { throw new Error('BD real bloqueada'); },
  connect: () => { throw new Error('BD real bloqueada'); },
} }));
afterEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); vi.unstubAllEnvs(); });
const empty = { rows: [], rowCount: 0 };
const row = data => ({ rows: [data], rowCount: 1 });
function response() { return { code: 200, body: null, status(n) { this.code=n; return this; }, json(b) { this.body=b; return this; } }; }
function request(overrides={}) { return { body:{}, params:{id:'1'}, query:{}, headers:{}, usuario:{id_usuario:2,id_rol:1,rol:'administrador'}, ...overrides }; }
async function invoke(fn, overrides={}) { const res=response(); await fn(request(overrides),res); return res; }
function route(router, method, path) {
  const layer=router.stack.find(l=>l.route?.path===path && l.route.methods[method]);
  if (!layer) throw new Error(`Ruta no encontrada: ${method} ${path}`);
  return layer.route.stack.at(-1).handle;
}
// Las pruebas directas de handlers no ejercitan el encadenamiento HTTP de Express.
for (const [name,fn] of [
  ['listar propietarios',owners.obtenerPropietarios],['listar mascotas',pets.obtenerMascotas],
  ['listar citas',appointments.obtenerCitas],['listar atenciones',visits.obtenerAtenciones],['listar informes',reports.obtenerInformes],
]) {
 test(name+' sin registros',async()=>{const query=vi.spyOn(pool,'query').mockResolvedValue(empty); const res=await invoke(fn); expect(res.code).toBe(200);expect(query).toHaveBeenCalledTimes(1);});
 test(name+' fallo BD',async()=>{vi.spyOn(pool,'query').mockRejectedValue(new Error('fallo simulado'));expect((await invoke(fn)).code).toBe(500);});
}
for (const [name,fn] of [
 ['actualizar propietario',owners.actualizarPropietario],['actualizar mascota',pets.actualizarMascota],['estado mascota',pets.cambiarEstadoMascota],['reprogramar cita',appointments.reprogramarCita],['cancelar cita',appointments.cancelarCita],['completar cita',appointments.completarCita],['historial mascota',visits.obtenerHistorialMascota],['consultar informe',reports.obtenerInformePorId],
]) test(name+' rechaza ID inválido',async()=>{const q=vi.spyOn(pool,'query');expect((await invoke(fn,{params:{id:'0'}})).code).toBe(400);expect(q).not.toHaveBeenCalled();});
test('crear informe sin contenido',async()=>{expect((await invoke(reports.crearInforme)).code).toBe(400);});
test('repositorio busca correo parametrizado',async()=>{const q=vi.spyOn(pool,'query').mockResolvedValue(row({id_usuario:2}));expect(await findByEmail('a@example.test')).toEqual({id_usuario:2});expect(q.mock.calls[0][1]).toEqual(['a@example.test']);});
test('repositorio sin usuario',async()=>{vi.spyOn(pool,'query').mockResolvedValue(empty);expect(await findByEmail('a@example.test')).toBeUndefined();});
test('controlador login propaga datos faltantes',async()=>{const next=vi.fn();await iniciarSesion(request(),response(),next);expect(next).toHaveBeenCalledWith(expect.objectContaining({status:400}));});
test('permiso: fallo de consulta',async()=>{vi.spyOn(pool,'query').mockRejectedValue(new Error('fallo'));const res=response();const next=vi.fn();await exigirPermiso('citas.ver')(request(),res,next);expect(res.code).toBe(500);expect(next).not.toHaveBeenCalled();});
test('token malformado',async()=>{vi.stubEnv('JWT_SECRET','test-only');const res=response();const next=vi.fn();await verificarToken(request({headers:{authorization:'Bearer invalido'}}),res,next);expect(res.code).toBe(401);expect(next).not.toHaveBeenCalled();});
test('JSON inválido',()=>{const res=response();errorMiddleware({type:'entity.parse.failed'},request(),res,vi.fn());expect(res.code).toBe(400);});
test('cabeceras enviadas delegan error',()=>{const e=new Error('test');const next=vi.fn();errorMiddleware(e,request(),{headersSent:true},next);expect(next).toHaveBeenCalledWith(e);});
test('perfil devuelve usuario',async()=>{const r=await invoke(route(auth,'get','/perfil'));expect(r.body.usuario.id_usuario).toBe(2);});
test('perfil rechaza correo inválido',async()=>{expect((await invoke(route(auth,'put','/perfil'),{body:{nombre:'Ana',correo:'invalido'}})).code).toBe(400);});
test('perfil actualiza datos normalizados',async()=>{const q=vi.spyOn(pool,'query').mockResolvedValue(row({id_usuario:2}));expect((await invoke(route(auth,'put','/perfil'),{body:{nombre:' Ana ',correo:' A@EXAMPLE.TEST '}})).code).toBe(200);expect(q.mock.calls[0][1]).toEqual(['Ana','a@example.test',2]);});
test('cambio contraseña rechaza clave débil',async()=>{expect((await invoke(route(auth,'put','/password'),{body:{actual:'Anterior123',nueva:'x'}})).code).toBe(400);});
test('administración lista usuarios y roles',async()=>{vi.spyOn(pool,'query').mockResolvedValue(empty);expect((await invoke(route(admin,'get','/usuarios'))).body).toEqual({usuarios:[],roles:[]});});
test('administración rechaza nuevo usuario incompleto',async()=>{expect((await invoke(route(admin,'post','/usuarios'))).code).toBe(400);});
test('administración rechaza edición con ID inválido',async()=>{expect((await invoke(route(admin,'put','/usuarios/:id'),{params:{id:'0'}})).code).toBe(400);});
test('administración lista matriz de permisos',async()=>{vi.spyOn(pool,'query').mockResolvedValue(empty);expect((await invoke(route(admin,'get','/roles'))).body).toEqual({roles:[],permisos:[],asignaciones:[]});});
test('estadísticas rechazan fechas invertidas',async()=>{expect((await invoke(route(admin,'get','/estadisticas'),{query:{desde:'2026-11-20',hasta:'2026-11-01'}})).code).toBe(400);});
test('estadísticas devuelve totales',async()=>{vi.spyOn(pool,'query').mockResolvedValueOnce(row({usuarios:3,mascotas:2,propietarios:1})).mockResolvedValueOnce(empty).mockResolvedValueOnce(row({total:0})).mockResolvedValueOnce(empty).mockResolvedValueOnce(empty);const r=await invoke(route(admin,'get','/estadisticas'),{query:{desde:'2026-11-01',hasta:'2026-11-20'}});expect(r.body.totales.usuarios).toBe(3);expect(r.body.atenciones).toBe(0);});
test('administración consulta configuración',async()=>{vi.spyOn(pool,'query').mockResolvedValue(empty);expect((await invoke(route(admin,'get','/configuracion'))).body).toEqual({configuracion:[]});});
test('administración rechaza configuración desconocida',async()=>{expect((await invoke(route(admin,'put','/configuracion'),{body:{desconocida:'x'}})).code).toBe(400);});
test('administración rechaza permiso no booleano',async()=>{expect((await invoke(route(admin,'put','/roles/:id/permisos'),{body:{id_permiso:2,permitido:'si'}})).code).toBe(400);});
test('recuperación rechaza correo incorrecto',async()=>{expect((await invoke(route(recovery,'post','/solicitar'),{body:{correo:'invalido'}})).code).toBe(400);});
test('recuperación sin SMTP',async()=>{vi.stubEnv('SMTP_HOST','');expect((await invoke(route(recovery,'post','/solicitar'),{body:{correo:'a@example.test'}})).code).toBe(503);});
test('restablecimiento rechaza token incorrecto',async()=>{expect((await invoke(route(recovery,'post','/restablecer'),{body:{token:'x',nueva:'Abcdefghi1'}})).code).toBe(400);});

test('lista de veterinarios activos',async()=>{const q=vi.spyOn(pool,'query').mockResolvedValue(row({id_usuario:2,nombre:'Ana'}));const r=await invoke(route(citasRoutes,'get','/veterinarios'));expect(r.body.veterinarios).toEqual([{id_usuario:2,nombre:'Ana'}]);expect(q.mock.calls[0][0]).toMatch(/u.activo = true/);});
