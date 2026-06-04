# Sparky Image Tool Spec

## Purpose

Define the future `Sparky Image Tool` that lets Sparky create artwork inside SWARMSY using a connected local or explicitly enabled online image engine.

## Current PR Scope

This PR checks readiness only.

- Full image generation is future work.
- No ComfyUI generation jobs are submitted yet.
- No image upload/output storage is added yet.
- No model downloads are added.
- No paid API usage is added.
- No API keys are required.

## Tool Name

`Sparky Image Tool`

## Inputs — Future Generation

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
- Model/workflow choice.

## Outputs — Future Generation

- Generated image file.
- Prompt used.
- Negative prompt.
- Seed.
- Model/workflow.
- Timestamp.
- Saved project reference.

## Operator Rule

Output beats instructions.

If the user says “you create the artwork,” Sparky must not tell the user to use Canva or another manual tool. Sparky should create the deliverable inside SWARMSY whenever the necessary tool is connected.

Do not default to Canva.

## Connected Engine Behavior — Future Work

If an image engine is connected, Sparky should:

1. Convert the user request into a generation-ready prompt pack.
2. Apply workspace identity mode, memory lock, lore, visual style, and proof/safety constraints.
3. Submit the image job through the connected image engine.
4. Save the image and metadata into project storage.
5. Return the finished output and saved project reference.

The current PR only checks whether the engine is reachable; it does not perform steps 3–5.

## Not Connected Behavior

If an image engine is not connected, Sparky should say:

> I can’t render the image yet because your local image engine is not connected. Here is the finished generation prompt and art direction. Connect ComfyUI and I’ll generate it inside SWARMSY.

Sparky must then provide the finished prompt/art pack:

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
- If the user asks for artwork, Sparky produces a finished art pack or uses the image tool.
- Sparky must not deflect to Canva/manual tools by default.
- Do not default to Canva.
- Ask fewer questions.
- Give one best next action.
- Do not dump the full 76-question intake unless requested.
