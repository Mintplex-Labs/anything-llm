# Oracle Database Support Integration -- AnythingLLM (Docker

## Overview

This document summarizes the complete implementation required to add
\*\*Oracle Database support\*\* to AnythingLLM's SQL Agent using the
existing class-based connector architecture located at:
server/utils/agents/aibitat/plugins/sql-agent/SQLConnectors/
The implementation follows the same design pattern used by:
- MySQLConnector
- PostgresSQLConnector
- MSSQLConnector
\
Oracle is integrated as a first-class SQL engine without modifying the
core SQL Agent logic.\
\
\-\--\
\
## Objective
\
Enable SQL Agent support for the following connection format:
oracle://username:password@host:1521/SERVICENAME
Using:
- \`oracledb\` (Thin mode)
- Class-based connector pattern
- Existing \`ConnectionStringParser
- Existing validation and execution flow
## 1. Frontend Modifications
### 1.1 Add Oracle to Engine Enum
\*\*File:\*\*
frontend/src/models/system.js
Update engine type:\
\`\`\`js\
(\'postgresql\'\|\'mysql\'\|\'sql-server\')
To:
(\'postgresql\'\|\'mysql\'\|\'sql-server\'\|\'oracle\')

**1.2 Add Oracle to SQL Engine Selector UI**

**Files Modified:**
-   frontend/src/pages/Admin/Agents/SQLConnectorSelection/SQLConnectionModal.jsx
-   frontend/src/pages/Admin/Agents/SQLConnectorSelection/DBConnection.jsx
Add:
\<DBEngine provider=\"oracle\" \... /\>
Also include Oracle icon:
frontend/src/pages/Admin/Agents/SQLConnectorSelection/icons/oracle.png
**1.3 Update Connection String Builder**
Ensure the generated format is:
oracle://user:password@host:1521/SERVICENAME
Where:
-   SERVICENAME = Oracle Service Name
-   Do not use SID unless custom connectString handling is implemented

## 2. Backend Integration
**2.1 Update SQL Engine Typedef**
**File:**
server/utils/agents/aibitat/plugins/sql-agent/SQLConnectors/index.js
Update:
\@typedef {(\'postgresql\'\|\'mysql\'\|\'sql-server\')} SQLEngine

To:
\@typedef {(\'postgresql\'\|\'mysql\'\|\'sql-server\'\|\'oracle\')}
SQLEngine

**2.2 Create Oracle Connector**
**File Created:**
server/utils/agents/aibitat/plugins/sql-agent/SQLConnectors/Oracle.js
**Required Class Structure**
class OracleConnector {\
constructor({ connectionString })\
async runQuery(queryString)\
async validateConnection()\
getTablesSql()\
getTableSchemaSql(table_name)\
}
The class must follow the same structural contract as:
-   MySQLConnector
-   PostgresSQLConnector
-   MSSQLConnector

**2.3 Use ConnectionStringParser**
const parser = new ConnectionStringParser({ scheme: \"oracle\" });
Important:\
The scheme must match the frontend engine name exactly.

**2.4 Validation Query**
Oracle requires:
SELECT 1 FROM DUAL;
Not:
SELECT 1;

**2.5 Table Metadata Queries**
**List Tables**

SELECT table_name FROM user_tables;
**Get Table Schema**

SELECT column_name, data_type\
FROM user_tab_columns\
WHERE table_name = UPPER(\'TABLE_NAME\');

**2.6 Register Oracle Connector**

**File:**
server/utils/agents/aibitat/plugins/sql-agent/SQLConnectors/index.js
Inside getDBClient():
case \"oracle\":\
const { OracleConnector } = require(\"./Oracle\");\
return new OracleConnector(connectionConfig);

**3. Install Oracle Driver**
Inside:
server/
Install:
npm install oracledb
Or add to server/package.json:
\"oracledb\": \"\^6.0.0\"

**4. Docker Considerations**
Running inside Docker requires **no Oracle Instant Client**.
Not required:
-   Oracle Instant Client
-   Native libraries
-   LD_LIBRARY_PATH
-   initOracleClient()

Reason:
-   oracledb defaults to Thin mode
-   Thin mode uses pure TCP
-   Compatible with Node Alpine images
Rebuild image:
docker build -t anythingllm-custom .
Modified Docker file:
docker/dockerfile

**5. Execution Flow After Integration**
**Connection Validation**
Frontend\
↓\
POST /system/validate-sql-connection\
↓\
validateConnection()\
↓\
getDBClient(\"oracle\")\
↓\
new OracleConnector()\
↓\
validateConnection()

**Agent Query Execution**
Agent\
↓\
getDBClient()\
↓\
connector.runQuery()

No core SQL Agent logic modifications are required.

**6. Oracle vs MySQL Differences**
  -----------------------------------------------------------------------
  **MySQL**                       **Oracle**
  ------------------------------- ---------------------------------------
  SELECT 1                        SELECT 1 FROM DUAL

  information_schema              user_tables

  SHOW COLUMNS                    user_tab_columns

  .end()                          .close()

  ? binds                         :1 binds

  Database name                   Service name
  -----------------------------------------------------------------------

All database-specific behavior is encapsulated inside OracleConnector.

**7. Architectural Outcome**

After implementation:
-   Oracle becomes a first-class SQL engine
-   Polymorphism is preserved
-   SQL Agent remains database-agnostic
-   No conditional hacks in core logic
-   Fully aligned with project design

**8. Maintenance Note**

This implementation creates a custom fork.

Future upstream updates may require manual merging of:

-   SQLConnectors/index.js

-   SQLConnectors/

-   Frontend engine enum changes

**9. Complete File Changes**

**Frontend**

1.  frontend/src/pages/Admin/Agents/SQLConnectorSelection/icons/oracle.png

2.  frontend/src/models/system.js

3.  frontend/src/pages/Admin/Agents/SQLConnectorSelection/DBConnection.jsx

4.  frontend/src/pages/Admin/Agents/SQLConnectorSelection/SQLConnectionModal.jsx

**Backend**

5.  server/utils/agents/aibitat/plugins/sql-agent/SQLConnector/utils.js

6.  server/utils/agents/aibitat/plugins/sql-agent/SQLConnectors/Oracle.js

7.  server/utils/agents/aibitat/plugins/sql-agent/SQLConnectors/index.js

8.  server/package.json

**Docker**

9.  docker/dockerfile

**Final Minimal Checklist**

1.  Add Oracle to frontend engine list

2.  Create OracleConnector class

3.  Register in getDBClient()

4.  Install oracledb

5.  Rebuild Docker image

6.  Test with SELECT 1 FROM DUAL

Oracle support is now fully integrated using the native connector
architecture with no impact on existing SQL engines.