# How to deploy a private AnythingLLM instance on GCP

With a GCP account you can easily deploy a private AnythingLLM instance on GCP. This will create a url that you can access from any browser over HTTP (HTTPS not supported). This single instance will run on your own keys and they will not be exposed - however if you want your instance to be protected it is highly recommend that you set the `AUTH_TOKEN` and `JWT_SECRET` variables in the `docker/` ENV.

[Refer to .env.example](../../docker/HOW_TO_USE_DOCKER.md) for data format.

The output of this cloudformation stack will be:
- 1 GCP VM
- 1 Security Group with 0.0.0.0/0 access on Ports 22 & 3001
- 1 GCP VM Volume `gb2` of 10Gib minimum

**Requirements**
- An GCP account with billing information.
  - AnythingLLM (GUI + document processor) must use a n1-standard-1 minimum and 10Gib SSD hard disk volume
- `.env` file that is filled out with your settings and set up in the `docker/` folder

## How to deploy on GCP
Open your terminal
1. Generate your specific cloudformation document by running `yarn generate:gcp_deployment` from the project root directory.
2. This will create a new file (`gcp_deploy_anything_llm_with_env.yaml`) in the `gcp/deployment` folder.
3. Log in to your GCP account using the following command:
    ```
    gcloud auth login 
    ```

4. After successful login, Run the following command to create a deployment using the Deployment Manager CLI:

  ```

  gcloud deployment-manager deployments create anything-llm-deployment --config gcp/deployment/gcp_deploy_anything_llm_with_env.yaml

  ```

Once you execute these steps, the CLI will initiate the deployment process on GCP based on your configuration file. You can monitor the deployment status and view the outputs using the Google Cloud Console or the Deployment Manager CLI commands.

```
gcloud compute instances get-serial-port-output anything-llm-instance 
```

ssh into the instance

```
gcloud compute ssh anything-llm-instance 
```

Delete the deployment
```
gcloud deployment-manager deployments delete anything-llm-deployment 
```

## Please read this notice before submitting issues about your deployment

**Note:** 
Your instance will not be available instantly. Depending on the instance size you launched with it can take anywhere from 10-20 minutes to fully boot up.

If you want to check the instances progress, navigate to [your deployed instances](https://console.cloud.google.com/compute/instances) and connect to your instance via SSH in browser.

Once connected run `sudo tail -f /var/log/cloud-init-output.log` and wait for the file to conclude deployment of the docker image.


Additionally, your use of this deployment process means you are responsible for any costs of these GCP resources fully.
