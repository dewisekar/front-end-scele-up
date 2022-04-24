import { Connection, Request } from 'tedious'
//import { ipcMain } from 'electron'

const connectToServer = () => {
  return new Promise((resolve, reject) => {
    /*const config = {
            server: process.env.DB_SERVER,
            authentication: {
                type: process.env.DB_AUTHTYPE,
                options: {
                    domain: process.env.DB_DOMAIN,
                    userName: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD
                }
            },
            options: {
                database: process.env.DB_DBNAME,
                instanceName: process.env.DB_INSTANCENAME,

                // These two settings are really important to make successfull connection
                encrypt: false,
                trustServerCertificate: false,

                // This will allow you to access the rows returned. 
                // See 'doneInProc' event below
                rowCollectionOnDone: true
            }
        }*/
    config = {
      server: '35.193.76.67', // or "localhost"
      options: {
        database: 'jiera_config',
      },
      authentication: {
        type: 'default',
        options: {
          userName: 'sqlserver',
          password: 'P@ssw0rd',
        },
      },
    }

    let connection = new Connection(config)

    connection.connect()

    connection.on('connect', function (err) {
      if (err) {
        console.log('Error: ', err)
        reject(err)
      } else {
        // If no error, then good to go...
        console.log('Connection Successful!')
        resolve(connection)
      }
    })

    connection.on('end', () => {
      console.log('Connection Closed!')
    })
  })
}

const readFromDb = (connection, sqlQuery) => {
  return new Promise((resolve, reject) => {
    let user = []

    console.log('Reading rows from the Table...')

    // Read all rows from table
    let request = new Request(sqlQuery, (err, rowCount, rows) => {
      if (err) {
        reject(err)
      } else {
        console.log(rowCount + ' row(s) returned')
        resolve(products)
        connection.close()
      }
    })

    request.on('doneInProc', (rowCount, more, rows) => {
      user = []
      rows.map((row) => {
        let result = {}
        row.map((child) => {
          result[child.metadata.colName] = child.value
        })
        products.push(user)
      })
    })

    // Execute SQL statement
    connection.execSql(request)
  })
}

export const getUsername = (user) => {
  return new Promise((resolve, reject) => {
    connectToServer()
      .then((connection) => {
        let sqlStr = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + user + "'"
        console.log(sqlStr)
        return readFromDb(connection, sqlStr)
      })
      .then((products) => resolve(products))
      .catch((err) => reject(err))
  })
}

//ipcMain.handle('getUsername', getUsername)
