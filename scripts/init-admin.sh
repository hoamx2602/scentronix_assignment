#!/bin/bash

# MongoDB authentication details
MONGO_ADMIN_USERNAME="root" # Replace with your MongoDB admin username
MONGO_ADMIN_PASSWORD="thisisapassword" # Replace with your MongoDB admin password
DOCKER_CONTAINER_NAME="mongodb"
MONGO_COLLECTION="users"

# Admin information
ADMIN_USERNAME="admin1670"
ADMIN_PASSWORD='$2b$10$afuycbyKthvIzGEvtoSzV.6LWYHwYf4TFKslJRdo9H9.5QL1lNcbe' # as: 123456
ROLE="admin"

# Add to DB
docker exec -i $DOCKER_CONTAINER_NAME mongosh --username $MONGO_ADMIN_USERNAME --password $MONGO_ADMIN_PASSWORD --eval "db.$MONGO_COLLECTION.insertOne({
  username: '$ADMIN_USERNAME',
  password: '$ADMIN_PASSWORD',
  role: '$ROLE',
  created_at: new Date(),
  updated_at: new Date()
})"

echo "Admin user created with username: $ADMIN_USERNAME"
