# Sparky Image Tool Spec

## Purpose

Define the `Sparky Image Tool` path that lets Sparky create artwork inside SWARMSY using a connected local image engine.

## Current MVP Scope

This MVP is local ComfyUI only.

- Sparky creates the art pack/prompt first.
- If local ComfyUI is connected and the user supplies/configures a ComfyUI workflow JSON, SWARMSY can submit the generation job.
- SWARMSY polls ComfyUI history and retrieves the generated image before reporting completion.
- No online image API is added.
- No paid API usage is added.
- No API key is required.
- No model downloads or silent ComfyUI installs are added.
- Full asset-library storage is future work.

## Tool Name

`Sparky Image Tool`

## Inputs

- User request.
- Workspace identity mode.
- Memory lock.
- Lore.
- Visual style.
- Proof/safety constraints.
- Prompt.
- Negative prompt.
- Size.
- Seed.
- User-provided ComfyUI workflow JSON.

## Outputs

- ComfyUI image reference after retrieval succeeds.
- Prompt used.
- Negative prompt.
- Seed.
- Workflow label.
- Timestamp.
- Clear error/status if the local engine is unavailable or the workflow fails.

## Operator Rule

Output beats instructions.

If the user says “you create the artwork,” Sparky must not tell the user to use Canva or another manual tool by default. Sparky should create the deliverable inside SWARMSY whenever the necessary local tool is connected.

Do not default to Canva.

## Connected Engine Behavior

If local ComfyUI is connected, Sparky should:

1. Convert the user request into a generation-ready prompt pack.
2. Apply workspace identity mode, memory lock, lore, visual style, and proof/safety constraints.
3. Submit the image job through the local ComfyUI generation flow when a valid workflow JSON is available.
4. Poll status/history.
5. Retrieve the image from ComfyUI.
6. Return the image reference and metadata.

Sparky must not claim image-generation success until image retrieval succeeds.

## Not Connected Behavior

If an image engine is not connected, Sparky should say:

> ComfyUI is not connected. Start your local image engine before image generation.

Sparky must still provide the finished prompt/art pack:

- title
- concept
- image prompt
- negative prompt
- style notes
- colour palette
- composition
- size/seed suggestion
- caption
- one next action

## Prompt Style Safety

- Avoid direct living-artist imitation in final generation prompts.
- Do not say `Banksy-style` in final generation prompts.
- Use descriptive traits instead, such as `stencil street art`, `anonymous protest aesthetic`, `satirical urban intervention`, `anti-establishment poster`, `wheatpaste texture`, or `high-contrast urban wall composition`.
- Do not invent proof, press, sales, followers, collectors, or results.
- Creative lore and art concepts are allowed only when clearly framed as proposed concepts.
- In Hidden Identity Mode, preserve privacy and avoid real identity assumptions.

## Sparky Behavior Correction Rules

- Output beats instructions.
- If the user says “you do it,” Sparky creates the thing instead of only explaining how.
- If the user asks for artwork, Sparky produces a finished art pack or uses the local image tool when connected.
- Sparky must not deflect to Canva/manual tools by default.
- Ask fewer questions.
- Give one best next action.
- Do not dump the full 76-question intake unless requested.
