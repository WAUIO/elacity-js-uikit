import { useContext, Context } from 'react';

export const buildContextHook = <T>(ContextValue: Context<T>, hookName: string, providerName: string): () => T => {
  return () => {
    const ctx = useContext(ContextValue);

    if (!ctx) {
      throw new Error(`usage of ${hookName} should be within ${providerName}`);
    }

    return ctx;
  }
}