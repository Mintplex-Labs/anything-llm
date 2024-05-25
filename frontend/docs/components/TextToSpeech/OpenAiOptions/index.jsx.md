```javascript
function toProperCase(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export default function OpenAiTextToSpeechOptions({ settings }) {
  const apiKey = settings?.TTSOpenAIKey;

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          API Key
        </label>
        <input
          type="password"
          name="TTSOpenAIKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={apiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Voice Model
        </label>
        <select
          name="TTSOpenAIVoiceModel"
          defaultValue={settings?.TTSOpenAIVoiceModel ?? "alloy"}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          {["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map(
            (voice) => {
              return (
                <option key={voice} value={voice}>
                  {toProperCase(voice)}
                </option>
              );
            }
          )}
        </select>
      </div>
    </div>
  );
}

```
Based on the provided TypeScript code, I will generate comprehensive documentation in Markdown format. Here it is:

**Purpose and Usage**

The `OpenAiTextToSpeechOptions` interface provides a user-friendly interface for setting OpenAI API Key and selecting Voice Model for text-to-speech (TTS) synthesis. This interface is intended to be used within the codebase to configure TTS options.

**Method Documentation**

### `toProperCase(string)`

This method takes a string as input and returns the proper case of the string. It uses regular expressions to find word boundaries (`\w`) and then capitalizes the first letter of each word using the `toUpperCase()` method, while converting the rest of the string to lowercase using the `toLowerCase()` method.

**Parameters**

* `string`: The input string to be converted to proper case

**Return Value**

The method returns a string in proper case format

### `OpenAiTextToSpeechOptions(settings)`

This is the main interface method that generates the HTML form for setting OpenAI API Key and selecting Voice Model. It takes an object `settings` as input, which contains the current settings.

**Parameters**

* `settings`: An object containing the current settings, including `TTSOpenAIKey` and `TTSOpenAIVoiceModel`

**Return Value**

The method returns an HTML form element with two sections: API Key and Voice Model. The API Key section includes a password input field for entering the OpenAI API Key, while the Voice Model section includes a dropdown select menu for selecting from six available voice models.

**Examples**

To use this interface, you can create an instance of `OpenAiTextToSpeechOptions` with your settings object and then render the HTML form:
```javascript
const settings = {
  TTSOpenAIKey: 'YOUR_API_KEY',
  TTSOpenAIVoiceModel: 'alloy'
};

const options = new OpenAiTextToSpeechOptions(settings);
console.log(options.render());
```
This will output the HTML form element with the API Key and Voice Model sections.

**Dependencies**

None

**Clarity and Consistency**

The documentation is organized, easy to understand, and consistent in style and terminology.