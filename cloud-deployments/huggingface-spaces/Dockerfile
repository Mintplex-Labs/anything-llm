# With this dockerfile in a Huggingface space you will get an entire AnythingLLM instance running
# in your space with all features you would normally get from the docker based version of AnythingLLM.
#
# How to use
# - Login to https://huggingface.co/spaces
# - Click on "Create new Space"
# - Name the space and select "Docker" as the SDK w/ a blank template
# - The default 2vCPU/16GB machine is OK. The more the merrier.
# - Decide if you want your AnythingLLM Space public or private.
#   **You might want to stay private until you at least set a password or enable multi-user mode**
# - Click "Create Space"
# - Click on "Settings" on top of page (https://huggingface.co/spaces/<username>/<space-name>/settings)
# - Scroll to "Persistent Storage" and select the lowest tier of now - you can upgrade if you run out.
# - Confirm and continue storage upgrade
# - Go to "Files" Tab (https://huggingface.co/spaces/<username>/<space-name>/tree/main)
# - Click "Add Files"
# - Upload this file or create a file named `Dockerfile` and copy-paste this content into it. "Commit to main" and save.
# - Your container will build and boot. You now have AnythingLLM on HuggingFace. Your data is stored in the persistent storage attached.
# Have Fun 🤗 
# Have issues? Check the logs on HuggingFace for clues.
FROM mintplexlabs/anythingllm:render

USER root
RUN mkdir -p /data/storage
RUN ln -s /data/storage /storage
USER anythingllm

ENV STORAGE_DIR="/data/storage"
ENV SERVER_PORT=7860

ENTRYPOINT ["/bin/bash", "/usr/local/bin/render-entrypoint.sh"]