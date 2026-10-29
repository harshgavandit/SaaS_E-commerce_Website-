const test = require('node:test');
const assert = require('node:assert/strict');
const { ChatboatService } = require('../src/services/ChatbotService');

test('chat uses the supported model and a bounded response without a provider call', async () => {
  const previous = process.env.GEMINI_MODEL;
  delete process.env.GEMINI_MODEL;
  const calls = [];
  const service = new ChatboatService({ clientFactory: async () => ({ models: {
    generateContent: async request => { calls.push(request); return { text: '  Ready  ' }; },
  } }) });
  try {
    const contents = [{ role: 'user', parts: [{ text: 'Hello' }] }];
    assert.equal(await service.chatService(contents), 'Ready');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].model, 'gemini-3.8-flash');
    assert.equal(calls[0].config.maxOutputTokens, 1200);
    assert.equal(calls[0].config.thinkingConfig.thinkingLevel, 'low');
    assert.deepEqual(calls[0].contents, contents);
  } finally {
    if (previous === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previous;
  }
});

test('product answers use the same provider configuration and actual product context', async () => {
  let request;
  const service = new ChatboatService({
    products: { findProductById: async id => id === 'sample' ? { title: 'Sample shirt', color: 'Blue' } : null },
    clientFactory: async () => ({ models: { generateContent: async input => { request = input; return { text: 'Blue' }; } } }),
  });
  assert.equal(await service.askProductQuestion('sample', 'What color is it?'), 'Blue');
  assert.match(request.contents[0].parts[0].text, /Sample shirt/);
  assert.match(request.contents[0].parts[0].text, /What color is it/);
  assert.equal(request.config.maxOutputTokens, 1200);
  request = null;
  assert.match(await service.askProductQuestion('missing', 'What color is it?'), /does not exist/);
  assert.equal(request, null);
});

test('empty and failed provider replies remain failures without an automatic retry', async () => {
  let calls = 0;
  const empty = new ChatboatService({ clientFactory: async () => ({ models: { generateContent: async () => { calls++; return { text: '' }; } } }) });
  await assert.rejects(empty.chatService([]), /empty answer/);
  assert.equal(calls, 1);
  const failed = new ChatboatService({ clientFactory: async () => ({ models: { generateContent: async () => { calls++; throw new Error('Unavailable'); } } }) });
  await assert.rejects(failed.chatService([]), /Unavailable/);
  assert.equal(calls, 2);
});

test('the installed Google SDK serializes the replacement model and response bounds', async t => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  process.env.GEMINI_API_KEY = 'synthetic-provider-key';
  delete process.env.GEMINI_MODEL;
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests++;
    assert.match(String(url), /models\/gemini-3\.8-flash:generateContent/);
    const body = JSON.parse(options.body);
    assert.equal(body.generationConfig.maxOutputTokens, 1200);
    assert.equal(body.generationConfig.thinkingConfig.thinkingLevel, 'low');
    return new Response(JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: 'READY' }] }, finishReason: 'STOP' }] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  try {
    assert.equal(await new ChatboatService().chatService([{ role: 'user', parts: [{ text: 'Hello' }] }]), 'READY');
    assert.equal(requests, 1);
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
  }
});
