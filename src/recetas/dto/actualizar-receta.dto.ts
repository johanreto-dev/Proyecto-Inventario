import { CrearRecetaDto } from "./crear-receta.dto";

// Misma forma que crear: nombre + lista completa de items.
// El servicio se encarga de reemplazar todo el contenido anterior.
export class ActualizarRecetaDto extends CrearRecetaDto {}
