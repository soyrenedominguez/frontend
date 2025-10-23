document.addEventListener('DOMContentLoaded', async function () {
    await obtener_alumnos();
    document.getElementById('form_alumno').addEventListener('submit', guardar_alumno);
    document.getElementById('form_alumno').addEventListener('reset', limpiar_formulario);
});

async function obtener_alumnos() {
    const res = await fetch('http://soyrenedominguez.atwebpages.com/alumno_api.php');
    const alumnos = await res.json();
    const cuerpo = document.getElementById('lista_alumnos');
    cuerpo.innerHTML = '';
    alumnos.forEach((alumno) => {
        cuerpo.innerHTML += `
            <tr>
                <td>${alumno.idalumno}</td>
                <td>${alumno.numcontrol}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellidopaterno}</td>
                <td>${alumno.apellidomaterno}</td>
                <td>${alumno.curp}</td>
                <td>${alumno.fecha}</td>
                <td>${alumno.email || ''}</td>
                <td>${alumno.direccion}</td>
                <td>${alumno.telefono}</td>
                <td>
                    <button class='btn btn-warning btn-sm' onclick='editar_alumno(${JSON.stringify(alumno)})'><i class='fa fa-pen'></i></button>
                    <button class='btn btn-danger btn-sm' onclick='eliminar_alumno(${alumno.idalumno})'><i class='fa fa-trash'></i></button>
                </td>
            </tr>`;
    });
}

function validar_formulario(datos) {
    for (const campo in datos) {
        if ((campo !== 'idalumno' && campo !== 'email') && (!datos[campo] || datos[campo].trim() === '')) {
            return false;
        }
    }
    if (datos.curp && datos.curp.length !== 18) return false;
    if (datos.telefono && datos.telefono.length !== 10) return false;
    return true;
}

async function guardar_alumno(e) {
    e.preventDefault();
    const datos = {
        idalumno: document.getElementById('idalumno').value,
        numcontrol: document.getElementById('numcontrol').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        apellidopaterno: document.getElementById('apellidopaterno').value.trim(),
        apellidomaterno: document.getElementById('apellidomaterno').value.trim(),
        curp: document.getElementById('curp').value.trim(),
        fecha: document.getElementById('fecha').value,
        email: document.getElementById('email').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        telefono: document.getElementById('telefono').value.trim()
    };
    if (!validar_formulario(datos)) {
        alert('Por favor complete todos los campos correctamente.');
        return;
    }
    let res;
    if (datos.idalumno) {
        res = await fetch(`http://soyrenedominguez.atwebpages.com/alumno_api.php?idalumno=${datos.idalumno}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
    } else {
        res = await fetch('../backend/php/alumno_api.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
    }
    if (res.ok) {
        await obtener_alumnos();
        limpiar_formulario();
    } else {
        alert('Error al guardar alumno');
    }
}

window.editar_alumno = function (alumno) {
    document.getElementById('idalumno').value = alumno.idalumno;
    document.getElementById('numcontrol').value = alumno.numcontrol;
    document.getElementById('nombre').value = alumno.nombre;
    document.getElementById('apellidopaterno').value = alumno.apellidopaterno;
    document.getElementById('apellidomaterno').value = alumno.apellidomaterno;
    document.getElementById('curp').value = alumno.curp;
    document.getElementById('fecha').value = alumno.fecha;
    document.getElementById('email').value = alumno.email;
    document.getElementById('direccion').value = alumno.direccion;
    document.getElementById('telefono').value = alumno.telefono;
}

window.eliminar_alumno = async function (idalumno) {
    if (confirm('¿Seguro que deseas eliminar este alumno?')) {
        const res = await fetch(`http://soyrenedominguez.atwebpages.com/alumno_api.php?idalumno=${idalumno}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            await obtener_alumnos();
            limpiar_formulario();
        } else {
            alert('Error al eliminar alumno');
        }
    }
}

function limpiar_formulario() {
    document.getElementById('form_alumno').reset();
    document.getElementById('idalumno').value = '';
}
