import { passwordValida } from "../domain/passwordPolicy.js";
import { Router } from 'express';
import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import pool from '../db.js';
const router=Router();
const digest=t=>createHash('sha256').update(t).digest('hex');
const generic='Si existe una cuenta activa, recibirás las instrucciones.';
const limits=new Map();
function limit(req,res,next){const now=Date.now();for(const [k,v] of limits)if(v.until<=now)limits.delete(k);const k=req.ip;const v=limits.get(k)||{n:0,until:now+15*60*1000};if(++v.n>15)return res.status(429).json({mensaje:'Demasiadas solicitudes. Intenta más tarde.'});limits.set(k,v);next();}
router.post('/solicitar',limit,async(req,res)=>{
 const correo=req.body?.correo;
 if(typeof correo!=='string'||correo.length>150||!/^\S+@\S+\.\S+$/.test(correo.trim()))return res.status(400).json({mensaje:'Correo inválido'});
 const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASSWORD,SMTP_FROM,FRONTEND_URL}=process.env;
 if(!SMTP_HOST||!SMTP_USER||!SMTP_PASSWORD||!SMTP_FROM||!FRONTEND_URL)return res.status(503).json({mensaje:'Recuperación por correo no configurada. Contacta al administrador.'});
 let c;try{
 const {default:nodemailer}=await import('nodemailer');
 const mail=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:Number(SMTP_PORT)===465,requireTLS:true,auth:{user:SMTP_USER,pass:SMTP_PASSWORD},connectionTimeout:10000,socketTimeout:15000});
 c=await pool.connect();await c.query('BEGIN');
 const u=(await c.query('SELECT id_usuario,correo FROM usuarios WHERE LOWER(correo)=LOWER($1) AND activo FOR UPDATE',[correo.trim()])).rows[0];
 if(!u){await c.query('COMMIT');return res.json({mensaje:generic});}
 const token=randomBytes(32).toString('hex');const url=new URL('/recuperar-password',FRONTEND_URL);url.hash='token='+token;
 await c.query('UPDATE recuperaciones_password SET fecha_uso=NOW() WHERE id_usuario=$1 AND fecha_uso IS NULL',[u.id_usuario]);
 await c.query("INSERT INTO recuperaciones_password(id_usuario,token_hash,fecha_expiracion) VALUES($1,$2,NOW()+INTERVAL '30 minutes')",[u.id_usuario,digest(token)]);
 await c.query('COMMIT');
 await mail.sendMail({from:SMTP_FROM,to:u.correo,subject:'Recuperación de contraseña - Huellitas de Amor',text:`Abre este enlace personal en los próximos 30 minutos: ${url.href}\nSi no solicitaste el cambio, ignora este mensaje.`});
 return res.json({mensaje:generic});
 }catch(e){if(c)await c.query('ROLLBACK').catch(()=>{});console.error('Recuperación: error de envío o almacenamiento');return res.json({mensaje:generic});}finally{c?.release();}
});
router.post('/restablecer',limit,async(req,res)=>{
 const {token,nueva}=req.body||{};
 if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token)||!passwordValida(nueva))return res.status(400).json({mensaje:'Enlace o contraseña inválidos'});
 let c;try{const hash=await bcrypt.hash(nueva,12);c=await pool.connect();await c.query('BEGIN');
 const candidate=(await c.query('SELECT id_usuario FROM recuperaciones_password WHERE token_hash=$1',[digest(token)])).rows[0];
 if(!candidate){await c.query('ROLLBACK');return res.status(400).json({mensaje:'Enlace inválido o vencido'});}
 const u=(await c.query('SELECT activo FROM usuarios WHERE id_usuario=$1 FOR UPDATE',[candidate.id_usuario])).rows[0];
 const r=await c.query('UPDATE recuperaciones_password SET fecha_uso=NOW() WHERE token_hash=$1 AND fecha_uso IS NULL AND fecha_expiracion>NOW() RETURNING id_usuario',[digest(token)]);
 if(!u?.activo||!r.rowCount){await c.query('ROLLBACK');return res.status(400).json({mensaje:'Enlace inválido o vencido'});}
 await c.query('UPDATE usuarios SET password_hash=$1 WHERE id_usuario=$2',[hash,candidate.id_usuario]);await c.query('UPDATE recuperaciones_password SET fecha_uso=NOW() WHERE id_usuario=$1 AND fecha_uso IS NULL',[candidate.id_usuario]);await c.query('COMMIT');res.json({mensaje:'Contraseña actualizada'});
 }catch(e){if(c)await c.query('ROLLBACK').catch(()=>{});res.status(500).json({mensaje:'No se pudo restablecer la contraseña'});}finally{c?.release();}
});
export default router;
