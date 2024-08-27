# MONITORING SYSTEM APPLICATION

### Basic System Design:
![Alt Text](docs/monitoring_system-Page-2.drawio.svg)

### How to check online url?
I offer 2 solutions as follows: (approach 2 for simple)
- Using call http HEAD method to get only header of specific url (not include response body). But with this approach, we cannot make sure all the request will support this method.
- Using Get method to get status of specific url. If this statusCode in (200, 299), we will consider it online.
> If A status code is 3xx, maybe it redirect to another url, but that url return 200. I'm not sure about this case. We need to think carefully.

### Install & Run:
1. Required
    - Node: > v21.5.0
    - Docker: Docker version 27.0.3, build 7d4bcd8
    - Docker compose: Docker Compose version v2.28.1
2. Install: 
```
npm install
```
3. Init DB (optional)
```
docker compose up -d
```
4. Run local
```
npm run start:dev
```

### Main Flow:
- **Admin:** 
  - Only the Admin can access API: POST `/api/url/check-status` to check online URLs from a specific given list URLs.
- **Normal User:**
  - Can store their own urls list: POST `/api/urls`
  - Check their own online urls
    >Maybe we need throttle for this api
  - Can add a new alert channel (email, slack,...) to receive the alert when their urls shut down or something does not work. 
    >At the moment, only one user per channel alert is supported.
  - Can update their alert method by adding another methods like: gmail, slack,...
- **Automation (Schedule):**
  - There is an automatic thread that checks the status of all users' urls every minute. If a user has at least one url that is not working, it will send a notification through the alert channel that the user has registered so that the user can know.

### Before Test:
Before test flow, we need to create an admin account by run shell script (optional for db run by docker, we still create a new admin by manual in database)
1. Run: `chmod +x ./scripts/init-admin.sh`
2. Run: `./scripts/init-admin.sh`
After that, we can login with admin role:
```
username: admin1670
password: strongP@ssword
```


### Test:
Note:
>If using VSCODE, maybe you need to change `"**/*.spec.ts": false,` in `.vscode/settings.json`to see all the spec files
1. Run all:
```
npm run test
```
2. Run specific test:
```
npm run test -- <file name>
```
3. Test coverage
```
npm run test -- --coverage
```
![Alt Text](docs/test_coverage.png)

### Docs:
After starting the app, access: 

- APIs docs: http://localhost:3005/api/docs
![Alt Text](docs/swagger.png)
<br>

- Queue Dashboard: http://localhost:3005/api/queues
![Alt Text](docs/queue_dashboard.png)

### ENV:
Follow env key as the `.env.example` file.
```bash
NODE_ENV=development
PORT=3005

MONGODB_URI=mongodb://root:thisisapassword@localhost:27017

JWT_SECRET=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7JMG9IEbTiM3STvLOauMBNeP12BvDtNZmbwVOrqGlFfALe0nFCN5uWW285SzuGVuwsiM+eqM0NJnTOXM8QUpR+fpXCcBZVidMdy31IUcrDoMoBy9Ab9dgWifVGGta5Yh1M8sOiDxs2NFGLmV+00+9lIohrwgjh1/+2HlLzLDfvkCsuZvEzCBILBbtBTDrEDR
JWT_EXPIRATION=86400

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81
RESEND_API_KEY=
```
