import configData from '../appconfig.json'

const baseUrl = 'http://localhost:5002'
// const baseUrl = configData.MW_SERVER_URL
const pythonUrl = configData.PYTHON_SERVER_URL

export { baseUrl, pythonUrl }
