# How to deploy a private AnythingLLM instance on DigitalOcean using Terraform

With a DigitalOcean account, you can easily deploy a private AnythingLLM instance using Terraform. This will create a URL that you can access from any browser over HTTP (HTTPS not supported). This single instance will run on your own keys, and they will not be exposed. However, if you want your instance to be protected, it is highly recommended that you set the `AUTH_TOKEN` and `JWT_SECRET` variables in the `docker/` ENV.

[Refer to .env.example](../../docker/HOW_TO_USE_DOCKER.md) for data format.

The output of this Terraform configuration will be:
- 1 DigitalOcean Droplet
- An IP address to access your application

**Requirements**
- An DigitalOcean  account with billing information
- Terraform installed on your local machine
  - Follow the instructions in the [official Terraform documentation](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) for your operating system.
- `.env` file that is filled out with your settings and set up in the `docker/` folder


## How to deploy on DigitalOcean
Open your terminal and navigate to the `digitalocean/terraform` folder
1. Replace the token value in the provider "digitalocean" block in main.tf with your DigitalOcean API token.
2. Run the following commands to initialize Terraform, review the infrastructure changes, and apply them:
    ```
    terraform init  
    terraform plan  
    terraform apply  
    ```
Confirm the changes by typing yes when prompted.
4. Once the deployment is complete, Terraform will output the public IP address of your droplet. You can access your application using this IP address.

## How to deploy on DigitalOcean
To delete the resources created by Terraform, run the following command in the terminal:
`
terraform destroy  
`

## Please read this notice before submitting issues about your deployment

**Note:** 
Your instance will not be available instantly. Depending on the instance size you launched with it can take anywhere from 10-20 minutes to fully boot up.

If you want to check the instances progress, navigate to [your deployed instances](https://cloud.digitalocean.com/droplets) and connect to your instance via SSH in browser.

Once connected run `sudo tail -f /var/log/cloud-init-output.log` and wait for the file to conclude deployment of the docker image.


Additionally, your use of this deployment process means you are responsible for any costs of these Digital Ocean resources fully.
