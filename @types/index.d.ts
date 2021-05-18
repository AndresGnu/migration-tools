export { MyContext } from './context';

declare module '@monkeyplus/flow' {
  interface FlowPluginGlobal {
    shared: {
      message: string;
    };
    context: {
      locale: string;
    };
  }
}
