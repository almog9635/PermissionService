# Use official Deno image as the base
FROM denoland/deno:alpine-2.3.1

# Set the working directory
WORKDIR /app

# Copy your project files
COPY . .

# Set permissions (optional, for Alpine)
RUN chmod -R 755 .

# Cache dependencies
RUN deno cache --lock=deno.lock main.ts

EXPOSE 4002

# Set the entry point command
CMD ["run", "--allow-all", "main.ts"]
