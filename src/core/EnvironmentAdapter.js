const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
);
import {LevelDatastore} from "datastore-level";
import {FsDatastore} from "datastore-fs";
import Path from "path";
import os from "os";

export default {
  repoPath: function(path) {
    if (isBrowser()) {
      return path || "aviondb";
    } else {
      return path || Path.join(os.homedir(), ".aviondb");
    }
  },
  datastore: function(path) {
    if (isBrowser()) {
      return new LevelDatastore(Path.join(path, "db"));
    } else {
      return new FsDatastore(Path.join(path, "db"));
    }
  }
};
