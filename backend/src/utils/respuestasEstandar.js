// esta funcion tenemos para estandarizar o unificar todas las respuestas del back
export const respuestasEstandar = {
    ok(data){ return { ok:true, data }; },
    error(mensaje){ return { ok:false, mensaje }; }
};
