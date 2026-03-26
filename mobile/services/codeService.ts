import api from './api';

export interface ExecutePayload {
  code: string;
  language: string;
  input?: string;
}

export interface ExecuteResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export const codeService = {
  async execute(payload: ExecutePayload): Promise<ExecuteResult> {
    const { data } = await api.post('/code/execute', payload);
    const result = data.data ?? data;

    const rawOutput =
      typeof result.output === 'string'
        ? result.output
        : result.output?.stdout ?? result.output?.output ?? '';

    const rawError =
      typeof result.output === 'object' ? result.output?.stderr ?? '' : '';

    return {
      success: result.success !== false,
      output: rawOutput.replace(/\\n/g, '\n').replace(/\\t/g, '\t') || 'No output.',
      error: rawError || result.error || undefined,
      executionTime: result.executionTime,
    };
  },
};
