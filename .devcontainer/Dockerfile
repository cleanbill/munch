FROM mcr.microsoft.com/devcontainers/universal:2-linux

RUN apt-get update && apt-get upgrade -y 
COPY mick /bin/. 
COPY stool /bin/.
RUN chmod +x /bin/mick
RUN chmod +x /bin/stool
