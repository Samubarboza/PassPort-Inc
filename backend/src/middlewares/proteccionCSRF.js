import csrf from 'csurf';

export const proteccionCSRF = csrf({ cookie: true });
