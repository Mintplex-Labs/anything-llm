# How to Configure HTTPS for Anything LLM AWS private deployment
Instructions for manual https configuration after generating and running the aws cloudformation template (aws_build_from_source_no_credentials.json). Tested on following browsers: Firefox version 119, Chrome version 118, Edge 118.

**Requirements**
- Successful deployment of Amazon Linux 2023 EC2 instance with Docker container running Anything LLM
- Admin priv to configure Elastic IP for EC2 instance via AWS Management Console UI
- Admin priv to configure DNS services (i.e. AWS Route 53) via AWS Management Console UI
- Admin priv to configure EC2 Security Group rules via AWS Management Console UI

## Step 1: Allocate and assign Elastic IP Address to your deployed EC2 instance
1. Follow AWS instructions on allocating EIP here: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#using-instance-addressing-eips-allocating
2. Follow AWS instructions on assigning EIP to EC2 instance here: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#using-instance-addressing-eips-associating  

## Step 2: Configure DNS A record to resolve to the previously assigned EC2 instance via EIP 
These instructions assume that you already have a top-level domain configured and are using a subdomain 
to access AnythingLLM.
1. Follow AWS instructions on routing traffic to EC2 instance here: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-ec2-instance.html 

## Step 3: Install and enable nginx
These instructions are for CLI configuration and assume you are logged in to EC2 instance as the ec2-user.
1. $sudo yum install nginx -y
2. $sudo systemctl enable nginx && sudo systemctl start nginx

## Step 4: Install certbot
These instructions are for CLI configuration and assume you are logged in to EC2 instance as the ec2-user.
1. $sudo yum install -y augeas-libs
2. $sudo python3 -m venv /opt/certbot/
3. $sudo /opt/certbot/bin/pip install --upgrade pip
4. $sudo /opt/certbot/bin/pip install certbot certbot-nginx
5. $sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot

## Step 5: Configure temporary Inbound Traffic Rule for Security Group to certbot DNS verification
1. Follow AWS instructions on creating inbound rule (http port 80 0.0.0.0/0) for EC2 security group here: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/working-with-security-groups.html#adding-security-group-rule

## Step 6: Comment out default http NGINX proxy configuration
These instructions are for CLI configuration and assume you are logged in to EC2 instance as the ec2-user.
1. $sudo vi /etc/nginx/nginx.conf
2. In the nginx.conf file, comment out the default server block configuration for http/port 80. It should look something like the following:
#    server {
#        listen       80;
#        listen       [::]:80;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#        location = /404.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#        location = /50x.html {
#        }
#    }
3. Enter ':wq' to save the changes to the nginx default config

## Step 7: Create simple http proxy configuration for AnythingLLM 
These instructions are for CLI configuration and assume you are logged in to EC2 instance as the ec2-user.
1. $sudo vi /etc/nginx/conf.d/anything.conf
2. Add the following configuration ensuring that you add your FQDN:.
server {

   listen 80;
   server_name [insert FQDN here];
   location / {
      proxy_pass  http://0.0.0.0:3001;
      }
}
3. Enter ':wq' to save the changes to the anything config file

## Step 8: Test nginx http proxy config and restart nginx service
These instructions are for CLI configuration and assume you are logged in to EC2 instance as the ec2-user.
1. $sudo nginx -t
2. $sudo systemctl restart nginx
3. Navigate to http://FQDN in a browser and you should be proxied to the AnythingLLM web UI.

## Step 9: Generate/install cert
These instructions are for CLI configuration and assume you are logged in to EC2 instance as the ec2-user.
1. $sudo certbot --nginx -d [Insert FQDN here] 
    Example command: $sudo certbot --nginx -d anythingllm.exampleorganization.org
    This command will generate the appropriate certificate files, write the files to /etc/letsencrypt/live/yourFQDN, and make updates to the nginx
    configuration file for anythingllm locdated at /etc/nginx/conf.d/anything.llm
3. Enter the email address you would like to use for updates.
4. Accept the terms of service.
5. Accept or decline to recieve communication from letsencrypt.

## Step 10: Test Cert installation
1. $sudo cat /etc/nginx/conf.d/anything.conf
Your should see a completely updated configuration that includes https/443 and a redirect configuration for http/80. 
2. Navigate to https://FQDN in a browser and you should be proxied to the AnythingLLM web UI.

## Step 11: (Optional) Remove temporary Inbound Traffic Rule for Security Group to certbot DNS verification
1. Follow AWS instructions on deleting inbound rule (http port 80 0.0.0.0/0) for EC2 security group here: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/working-with-security-groups.html#deleting-security-group-rule
