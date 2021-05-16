import { CreateFunction } from 'node-pg-migrate';

type PFunctions = Parameters<CreateFunction>;

export interface FunctionDefinition {
  params: PFunctions[1];
  options: PFunctions[2];
  definition: PFunctions[3];
}
