import Store from "./Store.js";
import EnvironmentAdapter from "./EnvironmentAdapter.js";
import { Key } from "interface-datastore";
let datastore = EnvironmentAdapter.datastore(EnvironmentAdapter.repoPath());

class AvionDB extends Store {
  /**
   * Creates a new instance of AvionDB if not present already.
   * If an instance with name is exists, then opens and returns the instance.
   * @param {string} name Name of database
   * @param {Ipfs} ipfs IPFS Instance
   * @param {IStoreOptions} options options to be passed to orbitdb.open() or orbitdb.create()
   * @param {OrbitDBOptions} orbitDbOptions options to be passed to OrbitDB.createInstance()
   * @returns {Promise<AvionDB>} Returns a Promise that resolves to an AvionDB instance
   */

  static async init(name, ipfs, options = {}, orbitDbOptions = {}) {
    if (options.path) {
      this.setDatabaseConfig({ path: options.path });
    }
    const aviondb = await super.init(name, ipfs, options, orbitDbOptions);
    const buf = Buffer.from(
      JSON.stringify({
        address: `/orbitdb/${aviondb.address.root}/${aviondb.address.path}`
      })
    );
    await datastore.open();
    await datastore.put(new Key(`${name}`), buf);
    return Promise.resolve(aviondb);
  }

  /**
   * Lists the existing databases
   * @returns {Promise<Array<string>>} Returns a Promise that resolves to ab Array of names of databases.
   */

  static async listDatabases() {
    const dbs = datastore.query({});
    const list = [];
    for await (const db of dbs) {
      const arr = JSON.parse(db.value.toString()).address.split("/");
      list.push(arr[arr.length - 1]);
    }
    return list;
  }

  /**
   * Sets configuration for AvionDB
   * @param options options to specify the path for AvionDB config folder
   */

  static setDatabaseConfig(options) {
    datastore = EnvironmentAdapter.datastore(
      EnvironmentAdapter.repoPath(options.path)
    );
  }

  /**
   * Get AvionDB configuration details
   */

  static getDatabaseConfig() {
    return datastore;
  }
}

export default AvionDB;
