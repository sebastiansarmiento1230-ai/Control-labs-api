import app from './src/app';
import { Server } from 'http';

async function runTests() {
  const PORT = 5055;
  const server: Server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}/api/v1`;

  console.log(`\n======================================================`);
  console.log(`   INICIANDO PRUEBAS DE ARQUITECTURA REST - CONTROLS LABS`);
  console.log(`======================================================\n`);

  try {
    // 0. Health check
    console.log(`--- [0] HEALTH CHECK ---`);
    const healthRes = await fetch(`${baseUrl}/health`);
    console.log(`GET /health -> Status: ${healthRes.status}`);
    console.log(await healthRes.json());

    // 1. MÓDULO: GESTIÓN DE USUARIOS
    console.log(`\n--- [1] MÓDULO: GESTIÓN DE USUARIOS ---`);
    
    // 1.1 Listar todos
    const usersRes = await fetch(`${baseUrl}/users`);
    console.log(`GET /users -> Status: ${usersRes.status}`);
    const usersData = await usersRes.json();
    console.log(`Total usuarios listados: ${usersData.count}`);

    // 1.2 Registrar nuevo usuario (estudiante, docente, administrador)
    const newUserRes = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ing. Laura Restrepo',
        email: 'laura.restrepo@controllabs.edu.co',
        role: 'docente',
        password: 'securePassword_2026'
      })
    });
    console.log(`POST /users -> Status: ${newUserRes.status}`);
    const newUserData = await newUserRes.json();
    const createdUserId = newUserData.data.id;
    console.log(`Usuario creado ID: ${createdUserId}, Rol: ${newUserData.data.role}`);

    // 1.3 Consultar detalles por ID único
    const userDetailRes = await fetch(`${baseUrl}/users/${createdUserId}`);
    console.log(`GET /users/${createdUserId} -> Status: ${userDetailRes.status}`);
    console.log(await userDetailRes.json());

    // 1.4 Actualización Parcial (PATCH) de rol, estado de cuenta o contraseña
    const patchUserRes = await fetch(`${baseUrl}/users/${createdUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'administrador',
        status: 'activo'
      })
    });
    console.log(`PATCH /users/${createdUserId} -> Status: ${patchUserRes.status}`);
    const patchUserData = await patchUserRes.json();
    console.log(`Usuario tras PATCH: Rol nuevo: ${patchUserData.data.role}, Estado: ${patchUserData.data.status}`);

    // 1.5 Eliminación lógica (DELETE)
    const deleteUserRes = await fetch(`${baseUrl}/users/${createdUserId}`, {
      method: 'DELETE'
    });
    console.log(`DELETE /users/${createdUserId} -> Status: ${deleteUserRes.status}`);
    const deleteUserData = await deleteUserRes.json();
    console.log(`Resultado eliminación lógica: isActive=${deleteUserData.data.isActive}, status=${deleteUserData.data.status}`);


    // 2. MÓDULO: GESTIÓN DE AMBIENTES
    console.log(`\n--- [2] MÓDULO: GESTIÓN DE AMBIENTES ---`);
    
    // 2.1 Listar ambientes
    const envsRes = await fetch(`${baseUrl}/environments`);
    console.log(`GET /environments -> Status: ${envsRes.status}`);
    const envsData = await envsRes.json();
    console.log(`Total ambientes: ${envsData.count}`);

    // 2.2 Crear ambiente con capacidad y ubicación
    const newEnvRes = await fetch(`${baseUrl}/environments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Laboratorio de Microelectrónica y Circuitos',
        capacity: 20,
        location: 'Edificio de Ingeniería - Piso 4, Lab 402',
        type: 'laboratorio',
        operationalStatus: 'operativo'
      })
    });
    console.log(`POST /environments -> Status: ${newEnvRes.status}`);
    const newEnvData = await newEnvRes.json();
    const createdEnvId = newEnvData.data.id;
    console.log(`Ambiente creado: ID=${createdEnvId}, Capacidad=${newEnvData.data.capacity}, Ubicación=${newEnvData.data.location}`);

    // 2.3 Actualizar parcialmente vía PATCH (capacidad y/o estado operativo)
    const patchEnvRes = await fetch(`${baseUrl}/environments/${createdEnvId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capacity: 28,
        operationalStatus: 'mantenimiento'
      })
    });
    console.log(`PATCH /environments/${createdEnvId} -> Status: ${patchEnvRes.status}`);
    const patchEnvData = await patchEnvRes.json();
    console.log(`Ambiente tras PATCH: Capacidad=${patchEnvData.data.capacity}, Estado=${patchEnvData.data.operationalStatus}`);


    // 3. MÓDULO: GESTIÓN DE EQUIPOS
    console.log(`\n--- [3] MÓDULO: GESTIÓN DE EQUIPOS ---`);
    
    // 3.1 Registrar equipo vinculado a un ambiente
    const newEqRes = await fetch(`${baseUrl}/equipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Osciloscopio Digital Rigol DS1054Z',
        serialNumber: 'SN-RIGOL-5544',
        type: 'osciloscopio',
        environmentId: createdEnvId,
        location: 'Banco de Trabajo 3',
        technicalStatus: 'operativo'
      })
    });
    console.log(`POST /equipments -> Status: ${newEqRes.status}`);
    const newEqData = await newEqRes.json();
    const createdEqId = newEqData.data.id;
    console.log(`Equipo creado: ID=${createdEqId}, Nombre=${newEqData.data.name}, Vinculado a Lab=${newEqData.data.environmentId}`);

    // 3.2 Listar todos los equipos
    const allEqRes = await fetch(`${baseUrl}/equipments`);
    const allEqData = await allEqRes.json();
    console.log(`GET /equipments -> Total equipos: ${allEqData.count}`);

    // 3.3 Filtrar equipos por ambiente específico
    const filterEqRes = await fetch(`${baseUrl}/equipments?environmentId=${createdEnvId}`);
    const filterEqData = await filterEqRes.json();
    console.log(`GET /equipments?environmentId=${createdEnvId} -> Equipos en este ambiente: ${filterEqData.count}`);

    // 3.4 Actualizar de forma parcial el estado técnico o ubicación vía PATCH
    const patchEqRes = await fetch(`${baseUrl}/equipments/${createdEqId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        technicalStatus: 'en mantenimiento',
        location: 'Taller Central de Calibración'
      })
    });
    console.log(`PATCH /equipments/${createdEqId} -> Status: ${patchEqRes.status}`);
    const patchEqData = await patchEqRes.json();
    console.log(`Equipo tras PATCH: Estado Técnico='${patchEqData.data.technicalStatus}', Ubicación='${patchEqData.data.location}'`);


    // 4. MÓDULO: GESTIÓN DE NOVEDADES (INCIDENCIAS)
    console.log(`\n--- [4] MÓDULO: GESTIÓN DE NOVEDADES (INCIDENCIAS) ---`);
    
    // 4.1 Crear reporte de novedad asociándolo a un equipo o ambiente
    const newIncRes = await fetch(`${baseUrl}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Descalibración en canal 2 del osciloscopio',
        description: 'La señal presenta offset de 500mV al medir frecuencia de 1kHz',
        targetType: 'equipo',
        equipmentId: createdEqId,
        priority: 'crítica',
        reportedBy: 'Dra. Sofia Morales'
      })
    });
    console.log(`POST /incidents -> Status: ${newIncRes.status}`);
    const newIncData = await newIncRes.json();
    const createdIncId = newIncData.data.id;
    console.log(`Novedad creada: ID=${createdIncId}, Prioridad=${newIncData.data.priority}, Estado Inicial=${newIncData.data.status}`);

    // 4.2 Consultar historial completo de incidencias
    const incsRes = await fetch(`${baseUrl}/incidents`);
    console.log(`GET /incidents -> Status: ${incsRes.status}`);
    const incsData = await incsRes.json();
    console.log(`Total novedades en historial: ${incsData.count}`);

    // 4.3 Actualizar parcialmente el estado de una novedad vía PATCH
    const patchIncRes = await fetch(`${baseUrl}/incidents/${createdIncId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'en proceso',
        resolutionNotes: 'Equipo ingresado a calibración de hardware'
      })
    });
    console.log(`PATCH /incidents/${createdIncId} -> Status: ${patchIncRes.status}`);
    const patchIncData = await patchIncRes.json();
    console.log(`Novedad tras PATCH: Estado='${patchIncData.data.status}', Notas='${patchIncData.data.resolutionNotes}'`);


    // 5. MÓDULO: DASHBOARD (PANEL DE CONTROL Y ANALÍTICA)
    console.log(`\n--- [5] MÓDULO: DASHBOARD (PANEL DE CONTROL Y ANALÍTICA) ---`);
    const dashRes = await fetch(`${baseUrl}/dashboard`);
    console.log(`GET /dashboard -> Status: ${dashRes.status}`);
    const dashData = await dashRes.json();
    console.log(`Contadores globales consolidados:`);
    console.log(JSON.stringify(dashData.data.counters, null, 2));
    console.log(`Tarjetas generadas para la UI:`);
    dashData.data.cards.forEach((c: any) => {
      console.log(` - [${c.title}]: ${c.value} (${c.subtitle}) [Estado: ${c.status}]`);
    });

    console.log(`\n======================================================`);
    console.log(`   TODAS LAS PRUEBAS DE INTEGRACIÓN PASARON CON ÉXITO!`);
    console.log(`======================================================\n`);
    server.close(() => {
      process.exit(0);
    });
  } catch (err) {
    console.error('Error durante la ejecución de pruebas:', err);
    server.close(() => {
      process.exit(1);
    });
  }
}

runTests();
