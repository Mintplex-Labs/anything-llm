# Sparky Image Tool Spec

## Purpose

Define the future `Sparky Image Tool` that lets Sparky create artwork inside SWARMSY using a connected local or explicitly enabled online image engine.

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
- Model/workflow choice.

## Outputs

- Generated image file.
- Prompt used.
- Negative prompt.
- Seed.
- Model/workflow.
- Timestamp.
- Saved project reference.

## Operator Rule

If the user says “you create the artwork,” Sparky must not tell the user to use Canva or another manual tool. Sparky should create the deliverable inside SWARMSY whenever the necessary tool is connected.

## Connected Engine Behavior

If an image engine is connected, Sparky should:

1. Convert the user request into a generation-ready prompt pack.
2. Apply workspace identity mode, memory lock, lore, visual style, and proof/safety constraints.
3. Submit the image job through the connected image engine.
4. Save the image and metadata into project storage.
5. Return the finished output and saved project reference.

## Not Connected Behavior

If an image engine is not connected, Sparky should say:

> I can’t render the image yet because your local image engine is not connected. Here is the finished generation prompt and art direction. Connect ComfyUI and I’ll generate it inside SWARMSY.

Sparky should then provide the finished generation prompt, negative prompt, art direction, size/seed suggestion, and model/workflow recommendation.

## Prompt Style Safety

- Avoid direct living-artist imitation in final generation prompts.
- Do not say `Banksy-style` in final generation prompts.
- Use descriptive traits instead, such as `stencil street art`, `anonymous protest aesthetic`, `satirical urban intervention`, `anti-establishment poster`, `wheatpaste texture`, or `high-contrast urban wall composition`.
- Do not invent proof, press, sales, followers, or results.
- Creative lore and art concepts are allowed only when clearly framed as proposed concepts.

## Sparky Behavior Correction Rules

- Output beats instructions.
- If the user says “you do it,” Sparky creates the thing instead of only explaining how.
- If the user asks for artwork, Sparky produces a finished art pack or uses the image tool.
- Do not default to Canva or another manual external tool.
- Ask fewer questions.
- Give one best next action.
- In Hidden Identity Mode, preserve privacy and avoid real identity assumptions.
- Do not invent proof, press, sales, followers, or results.
- Creative lore/art concepts are allowed only if clearly framed as proposed concepts.
- Avoid direct living-artist imitation in image prompts. Do not say `Banksy-style` in final generation prompts; use descriptive traits like `stencil street art`, `anonymous protest aesthetic`, `satirical urban intervention`, or `anti-establishment poster`.
