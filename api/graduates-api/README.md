# Setup Backend Project on Server
This guide will walk you through setting up the backend project on your server.

## Step-by-Step Instructions
### 1. Update and Install Dependencies
Update the package lists and install OpenJDK 17 and Git:

```sh
sudo apt-get update
sudo apt install openjdk-17-jdk -y
sudo apt install git -y
```

### 2. Clone the Project Repository
Navigate to your home directory and clone the repository:

```sh
cd ~
git clone https://github.com/dew-uff/egressos.git
cd egressos
```

Checkout the main branch and pull the latest changes:

```sh
git checkout main
git pull
```

This project utilizes PostgreSQL as its database system. If you wish to switch to a different database system, you will need to modify the configuration settings in the src/main/resources/application.yml file. This file contains the database connection details, and any changes to the database type would require corresponding updates to these settings.

### 3. Build the Project
Navigate to the project directory and build the project:

```sh
cd api/graduates-api
chmod +x gradlew
sudo ./gradlew
sudo ./gradlew build
```

### 4. Deploy the JAR File
Copy the built JAR file to the /opt directory:

```sh
sudo cp build/libs/graduates-api-0.0.1-SNAPSHOT.jar /opt/egressos.jar
```

### 5. Configure Environment Variables
Create and edit the environment variables file:

```sh
sudo nano /opt/.env
```

Add the following content to the file and replace the placeholder values with actual values:

```makefile
CORS_ORIGINS=""
DB_HOST=""
DB_NAME=""
DB_PASSWORD=""
DB_PORT=""
DB_USERNAME=""
JWT_SECRET=""
MAIL_SENDER_AUTH=""
MAIL_SENDER_DEBUG=""
MAIL_SENDER_HOST=""
MAIL_SENDER_PASSWORD=""
MAIL_SENDER_PORT=""
MAIL_SENDER_PROTOCOL=""
MAIL_SENDER_STARTTLS_ENABLE=""
MAIL_SENDER_USERNAME=""
PORT=""
RESET_PASSWORD_URL=""
TOKEN_EXPIRATION=""
```


### 6. Create the Startup Script
Create and edit the startup script:

```sh
sudo nano /opt/egressos-run.sh
```

Add the following content to the file:

```text
#!/bin/bash

JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64/
WORKDIR=/opt

cd $WORKDIR 
set -a && . .env && set +a
"${JAVA_HOME}/bin/java" -jar egressos.jar
```

Make the script executable:

```sh
sudo chmod +x /opt/egressos-run.sh
```

### 7. Create a User to Run the Application
Create a system group and user to run the application:

```sh
sudo groupadd -r egressosgroup
sudo useradd -r -s /bin/false -g egressosgroup egressosuser
```

Verify the user creation:

```sh
id egressosuser
```

Grant ownership of the /opt directory to the new user and group:

```sh
sudo chown -R egressosuser:egressosgroup /opt
```

### 8. Create a Systemd Service
Create a service unit definition file:

```sh
sudo nano /etc/systemd/system/egressos.service
```

Add the following content to the file:

```makefile

[Unit]
Description=Egressos App Service
After=syslog.target network.target

[Service]
User=egressosuser
Group=egressosgroup

ExecStart=/opt/egressos-run.sh
ExecStop=/bin/kill -15 $MAINPID
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Enable the service to run on startup:

```sh
sudo systemctl enable egressos.service
```

### 9. Manage the Application Service
To manage the application service, use the following commands:

Start the service:

```sh
sudo systemctl start egressos.service
```

Stop the service:

```sh
sudo systemctl stop egressos.service
```

Restart the service:

```sh
sudo systemctl restart egressos.service
```

Check the service status:

```sh
sudo systemctl status egressos.service
```

Check the application logs:

```sh
sudo journalctl -u egressos.service -f
```

Reload the service if any changes are made to the service file:

```sh
sudo systemctl daemon-reload
```

Following these steps will set up and run the backend project on your server
