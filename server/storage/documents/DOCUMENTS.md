### What is this folder of documents?

This is a temporary cache of the resulting files you have collected from `collector/`. You really should not be adding files manually to this folder. However the general format of this is you should partion data by how it was collected - it will be added to the appropriate namespace when you undergo vectorizing.

You can manage these files from the frontend application.

All files should be JSON files and in general there is only one main required key: `pageContent` all other keys will be inserted as metadata for each document inserted into the vector DB.

There is also a special reserved key called `published` that should be reserved for timestamps.

