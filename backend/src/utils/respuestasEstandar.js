export const respuestasEstandar = {
    ok(data){ return { ok:true, data }; },
    error(mensaje){ return { ok:false, mensaje }; }
};
